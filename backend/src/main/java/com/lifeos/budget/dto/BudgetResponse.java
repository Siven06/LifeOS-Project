package com.lifeos.budget.dto;

import com.lifeos.transaction.TransactionCategory;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class BudgetResponse {

    private String id;
    private TransactionCategory category;
    private BigDecimal limitAmount;
    private BigDecimal spentAmount;
    private BigDecimal remainingAmount;
    private int usagePercent;
    private int month;
    private int year;
}
