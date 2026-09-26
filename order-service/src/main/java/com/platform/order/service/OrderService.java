package com.platform.order.service;

import com.platform.order.client.MenuClient;
import com.platform.order.client.RestaurantClient;
import com.platform.order.domain.Coupon;
import com.platform.order.domain.OrderPricing;
import com.platform.order.domain.OrderStatus;
import com.platform.order.dto.PlaceOrderRequest;
import com.platform.order.entity.Order;
import com.platform.order.entity.OrderItem;
import com.platform.order.exception.ResourceNotFoundException;
import com.platform.order.messaging.producer.OrderEventProducer;
import com.platform.order.repository.OrderRepository;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository repo;
    private final OrderEventProducer producer;
    private final RestaurantClient restaurantClient;
    private final MenuClient menuClient;

    public Order placeOrder(String userId, PlaceOrderRequest request) {
        RestaurantClient.RestaurantView restaurant = fetchRestaurant(request.restaurantId());
        if (!Boolean.TRUE.equals(restaurant.isOpen())) {
            throw new IllegalStateException("This restaurant is closed right now and is not taking orders");
        }

        // Merge repeated lines for the same item before pricing them.
        Map<Long, Integer> quantities = new LinkedHashMap<>();
        for (PlaceOrderRequest.Line line : request.items()) {
            quantities.merge(line.menuItemId(), line.quantity(), Integer::sum);
        }

        List<OrderItem> items = new ArrayList<>();
        double subtotal = 0;
        for (Map.Entry<Long, Integer> entry : quantities.entrySet()) {
            MenuClient.MenuItemView menuItem = fetchMenuItem(entry.getKey());
            if (!request.restaurantId().equals(menuItem.restaurantId())) {
                throw new IllegalArgumentException("'" + menuItem.name() + "' is not on this restaurant's menu");
            }
            if (!Boolean.TRUE.equals(menuItem.isAvailable())) {
                throw new IllegalStateException("'" + menuItem.name() + "' is sold out right now");
            }
            int quantity = Math.min(entry.getValue(), 20);
            items.add(new OrderItem(menuItem.id(), menuItem.name(), menuItem.price(), quantity, menuItem.isVeg()));
            subtotal += menuItem.price() * quantity;
        }

        OrderPricing.Bill bill = OrderPricing.price(subtotal, Coupon.find(request.couponCode()).orElse(null));

        Order order = new Order();
        order.setUserId(userId);
        order.setRestaurantId(restaurant.id());
        order.setRestaurantName(restaurant.name());
        order.setItems(items);
        order.setSubtotal(bill.subtotal());
        order.setDiscount(bill.discount());
        order.setDeliveryFee(bill.deliveryFee());
        order.setPlatformFee(bill.platformFee());
        order.setGst(bill.gst());
        order.setTotalAmount(bill.total());
        order.setCouponCode(bill.appliedCoupon());
        order.setDeliveryAddress(request.deliveryAddress().trim());
        order.setPaymentMethod(request.paymentMethod());
        order.setStatus(OrderStatus.CREATED);

        Order saved = repo.save(order);
        producer.publishOrderCreated(saved);
        return saved;
    }

    /** An order the caller owns. Someone else's order is reported as not found, not forbidden. */
    public Order getForUser(String userId, Long orderId) {
        return repo.findById(orderId)
                .filter(o -> o.getUserId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
    }

    public List<Order> ordersForUser(String userId) {
        return repo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public Order cancel(String userId, Long orderId) {
        Order order = getForUser(userId, orderId);
        if (!OrderStatus.isCancellable(order.getStatus())) {
            throw new IllegalStateException("This order is already being prepared and can no longer be cancelled");
        }
        order.setStatus(OrderStatus.CANCELLED);
        Order saved = repo.save(order);
        producer.publishOrderCancelled(saved);
        return saved;
    }

    /** Apply a status reported by payment- or delivery-service, ignoring stale or duplicate events. */
    @Transactional
    public void applyStatusEvent(Long orderId, String nextStatus) {
        repo.findById(orderId).ifPresent(order -> {
            String current = order.getStatus();
            boolean allowed = OrderStatus.PAYMENT_FAILED.equals(nextStatus)
                    ? OrderStatus.CREATED.equals(current)
                    : OrderStatus.canAdvance(current, nextStatus);
            if (allowed) {
                order.setStatus(nextStatus);
                repo.save(order);
            }
        });
    }

    private RestaurantClient.RestaurantView fetchRestaurant(Long id) {
        try {
            return restaurantClient.getRestaurant(id);
        } catch (FeignException.NotFound e) {
            throw new ResourceNotFoundException("Restaurant not found with id: " + id);
        } catch (Exception e) {
            throw new IllegalStateException("We couldn't reach the restaurant just now. Please try again.");
        }
    }

    private MenuClient.MenuItemView fetchMenuItem(Long id) {
        try {
            return menuClient.getMenuItem(id);
        } catch (FeignException.NotFound e) {
            throw new IllegalArgumentException("An item in your cart is no longer on the menu");
        } catch (Exception e) {
            throw new IllegalStateException("We couldn't check the menu just now. Please try again.");
        }
    }
}
