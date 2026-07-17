package com.lifeos.debt.dto;

import com.lifeos.debt.DebtCategory;
import com.lifeos.debt.DebtStatus;
import com.lifeos.debt.DebtType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class DebtRequest {

    @NotBlank
    private String name;

    @NotNull
    private DebtType type;

    @NotNull
    @DecimalMin(value = "0.01", inclusive = true)
    private BigDecimal totalAmount;

    @NotNull
    @DecimalMin(value = "0.01", inclusive = true)
    private BigDecimal monthlyPayment;

    @NotNull
    @Positive
    private Integer dueDay;

    @NotNull
    private LocalDate startDate;

    private LocalDate endDate;

    private BigDecimal interestRate;

    @NotNull
    private DebtCategory category;

    private String note;
}