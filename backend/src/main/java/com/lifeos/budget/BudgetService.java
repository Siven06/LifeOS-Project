package com.lifeos.budget;

import com.lifeos.budget.dto.BudgetRequest;
import com.lifeos.budget.dto.BudgetResponse;
import com.lifeos.common.exception.ResourceNotFoundException;
import com.lifeos.transaction.TransactionCategory;
import com.lifeos.transaction.TransactionRepository;
import com.lifeos.transaction.TransactionType;
import com.lifeos.user.User;
import com.lifeos.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public List<BudgetResponse> findByCurrentMonth(String userId) {
        LocalDate now = LocalDate.now();
        return findByMonthAndYear(userId, now.getMonthValue(), now.getYear());
    }

    public List<BudgetResponse> findByMonthAndYear(String userId, int month, int year) {
        User user = userRepository.findById(userId).orElseThrow();
        List<Budget> budgets = budgetRepository.findByUserIdAndMonthAndYear(user.getId(), month, year);

        return budgets.stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public BudgetResponse create(String userId, BudgetRequest request) {
        User user = userRepository.findById(userId).orElseThrow();
        LocalDate now = LocalDate.now();

        if (budgetRepository.findByUserIdAndCategoryAndMonthAndYear(
                user.getId(), request.getCategory(), now.getMonthValue(), now.getYear()).isPresent()) {
            throw new IllegalArgumentException("Budget already exists for this category this month");
        }

        Budget budget = Budget.builder()
                .user(user)
                .category(request.getCategory())
                .limitAmount(request.getLimitAmount())
                .spentAmount(BigDecimal.ZERO)
                .month(now.getMonthValue())
                .year(now.getYear())
                .build();

        budget = budgetRepository.save(budget);
        return toResponse(budget);
    }

    @Transactional
    public BudgetResponse update(String budgetId, String userId, BudgetRequest request) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget", "id", budgetId));

        if (!budget.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Budget does not belong to user");
        }

        budget.setLimitAmount(request.getLimitAmount());
        budget = budgetRepository.save(budget);

        return toResponse(budget);
    }

    @Transactional
    public void delete(String budgetId, String userId) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget", "id", budgetId));

        if (!budget.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Budget does not belong to user");
        }

        budgetRepository.delete(budget);
    }

    private BudgetResponse toResponse(Budget budget) {
        LocalDate now = LocalDate.now();
        LocalDate start = LocalDate.of(budget.getYear(), budget.getMonth(), 1);
        LocalDate end = (budget.getYear() == now.getYear() && budget.getMonth() == now.getMonthValue())
                ? now
                : start.plusMonths(1).minusDays(1);

        BigDecimal spent = transactionRepository.sumByUserIdAndTypeAndCategoryBetween(
                budget.getUser().getId(), TransactionType.EXPENSE, budget.getCategory(), start, end);
        if (spent == null) spent = BigDecimal.ZERO;

        budget.setSpentAmount(spent);
        budgetRepository.save(budget);

        int usagePercent = budget.getLimitAmount().compareTo(BigDecimal.ZERO) > 0
                ? spent.multiply(BigDecimal.valueOf(100))
                        .divide(budget.getLimitAmount(), 0, RoundingMode.HALF_UP)
                        .intValue()
                : 0;

        return BudgetResponse.builder()
                .id(budget.getId())
                .category(budget.getCategory())
                .limitAmount(budget.getLimitAmount())
                .spentAmount(spent)
                .remainingAmount(budget.getLimitAmount().subtract(spent))
                .usagePercent(Math.min(usagePercent, 100))
                .month(budget.getMonth())
                .year(budget.getYear())
                .build();
    }
}
