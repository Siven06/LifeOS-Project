package com.lifeos.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
public class MonthlyDataPoint {

    private String month;
    private BigDecimal income;
    private BigDecimal expense;
}
