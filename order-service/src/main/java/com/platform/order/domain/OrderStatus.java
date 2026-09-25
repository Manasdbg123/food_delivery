package com.platform.order.domain;

import java.util.List;

/** Order lifecycle. Moves forward only; CANCELLED and PAYMENT_FAILED are dead ends. */
public final class OrderStatus {

    public static final String CREATED = "CREATED";
    public static final String ACCEPTED = "ACCEPTED";
    public static final String PREPARING = "PREPARING";
    public static final String OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY";
    public static final String DELIVERED = "DELIVERED";
    public static final String CANCELLED = "CANCELLED";
    public static final String PAYMENT_FAILED = "PAYMENT_FAILED";

    private static final List<String> SEQUENCE = List.of(CREATED, ACCEPTED, PREPARING, OUT_FOR_DELIVERY, DELIVERED);

    private OrderStatus() {
    }

    public static boolean isCancellable(String status) {
        return CREATED.equals(status) || ACCEPTED.equals(status);
    }

    /**
     * Whether an event may move an order from {@code current} to {@code next}. Events
     * can arrive late or twice; a stale one must never move an order backwards or
     * revive a cancelled one.
     */
    public static boolean canAdvance(String current, String next) {
        int from = SEQUENCE.indexOf(current);
        int to = SEQUENCE.indexOf(next);
        return from >= 0 && to > from;
    }
}
