package com.lifeos.transaction;

import java.math.BigDecimal;

public interface CategorySummary {
    TransactionCategory getCategory();
    BigDecimal getTotal();
}
