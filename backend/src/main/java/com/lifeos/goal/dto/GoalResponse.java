package com.lifeos.goal.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class GoalResponse {

    private String id;
    private String title;
    private BigDecimal targetAmount;
    private BigDecimal currentAmount;
    private int progressPercent;
    private String icon;
    private String color;
}
