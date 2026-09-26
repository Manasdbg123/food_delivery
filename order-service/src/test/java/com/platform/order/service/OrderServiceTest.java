package com.platform.order.service;

import com.platform.order.client.MenuClient;
import com.platform.order.client.RestaurantClient;
import com.platform.order.domain.OrderStatus;
import com.platform.order.dto.PlaceOrderRequest;
import com.platform.order.entity.Order;
import com.platform.order.exception.ResourceNotFoundException;
import com.platform.order.messaging.producer.OrderEventProducer;
import com.platform.order.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock OrderRepository repo;
    @Mock OrderEventProducer producer;
    @Mock RestaurantClient restaurants;
    @Mock MenuClient menu;
    @InjectMocks OrderService service;

    @BeforeEach
    void saveReturnsItsArgument() {
        lenient().when(repo.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
    }

    private PlaceOrderRequest request(List<PlaceOrderRequest.Line> lines, String coupon) {
        return new PlaceOrderRequest(1L, lines, "Flat 4, Koramangala", "UPI", coupon);
    }

    private void openRestaurant() {
        when(restaurants.getRestaurant(1L)).thenReturn(new RestaurantClient.RestaurantView(1L, "Meghana Foods", true));
    }

    @Test
    void pricesComeFromTheMenuNotTheClient() {
        openRestaurant();
        when(menu.getMenuItem(101L)).thenReturn(new MenuClient.MenuItemView(101L, 1L, "Biryani", 340.0, false, true));
        when(menu.getMenuItem(105L)).thenReturn(new MenuClient.MenuItemView(105L, 1L, "Chicken 65", 280.0, false, true));

        Order order = service.placeOrder("user-1", request(List.of(
                new PlaceOrderRequest.Line(101L, 1), new PlaceOrderRequest.Line(105L, 1)), "welcome50"));

        assertEquals("user-1", order.getUserId());
        assertEquals("Meghana Foods", order.getRestaurantName());
        assertEquals(620, order.getSubtotal());
        assertEquals(100, order.getDiscount());
        assertEquals(552, order.getTotalAmount());
        assertEquals("WELCOME50", order.getCouponCode());
        assertEquals(OrderStatus.CREATED, order.getStatus());
        assertEquals(2, order.getItems().size());
        verify(producer).publishOrderCreated(order);
    }

    @Test
    void repeatedLinesForTheSameItemAreMerged() {
        openRestaurant();
        when(menu.getMenuItem(101L)).thenReturn(new MenuClient.MenuItemView(101L, 1L, "Biryani", 340.0, false, true));

        Order order = service.placeOrder("u", request(List.of(
                new PlaceOrderRequest.Line(101L, 1), new PlaceOrderRequest.Line(101L, 2)), null));

        assertEquals(1, order.getItems().size());
        assertEquals(3, order.getItems().get(0).getQuantity());
        verify(menu, times(1)).getMenuItem(101L);
    }

    @Test
    void anItemFromAnotherRestaurantIsRejected() {
        openRestaurant();
        when(menu.getMenuItem(901L)).thenReturn(new MenuClient.MenuItemView(901L, 9L, "Pizza", 420.0, true, true));

        assertThrows(IllegalArgumentException.class,
                () -> service.placeOrder("u", request(List.of(new PlaceOrderRequest.Line(901L, 1)), null)));
        verify(repo, never()).save(any());
    }

    @Test
    void aSoldOutItemIsRejected() {
        openRestaurant();
        when(menu.getMenuItem(101L)).thenReturn(new MenuClient.MenuItemView(101L, 1L, "Biryani", 340.0, false, false));

        assertThrows(IllegalStateException.class,
                () -> service.placeOrder("u", request(List.of(new PlaceOrderRequest.Line(101L, 1)), null)));
    }

    @Test
    void aClosedRestaurantTakesNoOrders() {
        when(restaurants.getRestaurant(1L)).thenReturn(new RestaurantClient.RestaurantView(1L, "Meghana Foods", false));

        assertThrows(IllegalStateException.class,
                () -> service.placeOrder("u", request(List.of(new PlaceOrderRequest.Line(101L, 1)), null)));
        verifyNoInteractions(menu);
    }

    @Test
    void anotherUsersOrderLooksNotFound() {
        Order order = new Order();
        order.setId(7L);
        order.setUserId("owner");
        when(repo.findById(7L)).thenReturn(Optional.of(order));

        assertThrows(ResourceNotFoundException.class, () -> service.getForUser("intruder", 7L));
        assertSame(order, service.getForUser("owner", 7L));
    }

    @Test
    void cancellingPublishesAnEventAndOnlyWorksBeforeTheKitchen() {
        Order order = new Order();
        order.setId(7L);
        order.setUserId("u");
        order.setStatus(OrderStatus.ACCEPTED);
        when(repo.findById(7L)).thenReturn(Optional.of(order));

        assertEquals(OrderStatus.CANCELLED, service.cancel("u", 7L).getStatus());
        verify(producer).publishOrderCancelled(order);

        order.setStatus(OrderStatus.PREPARING);
        assertThrows(IllegalStateException.class, () -> service.cancel("u", 7L));
    }

    @Test
    void lateEventsNeverMoveAnOrderBackwardsOrReviveIt() {
        Order order = new Order();
        order.setStatus(OrderStatus.OUT_FOR_DELIVERY);
        when(repo.findById(1L)).thenReturn(Optional.of(order));

        service.applyStatusEvent(1L, OrderStatus.PREPARING);
        assertEquals(OrderStatus.OUT_FOR_DELIVERY, order.getStatus());

        order.setStatus(OrderStatus.CANCELLED);
        service.applyStatusEvent(1L, OrderStatus.ACCEPTED);
        assertEquals(OrderStatus.CANCELLED, order.getStatus());
    }

    @Test
    void paymentFailureOnlyAppliesToAnOrderAwaitingPayment() {
        Order order = new Order();
        order.setStatus(OrderStatus.CREATED);
        when(repo.findById(1L)).thenReturn(Optional.of(order));

        service.applyStatusEvent(1L, OrderStatus.PAYMENT_FAILED);
        assertEquals(OrderStatus.PAYMENT_FAILED, order.getStatus());
    }
}
