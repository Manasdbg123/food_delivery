package com.platform.order.domain;

/**
 * Turns an item subtotal and an optional coupon into the bill that is charged.
 * Pure arithmetic with no dependencies, so every rule is unit-tested directly.
 */
public final class OrderPricing {

    public static final double DELIVERY_FEE = 40;
    public static final double PLATFORM_FEE = 6;
    public static final double GST_RATE = 0.05;
    public static final double FREE_DELIVERY_ABOVE = 499;

    private OrderPricing() {
    }

    public record Bill(double subtotal, double discount, double deliveryFee, double platformFee,
                       double gst, double total, String appliedCoupon) {
    }

    public static Bill price(double subtotal, Coupon coupon) {
        if (subtotal <= 0) {
            throw new IllegalArgumentException("An order needs at least one item");
        }
        Coupon usable = coupon != null && subtotal >= coupon.minOrder ? coupon : null;

        double discount = 0;
        if (usable != null && usable.percent > 0) {
            discount = Math.min(Math.round(subtotal * usable.percent / 100.0), usable.maxDiscount);
        } else if (usable != null && usable.flat > 0) {
            discount = usable.flat;
        }
        boolean freeDelivery = (usable != null && usable.freeDelivery) || subtotal >= FREE_DELIVERY_ABOVE;
        double deliveryFee = freeDelivery ? 0 : DELIVERY_FEE;
        double gst = Math.round((subtotal - discount) * GST_RATE);
        double total = Math.max(0, subtotal - discount + deliveryFee + PLATFORM_FEE + gst);

        return new Bill(subtotal, discount, deliveryFee, PLATFORM_FEE, gst, total,
                usable == null ? null : usable.name());
    }
}
