package com.lifeos.transaction;

import com.lifeos.common.dto.ApiResponse;
import com.lifeos.transaction.dto.TransactionRequest;
import com.lifeos.transaction.dto.TransactionResponse;
import com.lifeos.transaction.dto.TransactionSummaryResponse;
import com.lifeos.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getAll(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) TransactionCategory category,
            @RequestParam(required = false) LocalDate start,
            @RequestParam(required = false) LocalDate end) {

        if ((start == null) != (end == null)) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Both start and end dates are required for date filtering"));
        }

        List<TransactionResponse> transactions;
        if (type != null) {
            transactions = transactionService.findByUserIdAndType(user.getId(), type);
        } else if (category != null) {
            transactions = transactionService.findByUserIdAndCategory(user.getId(), category);
        } else if (start != null && end != null) {
            transactions = transactionService.findByUserIdAndDateRange(user.getId(), start, end);
        } else {
            transactions = transactionService.findByUserId(user.getId());
        }

        return ResponseEntity.ok(ApiResponse.ok(transactions));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TransactionResponse>> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody TransactionRequest request) {
        TransactionResponse response = transactionService.create(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Transaction created", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionResponse>> update(
            @AuthenticationPrincipal User user,
            @PathVariable String id,
            @Valid @RequestBody TransactionRequest request) {
        TransactionResponse response = transactionService.update(id, user.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Transaction updated", response));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<TransactionSummaryResponse>> getSummary(
            @AuthenticationPrincipal User user) {
        TransactionSummaryResponse summary = transactionService.getSummary(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(summary));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        transactionService.delete(id, user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Transaction deleted", null));
    }
}
