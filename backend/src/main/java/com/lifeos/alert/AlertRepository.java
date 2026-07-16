package com.lifeos.alert;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, String> {

    List<Alert> findByUserIdAndDismissedFalseOrderByCreatedAtDesc(String userId);

    List<Alert> findByUserIdAndDismissedFalseAndExpiresAtAfterOrderByCreatedAtDesc(String userId, java.time.LocalDateTime now);

    long countByUserIdAndDismissedFalse(String userId);
}
