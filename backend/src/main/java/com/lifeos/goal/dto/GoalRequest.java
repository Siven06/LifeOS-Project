package com.lifeos.goal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class GoalRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Target amount is required")
    @Positive(message = "Target must be positive")
    private BigDecimal targetAmount;

    private String icon;

    private String color;
}
