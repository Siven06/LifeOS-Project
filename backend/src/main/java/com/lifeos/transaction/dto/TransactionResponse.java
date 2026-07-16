package com.lifeos.transaction.dto;

import com.lifeos.transaction.TransactionCategory;
import com.lifeos.transaction.TransactionStatus;
import com.lifeos.transaction.TransactionType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class TransactionResponse {

    private String id;
    private String description;
    private BigDecimal amount;
    private TransactionType type;
    private TransactionCategory category;
    private TransactionStatus status;
    private LocalDate date;
    private String note;
    private LocalDateTime createdAt;
}
