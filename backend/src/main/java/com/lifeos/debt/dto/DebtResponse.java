package com.lifeos.debt.dto;

import com.lifeos.debt.DebtCategory;
import com.lifeos.debt.DebtStatus;
import com.lifeos.debt.DebtType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class DebtResponse {

    private String id;
    private String name;
    private DebtType type;
    private BigDecimal totalAmount;
    private BigDecimal remainingAmount;
    private BigDecimal monthlyPayment;
    private Integer dueDay;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal interestRate;
    private DebtCategory category;
    private String note;
    private DebtStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}