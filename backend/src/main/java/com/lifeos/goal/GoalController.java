package com.lifeos.goal;

import com.lifeos.common.dto.ApiResponse;
import com.lifeos.goal.dto.GoalProgressRequest;
import com.lifeos.goal.dto.GoalRequest;
import com.lifeos.goal.dto.GoalResponse;
import com.lifeos.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<GoalResponse>>> getGoals(
            @AuthenticationPrincipal User user) {
        List<GoalResponse> goals = goalService.findByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(goals));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<GoalResponse>> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody GoalRequest request) {
        GoalResponse response = goalService.create(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Goal created", response));
    }

    @PatchMapping("/{id}/progress")
    public ResponseEntity<ApiResponse<GoalResponse>> updateProgress(
            @AuthenticationPrincipal User user,
            @PathVariable String id,
            @Valid @RequestBody GoalProgressRequest request) {
        GoalResponse response = goalService.updateProgress(id, user.getId(), request.getAmount());
        return ResponseEntity.ok(ApiResponse.ok("Progress updated", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        goalService.delete(id, user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Goal deleted", null));
    }
}
