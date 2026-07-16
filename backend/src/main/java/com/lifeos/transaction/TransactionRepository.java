package com.lifeos.transaction;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, String> {

    List<Transaction> findByUserId(String userId, Sort sort);

    Page<Transaction> findByUserId(String userId, Pageable pageable);

    List<Transaction> findByUserIdAndDateBetween(String userId, LocalDate start, LocalDate end, Sort sort);

    List<Transaction> findByUserIdAndType(String userId, TransactionType type, Sort sort);

    List<Transaction> findByUserIdAndCategory(String userId, TransactionCategory category, Sort sort);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user.id = :userId AND t.type = :type")
    BigDecimal sumByUserIdAndType(@Param("userId") String userId, @Param("type") TransactionType type);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.type = :type AND t.date BETWEEN :start AND :end")
    BigDecimal sumByUserIdAndTypeBetween(@Param("userId") String userId,
                                          @Param("type") TransactionType type,
                                          @Param("start") LocalDate start,
                                          @Param("end") LocalDate end);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.type = :type AND t.category = :category AND t.date BETWEEN :start AND :end")
    BigDecimal sumByUserIdAndTypeAndCategoryBetween(@Param("userId") String userId,
                                                     @Param("type") TransactionType type,
                                                     @Param("category") TransactionCategory category,
                                                     @Param("start") LocalDate start,
                                                     @Param("end") LocalDate end);

    @Query("SELECT t.category as category, SUM(t.amount) as total FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.type = :type AND t.date BETWEEN :start AND :end " +
           "GROUP BY t.category ORDER BY total DESC")
    List<CategorySummary> summarizeByCategory(@Param("userId") String userId,
                                               @Param("type") TransactionType type,
                                               @Param("start") LocalDate start,
                                               @Param("end") LocalDate end);

    @Query("SELECT FUNCTION('MONTH', t.date) as month, SUM(t.amount) as total FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.type = :type AND t.date BETWEEN :start AND :end " +
           "GROUP BY FUNCTION('MONTH', t.date) ORDER BY month")
    List<MonthlySummary> summarizeByMonth(@Param("userId") String userId,
                                           @Param("type") TransactionType type,
                                           @Param("start") LocalDate start,
                                           @Param("end") LocalDate end);
}
