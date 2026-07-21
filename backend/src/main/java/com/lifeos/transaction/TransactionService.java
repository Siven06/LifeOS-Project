package com.lifeos.transaction;

import com.lifeos.common.exception.ResourceNotFoundException;
import com.lifeos.transaction.dto.TransactionRequest;
import com.lifeos.transaction.dto.TransactionResponse;
import com.lifeos.user.User;
import com.lifeos.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lifeos.transaction.dto.TransactionSummaryResponse;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public List<TransactionResponse> findByUserId(String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        Sort sort = Sort.by(Sort.Direction.DESC, "date", "createdAt");
        return transactionRepository.findByUserId(user.getId(), sort).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<TransactionResponse> findByUserIdAndType(String userId, TransactionType type) {
        User user = userRepository.findById(userId).orElseThrow();
        Sort sort = Sort.by(Sort.Direction.DESC, "date", "createdAt");
        return transactionRepository.findByUserIdAndType(user.getId(), type, sort).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<TransactionResponse> findByUserIdAndCategory(String userId, TransactionCategory category) {
        User user = userRepository.findById(userId).orElseThrow();
        Sort sort = Sort.by(Sort.Direction.DESC, "date", "createdAt");
        return transactionRepository.findByUserIdAndCategory(user.getId(), category, sort).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<TransactionResponse> findByUserIdAndDateRange(String userId, LocalDate start, LocalDate end) {
        User user = userRepository.findById(userId).orElseThrow();
        Sort sort = Sort.by(Sort.Direction.DESC, "date", "createdAt");
        return transactionRepository.findByUserIdAndDateBetween(user.getId(), start, end, sort).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public TransactionResponse create(String userId, TransactionRequest request) {
        User user = userRepository.findById(userId).orElseThrow();

        Transaction transaction = Transaction.builder()
                .user(user)
                .description(request.getDescription())
                .amount(request.getAmount())
                .type(request.getType())
                .category(request.getCategory())
                .date(request.getDate() != null ? request.getDate() : LocalDate.now())
                .note(request.getNote())
                .build();

        transaction = transactionRepository.save(transaction);

        updateUserBalance(user);

        return toResponse(transaction);
    }

    @Transactional
    public TransactionResponse update(String transactionId, String userId, TransactionRequest request) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "id", transactionId));

        if (!transaction.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Transaction does not belong to user");
        }

        transaction.setDescription(request.getDescription());
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setCategory(request.getCategory());
        transaction.setDate(request.getDate() != null ? request.getDate() : LocalDate.now());
        transaction.setNote(request.getNote());

        transaction = transactionRepository.save(transaction);

        updateUserBalance(transaction.getUser());

        return toResponse(transaction);
    }

    @Transactional
    public void delete(String transactionId, String userId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "id", transactionId));

        if (!transaction.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Transaction does not belong to user");
        }

        transactionRepository.delete(transaction);
        updateUserBalance(transaction.getUser());
    }

    private void updateUserBalance(User user) {
        BigDecimal totalIncome = transactionRepository.sumByUserIdAndType(user.getId(), TransactionType.INCOME);
        BigDecimal totalExpense = transactionRepository.sumByUserIdAndType(user.getId(), TransactionType.EXPENSE);
        user.setTotalBalance(totalIncome.subtract(totalExpense));
        userRepository.save(user);
    }

    public TransactionSummaryResponse getSummary(String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        LocalDate now = LocalDate.now();
        LocalDate monthStart = now.withDayOfMonth(1);
        LocalDate nextMonth = monthStart.plusMonths(1);
        LocalDate prevMonthStart = monthStart.minusMonths(1);
        LocalDate prevMonthEnd = monthStart.minusDays(1);

        BigDecimal monthlyIncome = transactionRepository.sumByUserIdAndTypeBetween(user.getId(), TransactionType.INCOME, monthStart, nextMonth);
        BigDecimal monthlyExpenses = transactionRepository.sumByUserIdAndTypeBetween(user.getId(), TransactionType.EXPENSE, monthStart, nextMonth);
        BigDecimal previousExpenses = transactionRepository.sumByUserIdAndTypeBetween(user.getId(), TransactionType.EXPENSE, prevMonthStart, prevMonthEnd);

        BigDecimal expenseChangePercent = BigDecimal.ZERO;
        if (previousExpenses.compareTo(BigDecimal.ZERO) > 0) {
            expenseChangePercent = monthlyExpenses.subtract(previousExpenses)
                    .divide(previousExpenses, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(1, RoundingMode.HALF_UP);
        }

        List<CategorySummary> catSummaries = transactionRepository.summarizeByCategory(user.getId(), TransactionType.EXPENSE, monthStart, nextMonth);

        BigDecimal totalExpenses = catSummaries.stream()
                .map(CategorySummary::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<TransactionSummaryResponse.CategoryBreakdown> breakdown = new ArrayList<>();
        TransactionSummaryResponse.TopCategory topCategory = null;

        for (int i = 0; i < catSummaries.size(); i++) {
            CategorySummary cs = catSummaries.get(i);
            double pct = totalExpenses.compareTo(BigDecimal.ZERO) > 0
                    ? cs.getTotal().divide(totalExpenses, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).setScale(1, RoundingMode.HALF_UP).doubleValue()
                    : 0;
            breakdown.add(TransactionSummaryResponse.CategoryBreakdown.builder()
                    .category(cs.getCategory().name())
                    .total(cs.getTotal())
                    .percentage(pct)
                    .build());
            if (i == 0) {
                topCategory = TransactionSummaryResponse.TopCategory.builder()
                        .category(cs.getCategory().name())
                        .total(cs.getTotal())
                        .percentage(pct)
                        .build();
            }
        }

        return TransactionSummaryResponse.builder()
                .monthlyIncome(monthlyIncome)
                .monthlyExpenses(monthlyExpenses)
                .previousMonthExpenses(previousExpenses)
                .expenseChangePercent(expenseChangePercent)
                .topCategory(topCategory)
                .categoryBreakdown(breakdown)
                .build();
    }

    private TransactionResponse toResponse(Transaction t) {
        return TransactionResponse.builder()
                .id(t.getId())
                .description(t.getDescription())
                .amount(t.getAmount())
                .type(t.getType())
                .category(t.getCategory())
                .status(t.getStatus())
                .date(t.getDate())
                .note(t.getNote())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
