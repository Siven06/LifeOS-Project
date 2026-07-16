package com.lifeos.alert;

import com.lifeos.alert.dto.AlertResponse;
import com.lifeos.common.dto.ApiResponse;
import com.lifeos.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AlertResponse>>> getAlerts(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(alertService.getActiveAlerts(user.getId())));
    }

    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(alertService.getUnreadCount(user.getId())));
    }

    @PostMapping("/{id}/dismiss")
    public ResponseEntity<ApiResponse<Void>> dismiss(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        alertService.dismiss(id, user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Alert dismissed", null));
    }

    @PostMapping("/dismiss-all")
    public ResponseEntity<ApiResponse<Void>> dismissAll(
            @AuthenticationPrincipal User user) {
        alertService.dismissAll(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("All alerts dismissed", null));
    }
}
