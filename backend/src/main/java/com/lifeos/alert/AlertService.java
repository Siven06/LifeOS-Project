package com.lifeos.alert;

import com.lifeos.alert.dto.AlertResponse;
import com.lifeos.common.exception.ResourceNotFoundException;
import com.lifeos.user.User;
import com.lifeos.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;

    public List<AlertResponse> getActiveAlerts(String userId) {
        return alertRepository
                .findByUserIdAndDismissedFalseAndExpiresAtAfterOrderByCreatedAtDesc(userId, LocalDateTime.now())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public long getUnreadCount(String userId) {
        return alertRepository.countByUserIdAndDismissedFalse(userId);
    }

    @Transactional
    public void dismiss(String alertId, String userId) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert", "id", alertId));
        if (!alert.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Alert does not belong to user");
        }
        alert.setDismissed(true);
        alertRepository.save(alert);
    }

    @Transactional
    public void dismissAll(String userId) {
        List<Alert> alerts = alertRepository.findByUserIdAndDismissedFalseOrderByCreatedAtDesc(userId);
        alerts.forEach(a -> a.setDismissed(true));
        alertRepository.saveAll(alerts);
    }

    @Transactional
    public AlertResponse createAlert(String userId, AlertType type, String title, String message,
                                      AlertSeverity severity, String actionLabel, LocalDateTime expiresAt) {
        Alert alert = Alert.builder()
                .user(User.builder().id(userId).build())
                .type(type)
                .title(title)
                .message(message)
                .severity(severity)
                .actionLabel(actionLabel)
                .expiresAt(expiresAt)
                .build();
        alert = alertRepository.save(alert);
        return toResponse(alert);
    }

    private AlertResponse toResponse(Alert alert) {
        return AlertResponse.builder()
                .id(alert.getId())
                .type(alert.getType())
                .title(alert.getTitle())
                .message(alert.getMessage())
                .severity(alert.getSeverity())
                .dismissed(alert.isDismissed())
                .actionLabel(alert.getActionLabel())
                .createdAt(alert.getCreatedAt())
                .build();
    }
}
