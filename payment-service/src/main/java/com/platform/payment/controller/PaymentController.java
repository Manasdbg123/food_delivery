package com.platform.payment.controller;

import com.platform.payment.dto.CheckoutRequestBody;
import com.platform.payment.dto.CheckoutResponse;
import com.platform.payment.dto.PaymentView;
import com.platform.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private static final String USER = "X-User-Id";

    private final PaymentService payments;

    /** Starts paying for an order. The caller is sent to {@code checkoutUrl} when there is one. */
    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> checkout(@RequestHeader(USER) String userId,
                                                     @Valid @RequestBody CheckoutRequestBody body) {
        return ResponseEntity.ok(payments.startCheckout(userId, body.orderId()));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentView> forOrder(@RequestHeader(USER) String userId, @PathVariable Long orderId) {
        return ResponseEntity.ok(payments.getForUser(userId, orderId));
    }

    /**
     * Stripe's webhook. Public at the gateway; trusted only after the signature over the
     * raw body checks out, which is why the body is taken as an untouched string.
     */
    @PostMapping("/webhook")
    public ResponseEntity<Map<String, Boolean>> webhook(@RequestBody String payload,
                                                        @RequestHeader(value = "Stripe-Signature", required = false) String signature) {
        payments.handleWebhook(payload, signature);
        return ResponseEntity.ok(Map.of("received", true));
    }
}
