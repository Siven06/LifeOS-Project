package com.lifeos.debt;

import com.lifeos.debt.dto.DebtRequest;
import com.lifeos.debt.dto.DebtResponse;
import com.lifeos.user.User;
import com.lifeos.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DebtService {

    private final DebtRepository debtRepository;
    private final UserRepository userRepository;

    public List<DebtResponse> getDebts(String userId) {
        return debtRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<DebtResponse> getActiveDebts(String userId) {
        return debtRepository.findByUserIdAndStatus(userId, DebtStatus.ACTIVE).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public DebtResponse getDebt(String userId, String debtId) {
        Debt debt = debtRepository.findById(debtId)
                .filter(d -> d.getUser().getId().equals(userId))
                .orElseThrow(() -> new EntityNotFoundException("Debt not found"));
        return toResponse(debt);
    }

    @Transactional
    public DebtResponse createDebt(String userId, DebtRequest request) {
        User user = userRepository.findById(userId).orElseThrow();
        Debt debt = Debt.builder()
                .user(user)
                .name(request.getName())
                .type(request.getType())
                .totalAmount(request.getTotalAmount())
                .remainingAmount(request.getTotalAmount())
                .monthlyPayment(request.getMonthlyPayment())
                .dueDay(request.getDueDay())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .interestRate(request.getInterestRate() != null ? request.getInterestRate() : BigDecimal.ZERO)
                .category(request.getCategory())
                .note(request.getNote())
                .status(DebtStatus.ACTIVE)
                .build();
        return toResponse(debtRepository.save(debt));
    }

    @Transactional
    public DebtResponse updateDebt(String userId, String debtId, DebtRequest request) {
        Debt debt = debtRepository.findById(debtId)
                .filter(d -> d.getUser().getId().equals(userId))
                .orElseThrow(() -> new EntityNotFoundException("Debt not found"));

        debt.setName(request.getName());
        debt.setType(request.getType());
        debt.setTotalAmount(request.getTotalAmount());
        debt.setMonthlyPayment(request.getMonthlyPayment());
        debt.setDueDay(request.getDueDay());
        debt.setStartDate(request.getStartDate());
        debt.setEndDate(request.getEndDate());
        debt.setInterestRate(request.getInterestRate() != null ? request.getInterestRate() : BigDecimal.ZERO);
        debt.setCategory(request.getCategory());
        debt.setNote(request.getNote());

        return toResponse(debtRepository.save(debt));
    }

    @Transactional
    public void deleteDebt(String userId, String debtId) {
        Debt debt = debtRepository.findById(debtId)
                .filter(d -> d.getUser().getId().equals(userId))
                .orElseThrow(() -> new EntityNotFoundException("Debt not found"));
        debtRepository.delete(debt);
    }

    @Transactional
    public DebtResponse makePayment(String userId, String debtId, BigDecimal amount) {
        Debt debt = debtRepository.findById(debtId)
                .filter(d -> d.getUser().getId().equals(userId))
                .orElseThrow(() -> new EntityNotFoundException("Debt not found"));

        BigDecimal newRemaining = debt.getRemainingAmount().subtract(amount);
        if (newRemaining.compareTo(BigDecimal.ZERO) <= 0) {
            debt.setRemainingAmount(BigDecimal.ZERO);
            debt.setStatus(DebtStatus.PAID_OFF);
        } else {
            debt.setRemainingAmount(newRemaining);
        }
        return toResponse(debtRepository.save(debt));
    }

    public BigDecimal getTotalDebt(String userId) {
        return debtRepository.sumRemainingByUserIdAndStatus(userId, DebtStatus.ACTIVE);
    }

    public BigDecimal getMonthlyDebtPayment(String userId) {
        return debtRepository.sumMonthlyPaymentByUserIdAndStatus(userId, DebtStatus.ACTIVE);
    }

    public int getActiveDebtsCount(String userId) {
        return debtRepository.findByUserIdAndStatus(userId, DebtStatus.ACTIVE).size();
    }

    public DebtResponse getNextPayment(String userId) {
        int today = LocalDate.now().getDayOfMonth();
        List<Debt> upcoming = debtRepository.findUpcomingPayments(userId, DebtStatus.ACTIVE, today);
        if (!upcoming.isEmpty()) {
            return toResponse(upcoming.get(0));
        }
        List<Debt> active = debtRepository.findByUserIdAndStatusOrderByDueDayAsc(userId, DebtStatus.ACTIVE);
        return active.isEmpty() ? null : toResponse(active.get(0));
    }

    private DebtResponse toResponse(Debt debt) {
        return DebtResponse.builder()
                .id(debt.getId())
                .name(debt.getName())
                .type(debt.getType())
                .totalAmount(debt.getTotalAmount())
                .remainingAmount(debt.getRemainingAmount())
                .monthlyPayment(debt.getMonthlyPayment())
                .dueDay(debt.getDueDay())
                .startDate(debt.getStartDate())
                .endDate(debt.getEndDate())
                .interestRate(debt.getInterestRate())
                .category(debt.getCategory())
                .note(debt.getNote())
                .status(debt.getStatus())
                .createdAt(debt.getCreatedAt())
                .updatedAt(debt.getUpdatedAt())
                .build();
    }
}