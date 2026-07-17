package com.lifeos.debt;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface DebtRepository extends JpaRepository<Debt, String> {

    List<Debt> findByUserId(String userId);

    List<Debt> findByUserIdAndStatus(String userId, DebtStatus status);

    @Query("SELECT COALESCE(SUM(d.remainingAmount), 0) FROM Debt d WHERE d.user.id = :userId AND d.status = :status")
    BigDecimal sumRemainingByUserIdAndStatus(@Param("userId") String userId, @Param("status") DebtStatus status);

    @Query("SELECT COALESCE(SUM(d.monthlyPayment), 0) FROM Debt d WHERE d.user.id = :userId AND d.status = :status")
    BigDecimal sumMonthlyPaymentByUserIdAndStatus(@Param("userId") String userId, @Param("status") DebtStatus status);

    @Query("SELECT d FROM Debt d WHERE d.user.id = :userId AND d.status = :status ORDER BY d.dueDay ASC")
    List<Debt> findByUserIdAndStatusOrderByDueDayAsc(@Param("userId") String userId, @Param("status") DebtStatus status);

    @Query("SELECT d FROM Debt d WHERE d.user.id = :userId AND d.status = :status AND d.dueDay >= :today ORDER BY d.dueDay ASC")
    List<Debt> findUpcomingPayments(@Param("userId") String userId, @Param("status") DebtStatus status, @Param("today") int today);

    @Query("SELECT d FROM Debt d WHERE d.user.id = :userId AND d.status = :status ORDER BY d.dueDay ASC")
    List<Debt> findNextPayment(@Param("userId") String userId, @Param("status") DebtStatus status);
}