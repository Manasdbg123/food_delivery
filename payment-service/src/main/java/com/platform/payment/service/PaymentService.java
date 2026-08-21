package com.platform.payment.service;
import com.platform.payment.entity.Payment;
import com.platform.payment.messaging.producer.PaymentEventProducer;
import com.platform.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
@Service @RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository repo;
    private final PaymentEventProducer producer;
    public void processPayment(Long orderId, Double amount) {
        Payment p = new Payment();
        p.setOrderId(orderId); p.setAmount(amount); p.setStatus("SUCCESS");
        repo.save(p);
        producer.publishPaymentResult(orderId, true);
    }
}
