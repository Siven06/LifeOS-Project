package com.lifeos.dashboard;

import com.lifeos.common.dto.ApiResponse;
import com.lifeos.dashboard.dto.DashboardResponse;
import com.lifeos.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard(
            @AuthenticationPrincipal User user) {
        DashboardResponse response = dashboardService.getDashboard(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
