package com.lifeos.debt;

import com.lifeos.common.dto.ApiResponse;
import com.lifeos.debt.dto.DebtRequest;
import com.lifeos.debt.dto.DebtResponse;
import com.lifeos.debt.dto.DebtSummaryResponse;
import com.lifeos.debt.dto.PaymentRequest;
import com.lifeos.user.User;
import com.lifeos.user.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/debts")
@RequiredArgsConstructor
public class DebtController {

    private final DebtService debtService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DebtResponse>>> getDebts(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.ok(debtService.getDebts(user.getId())));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<DebtResponse>>> getActiveDebts(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.ok(debtService.getActiveDebts(user.getId())));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DebtSummaryResponse>> getDebtSummary(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        String userId = user.getId();

        BigDecimal totalDebt = debtService.getTotalDebt(userId);
        BigDecimal monthlyPayment = debtService.getMonthlyDebtPayment(userId);
        int activeCount = debtService.getActiveDebtsCount(userId);
        DebtResponse nextPayment = debtService.getNextPayment(userId);

        DebtSummaryResponse summary = DebtSummaryResponse.builder()
                .totalDebt(totalDebt)
                .monthlyPayment(monthlyPayment)
                .activeDebtsCount(activeCount)
                .nextPaymentAmount(nextPayment != null ? nextPayment.getMonthlyPayment() : BigDecimal.ZERO)
                .nextPaymentDate(nextPayment != null ? LocalDate.now().withDayOfMonth(nextPayment.getDueDay()) : null)
                .nextPaymentName(nextPayment != null ? nextPayment.getName() : null)
                .build();

        return ResponseEntity.ok(ApiResponse.ok(summary));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DebtResponse>> getDebt(@AuthenticationPrincipal UserDetails userDetails,
                                                              @PathVariable String id) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.ok(debtService.getDebt(user.getId(), id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DebtResponse>> createDebt(@AuthenticationPrincipal UserDetails userDetails,
                                                                 @Valid @RequestBody DebtRequest request) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.ok(debtService.createDebt(user.getId(), request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DebtResponse>> updateDebt(@AuthenticationPrincipal UserDetails userDetails,
                                                                 @PathVariable String id,
                                                                 @Valid @RequestBody DebtRequest request) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.ok(debtService.updateDebt(user.getId(), id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDebt(@AuthenticationPrincipal UserDetails userDetails,
                                                         @PathVariable String id) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        debtService.deleteDebt(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @PostMapping("/{id}/payment")
    public ResponseEntity<ApiResponse<DebtResponse>> makePayment(@AuthenticationPrincipal UserDetails userDetails,
                                                                  @PathVariable String id,
                                                                  @RequestBody PaymentRequest request) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.ok(debtService.makePayment(user.getId(), id, request.getAmount())));
    }
}