package com.lifeos.budget;

import com.lifeos.budget.dto.BudgetRequest;
import com.lifeos.budget.dto.BudgetResponse;
import com.lifeos.common.dto.ApiResponse;
import com.lifeos.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getBudgets(
            @AuthenticationPrincipal User user) {
        List<BudgetResponse> budgets = budgetService.findByCurrentMonth(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(budgets));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BudgetResponse>> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody BudgetRequest request) {
        BudgetResponse response = budgetService.create(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Budget created", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BudgetResponse>> update(
            @AuthenticationPrincipal User user,
            @PathVariable String id,
            @Valid @RequestBody BudgetRequest request) {
        BudgetResponse response = budgetService.update(id, user.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Budget updated", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        budgetService.delete(id, user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Budget deleted", null));
    }
}
