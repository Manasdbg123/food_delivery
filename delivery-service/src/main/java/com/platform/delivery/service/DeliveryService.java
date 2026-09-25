package com.platform.delivery.service;

import com.platform.delivery.entity.Delivery;
import com.platform.delivery.messaging.producer.DeliveryEventProducer;
import com.platform.delivery.repository.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.List;

/**
 * Runs each paid order through the kitchen and out to the customer.
 *
 * There is no real rider fleet here, so the timings are simulated: an order spends
 * {@code delivery.prep-seconds} preparing and {@code delivery.ride-seconds} on the
 * road. Every transition is published on delivery-events, which is what the customer's
 * tracking page reflects through order-service.
 */
@Service
@RequiredArgsConstructor
public class DeliveryService {

    public static final String PREPARING = "PREPARING";
    public static final String OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY";
    public static final String DELIVERED = "DELIVERED";
    public static final String CANCELLED = "CANCELLED";

    private static final String[] PARTNERS = {"Rohan Kumar", "Priya Nair", "Arjun Mehta", "Sana Sheikh", "Vikram Rao"};

    private final DeliveryRepository repo;
    private final DeliveryEventProducer producer;
    private final Clock clock;

    @Value("${delivery.prep-seconds:45}")
    private long prepSeconds;

    @Value("${delivery.ride-seconds:60}")
    private long rideSeconds;

    /** Start a delivery for a paid order. Idempotent: a repeated payment event does nothing. */
    @Transactional
    public void start(Long orderId) {
        if (repo.findByOrderId(orderId).isPresent()) {
            return;
        }
        Delivery delivery = new Delivery();
        delivery.setOrderId(orderId);
        long partner = Math.floorMod(orderId, PARTNERS.length);
        delivery.setPartnerId(partner + 1);
        delivery.setPartnerName(PARTNERS[(int) partner]);
        move(delivery, PREPARING);
    }

    @Transactional
    public void cancel(Long orderId) {
        repo.findByOrderId(orderId)
                .filter(d -> PREPARING.equals(d.getStatus()))
                .ifPresent(d -> {
                    d.setStatus(CANCELLED);
                    d.setStatusSince(clock.instant());
                    repo.save(d);
                });
    }

    @Scheduled(fixedDelayString = "${delivery.tick-millis:5000}")
    @Transactional
    public void advance() {
        Instant now = clock.instant();
        due(PREPARING, now.minus(Duration.ofSeconds(prepSeconds))).forEach(d -> move(d, OUT_FOR_DELIVERY));
        due(OUT_FOR_DELIVERY, now.minus(Duration.ofSeconds(rideSeconds))).forEach(d -> move(d, DELIVERED));
    }

    private List<Delivery> due(String status, Instant cutoff) {
        return repo.findByStatusAndStatusSinceBefore(status, cutoff);
    }

    private void move(Delivery delivery, String status) {
        delivery.setStatus(status);
        delivery.setStatusSince(clock.instant());
        repo.save(delivery);
        producer.publishDeliveryStatus(delivery.getOrderId(), status);
    }
}
