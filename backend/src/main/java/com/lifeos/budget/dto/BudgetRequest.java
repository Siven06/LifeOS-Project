package com.lifeos.budget.dto;

import com.lifeos.transaction.TransactionCategory;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BudgetRequest {

    @NotNull(message = "Category is required")
    private TransactionCategory category;

    @NotNull(message = "Limit amount is required")
    @Positive(message = "Limit must be positive")
    private BigDecimal limitAmount;
}
