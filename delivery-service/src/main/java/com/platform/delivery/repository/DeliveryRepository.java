package com.platform.delivery.repository;

import com.platform.delivery.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    Optional<Delivery> findByOrderId(Long orderId);

    List<Delivery> findByStatusAndStatusSinceBefore(String status, Instant cutoff);
}
