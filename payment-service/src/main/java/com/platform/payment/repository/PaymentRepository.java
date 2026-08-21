package com.platform.payment.repository;
import com.platform.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
public interface PaymentRepository extends JpaRepository<Payment, Long> {}
