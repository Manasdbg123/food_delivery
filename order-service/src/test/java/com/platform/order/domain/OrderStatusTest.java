package com.platform.order.domain;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class OrderStatusTest {

    @Test
    void statusesOnlyMoveForward() {
        assertTrue(OrderStatus.canAdvance(OrderStatus.CREATED, OrderStatus.ACCEPTED));
        assertTrue(OrderStatus.canAdvance(OrderStatus.ACCEPTED, OrderStatus.OUT_FOR_DELIVERY));
        assertFalse(OrderStatus.canAdvance(OrderStatus.DELIVERED, OrderStatus.PREPARING));
        assertFalse(OrderStatus.canAdvance(OrderStatus.PREPARING, OrderStatus.PREPARING));
    }

    @Test
    void aCancelledOrderIsNeverRevived() {
        assertFalse(OrderStatus.canAdvance(OrderStatus.CANCELLED, OrderStatus.ACCEPTED));
        assertFalse(OrderStatus.canAdvance(OrderStatus.CANCELLED, OrderStatus.DELIVERED));
    }

    @Test
    void onlyOrdersNotYetInTheKitchenCanBeCancelled() {
        assertTrue(OrderStatus.isCancellable(OrderStatus.CREATED));
        assertTrue(OrderStatus.isCancellable(OrderStatus.ACCEPTED));
        assertFalse(OrderStatus.isCancellable(OrderStatus.PREPARING));
        assertFalse(OrderStatus.isCancellable(OrderStatus.DELIVERED));
    }
}
