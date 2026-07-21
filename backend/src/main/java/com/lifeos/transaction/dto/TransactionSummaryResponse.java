package com.lifeos.transaction.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class TransactionSummaryResponse {
    private BigDecimal monthlyIncome;
    private BigDecimal monthlyExpenses;
    private BigDecimal previousMonthExpenses;
    private BigDecimal expenseChangePercent;
    private TopCategory topCategory;
    private List<CategoryBreakdown> categoryBreakdown;

    @Data
    @Builder
    public static class TopCategory {
        private String category;
        private BigDecimal total;
        private double percentage;
    }

    @Data
    @Builder
    public static class CategoryBreakdown {
        private String category;
        private BigDecimal total;
        private double percentage;
    }
}
