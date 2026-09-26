package com.platform.payment.domain;

public enum PaymentStatus {
    /** Waiting for the customer to pay on the provider's checkout page. */
    PENDING,
    SUCCEEDED,
    /** The checkout expired or the provider declined the payment. */
    FAILED,
    /** Cash on delivery: nothing to collect online. */
    CASH_ON_DELIVERY,
    /** The order was cancelled before anything was charged. */
    CANCELLED,
    REFUNDED
}
