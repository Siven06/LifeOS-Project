package com.lifeos.dashboard.dto;

import com.lifeos.transaction.MonthlySummary;
import com.lifeos.transaction.dto.TransactionResponse;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class DashboardResponse {

    private BigDecimal totalBalance;
    private BigDecimal monthlyIncome;
    private BigDecimal monthlyExpenses;
    private BigDecimal incomeChangePercent;
    private List<MonthlyDataPoint> monthlyChart;
    private List<TransactionResponse> recentTransactions;
    private long alertsUnreadCount;
}
