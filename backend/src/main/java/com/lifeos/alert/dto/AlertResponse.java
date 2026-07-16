package com.lifeos.alert.dto;

import com.lifeos.alert.AlertSeverity;
import com.lifeos.alert.AlertType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AlertResponse {
    private String id;
    private AlertType type;
    private String title;
    private String message;
    private AlertSeverity severity;
    private boolean dismissed;
    private String actionLabel;
    private LocalDateTime createdAt;
}
