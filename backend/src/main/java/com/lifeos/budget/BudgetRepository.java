package com.lifeos.budget;

import com.lifeos.transaction.TransactionCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, String> {

    List<Budget> findByUserIdAndMonthAndYear(String userId, int month, int year);

    Optional<Budget> findByUserIdAndCategoryAndMonthAndYear(String userId, TransactionCategory category, int month, int year);
}
