package com.lifeos.debt.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class DebtSummaryResponse {

    private BigDecimal totalDebt;
    private BigDecimal monthlyPayment;
    private int activeDebtsCount;
    private BigDecimal nextPaymentAmount;
    private LocalDate nextPaymentDate;
    private String nextPaymentName;
}