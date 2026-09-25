package com.platform.order.domain;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class OrderPricingTest {

    @Test
    void chargesDeliveryPlatformFeeAndGstWithoutACoupon() {
        OrderPricing.Bill bill = OrderPricing.price(300, null);
        assertEquals(0, bill.discount());
        assertEquals(40, bill.deliveryFee());
        assertEquals(6, bill.platformFee());
        assertEquals(15, bill.gst());
        assertEquals(361, bill.total());
        assertNull(bill.appliedCoupon());
    }

    @Test
    void deliveryIsFreeAboveTheThreshold() {
        assertEquals(0, OrderPricing.price(499, null).deliveryFee());
        assertEquals(40, OrderPricing.price(498, null).deliveryFee());
    }

    @Test
    void percentageCouponIsCapped() {
        OrderPricing.Bill small = OrderPricing.price(300, Coupon.WELCOME50);
        assertEquals(100, small.discount(), "50% of 300 is 150, capped at 100");
        assertEquals("WELCOME50", small.appliedCoupon());
    }

    @Test
    void gstIsChargedOnTheDiscountedAmount() {
        OrderPricing.Bill bill = OrderPricing.price(620, Coupon.WELCOME50);
        assertEquals(26, bill.gst());          // 5% of (620 - 100)
        assertEquals(552, bill.total());       // matches the checkout page for the same cart
    }

    @Test
    void aCouponBelowItsMinimumIsIgnoredNotRejected() {
        OrderPricing.Bill bill = OrderPricing.price(500, Coupon.FLAT100);
        assertEquals(0, bill.discount());
        assertNull(bill.appliedCoupon());
    }

    @Test
    void freeDeliveryCoupon() {
        assertEquals(0, OrderPricing.price(200, Coupon.FREEDEL).deliveryFee());
    }

    @Test
    void couponCodesAreCaseInsensitiveAndUnknownCodesAreEmpty() {
        assertEquals(Coupon.FLAT100, Coupon.find(" flat100 ").orElseThrow());
        assertTrue(Coupon.find("NOPE").isEmpty());
        assertTrue(Coupon.find(null).isEmpty());
    }

    @Test
    void anEmptyOrderCannotBePriced() {
        assertThrows(IllegalArgumentException.class, () -> OrderPricing.price(0, null));
    }
}
