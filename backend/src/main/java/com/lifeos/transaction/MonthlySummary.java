package com.lifeos.transaction;

import java.math.BigDecimal;

public interface MonthlySummary {
    Integer getMonth();
    BigDecimal getTotal();
}
