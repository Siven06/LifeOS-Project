package com.lifeos.dashboard;

import com.lifeos.dashboard.dto.DashboardResponse;
import com.lifeos.dashboard.dto.MonthlyDataPoint;
import com.lifeos.alert.AlertRepository;
import com.lifeos.transaction.MonthlySummary;
import com.lifeos.transaction.TransactionRepository;
import com.lifeos.transaction.TransactionType;
import com.lifeos.transaction.dto.TransactionResponse;
import com.lifeos.user.User;
import com.lifeos.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final AlertRepository alertRepository;

    public DashboardResponse getDashboard(String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        LocalDate startOfLastMonth = startOfMonth.minusMonths(1);

        BigDecimal monthlyIncome = transactionRepository.sumByUserIdAndTypeBetween(
                userId, TransactionType.INCOME, startOfMonth, now);
        BigDecimal monthlyExpenses = transactionRepository.sumByUserIdAndTypeBetween(
                userId, TransactionType.EXPENSE, startOfMonth, now);

        BigDecimal lastMonthIncome = transactionRepository.sumByUserIdAndTypeBetween(
                userId, TransactionType.INCOME, startOfLastMonth, startOfMonth.minusDays(1));
        BigDecimal lastMonthExpenses = transactionRepository.sumByUserIdAndTypeBetween(
                userId, TransactionType.EXPENSE, startOfLastMonth, startOfMonth.minusDays(1));

        BigDecimal incomeChange = calculateChange(monthlyIncome, lastMonthIncome);

        List<MonthlyDataPoint> monthlyChart = buildMonthlyChart(userId, 6);

        List<TransactionResponse> recentTransactions = transactionRepository
                .findByUserId(user.getId(), PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "date", "createdAt")))
                .stream()
                .map(t -> TransactionResponse.builder()
                        .id(t.getId())
                        .description(t.getDescription())
                        .amount(t.getAmount())
                        .type(t.getType())
                        .category(t.getCategory())
                        .status(t.getStatus())
                        .date(t.getDate())
                        .note(t.getNote())
                        .createdAt(t.getCreatedAt())
                        .build())
                .toList();

        long alertsUnreadCount = alertRepository.countByUserIdAndDismissedFalse(userId);

        return DashboardResponse.builder()
                .totalBalance(user.getTotalBalance())
                .monthlyIncome(monthlyIncome)
                .monthlyExpenses(monthlyExpenses)
                .incomeChangePercent(incomeChange)
                .monthlyChart(monthlyChart)
                .recentTransactions(recentTransactions)
                .alertsUnreadCount(alertsUnreadCount)
                .build();
    }

    private BigDecimal calculateChange(BigDecimal current, BigDecimal previous) {
        if (previous.compareTo(BigDecimal.ZERO) == 0) {
            return current.compareTo(BigDecimal.ZERO) > 0 ? BigDecimal.valueOf(100) : BigDecimal.ZERO;
        }
        return current.subtract(previous)
                .divide(previous, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(1, RoundingMode.HALF_UP);
    }

    private List<MonthlyDataPoint> buildMonthlyChart(String userId, int months) {
        LocalDate now = LocalDate.now();
        LocalDate start = now.minusMonths(months - 1).withDayOfMonth(1);
        LocalDate end = now.withDayOfMonth(now.lengthOfMonth());

        List<MonthlySummary> incomeByMonth = transactionRepository.summarizeByMonth(
                userId, TransactionType.INCOME, start, end);
        List<MonthlySummary> expenseByMonth = transactionRepository.summarizeByMonth(
                userId, TransactionType.EXPENSE, start, end);

        Map<Integer, BigDecimal> incomeMap = new HashMap<>();
        Map<Integer, BigDecimal> expenseMap = new HashMap<>();

        for (MonthlySummary s : incomeByMonth) incomeMap.put(s.getMonth(), s.getTotal());
        for (MonthlySummary s : expenseByMonth) expenseMap.put(s.getMonth(), s.getTotal());

        String[] monthNames = {"", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};

        List<MonthlyDataPoint> chart = new ArrayList<>();
        for (int i = 0; i < months; i++) {
            LocalDate monthDate = start.plusMonths(i);
            int m = monthDate.getMonthValue();
            chart.add(MonthlyDataPoint.builder()
                    .month(monthNames[m])
                    .income(incomeMap.getOrDefault(m, BigDecimal.ZERO))
                    .expense(expenseMap.getOrDefault(m, BigDecimal.ZERO))
                    .build());
        }

        return chart;
    }
}
