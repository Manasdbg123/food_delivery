package com.platform.delivery.service;

import com.platform.delivery.entity.Delivery;
import com.platform.delivery.messaging.producer.DeliveryEventProducer;
import com.platform.delivery.repository.DeliveryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class DeliveryServiceTest {

    private final DeliveryRepository repo = mock(DeliveryRepository.class);
    private final DeliveryEventProducer producer = mock(DeliveryEventProducer.class);
    private final Instant now = Instant.parse("2026-09-25T12:00:00Z");
    private DeliveryService service;

    @BeforeEach
    void setUp() {
        service = new DeliveryService(repo, producer, Clock.fixed(now, ZoneOffset.UTC));
        ReflectionTestUtils.setField(service, "prepSeconds", 45L);
        ReflectionTestUtils.setField(service, "rideSeconds", 60L);
        when(repo.save(any(Delivery.class))).thenAnswer(inv -> inv.getArgument(0));
        when(repo.findByStatusAndStatusSinceBefore(any(), any())).thenReturn(List.of());
    }

    @Test
    void aPaidOrderStartsPreparingAndGetsAPartner() {
        when(repo.findByOrderId(12L)).thenReturn(Optional.empty());
        service.start(12L);

        ArgumentCaptor<Delivery> saved = ArgumentCaptor.forClass(Delivery.class);
        verify(repo).save(saved.capture());
        assertEquals(DeliveryService.PREPARING, saved.getValue().getStatus());
        assertEquals(now, saved.getValue().getStatusSince());
        verify(producer).publishDeliveryStatus(12L, DeliveryService.PREPARING);
    }

    @Test
    void aRepeatedPaymentEventStartsNothing() {
        when(repo.findByOrderId(12L)).thenReturn(Optional.of(new Delivery()));
        service.start(12L);
        verify(repo, never()).save(any());
        verifyNoInteractions(producer);
    }

    @Test
    void deliveriesAdvanceOnceTheirTimeIsUp() {
        Delivery cooking = delivery(1L, DeliveryService.PREPARING);
        Delivery riding = delivery(2L, DeliveryService.OUT_FOR_DELIVERY);
        when(repo.findByStatusAndStatusSinceBefore(eq(DeliveryService.PREPARING), eq(now.minusSeconds(45))))
                .thenReturn(List.of(cooking));
        when(repo.findByStatusAndStatusSinceBefore(eq(DeliveryService.OUT_FOR_DELIVERY), eq(now.minusSeconds(60))))
                .thenReturn(List.of(riding));

        service.advance();

        assertEquals(DeliveryService.OUT_FOR_DELIVERY, cooking.getStatus());
        assertEquals(DeliveryService.DELIVERED, riding.getStatus());
        verify(producer).publishDeliveryStatus(1L, DeliveryService.OUT_FOR_DELIVERY);
        verify(producer).publishDeliveryStatus(2L, DeliveryService.DELIVERED);
    }

    @Test
    void cancellingOnlyStopsADeliveryStillInTheKitchen() {
        Delivery riding = delivery(3L, DeliveryService.OUT_FOR_DELIVERY);
        when(repo.findByOrderId(3L)).thenReturn(Optional.of(riding));
        service.cancel(3L);
        assertEquals(DeliveryService.OUT_FOR_DELIVERY, riding.getStatus());

        Delivery cooking = delivery(4L, DeliveryService.PREPARING);
        when(repo.findByOrderId(4L)).thenReturn(Optional.of(cooking));
        service.cancel(4L);
        assertEquals(DeliveryService.CANCELLED, cooking.getStatus());
    }

    private Delivery delivery(Long orderId, String status) {
        Delivery d = new Delivery();
        d.setOrderId(orderId);
        d.setStatus(status);
        d.setStatusSince(now.minusSeconds(120));
        return d;
    }
}
