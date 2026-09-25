package com.platform.order.domain;

import java.util.Arrays;
import java.util.Optional;

/**
 * Coupon rules. The frontend shows the same codes (frontend/src/lib/pricing.js), but
 * only these server-side rules decide what is charged.
 */
public enum Coupon {
    WELCOME50(199, 50, 100, 0, false),
    FLAT100(599, 0, 0, 100, false),
    FREEDEL(149, 0, 0, 0, true);

    final int minOrder;
    final int percent;
    final int maxDiscount;
    final int flat;
    final boolean freeDelivery;

    Coupon(int minOrder, int percent, int maxDiscount, int flat, boolean freeDelivery) {
        this.minOrder = minOrder;
        this.percent = percent;
        this.maxDiscount = maxDiscount;
        this.flat = flat;
        this.freeDelivery = freeDelivery;
    }

    public static Optional<Coupon> find(String code) {
        if (code == null || code.isBlank()) {
            return Optional.empty();
        }
        String normalised = code.trim().toUpperCase();
        return Arrays.stream(values()).filter(c -> c.name().equals(normalised)).findFirst();
    }
}
