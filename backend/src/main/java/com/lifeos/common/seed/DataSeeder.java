package com.lifeos.common.seed;

import com.lifeos.alert.Alert;
import com.lifeos.alert.AlertRepository;
import com.lifeos.alert.AlertSeverity;
import com.lifeos.alert.AlertType;
import com.lifeos.budget.Budget;
import com.lifeos.budget.BudgetRepository;
import com.lifeos.goal.Goal;
import com.lifeos.goal.GoalRepository;
import com.lifeos.transaction.*;
import com.lifeos.transaction.TransactionStatus;
import com.lifeos.user.Role;
import com.lifeos.user.User;
import com.lifeos.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final GoalRepository goalRepository;
    private final AlertRepository alertRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        User user = User.builder()
                .name("Siven06")
                .email("demo@lifeos.app")
                .password(passwordEncoder.encode("password123"))
                .role(Role.USER)
                .totalBalance(BigDecimal.valueOf(128450.64))
                .build();
        user = userRepository.save(user);

        List<Transaction> seedTx = List.of(
                tx(user, "Monthly Salary", 8500.00, TransactionType.INCOME, TransactionCategory.SALARY, LocalDate.now().minusDays(1)),
                txst(user, "Apple Store", 1299.00, TransactionType.EXPENSE, TransactionCategory.SHOPPING, LocalDate.now(), TransactionStatus.PENDING),
                tx(user, "The Alchemist Bar", 84.50, TransactionType.EXPENSE, TransactionCategory.FOOD, LocalDate.now().minusDays(2)),
                tx(user, "Freelance Project", 3200.00, TransactionType.INCOME, TransactionCategory.FREELANCE, LocalDate.now().minusDays(5)),
                tx(user, "Electric Bill", 145.00, TransactionType.EXPENSE, TransactionCategory.BILLS, LocalDate.now().minusDays(7)),
                tx(user, "Investment Dividend", 500.00, TransactionType.INCOME, TransactionCategory.INVESTMENT, LocalDate.now().minusDays(10)),
                tx(user, "Uber Rides", 67.80, TransactionType.EXPENSE, TransactionCategory.TRANSPORT, LocalDate.now().minusDays(12)),
                tx(user, "Weekly Groceries", 230.00, TransactionType.EXPENSE, TransactionCategory.FOOD, LocalDate.now().minusDays(14)),
                tx(user, "Netflix Subscription", 15.99, TransactionType.EXPENSE, TransactionCategory.ENTERTAINMENT, LocalDate.now().minusDays(20)),
                tx(user, "Gym Membership", 89.99, TransactionType.EXPENSE, TransactionCategory.HEALTH, LocalDate.now().minusDays(25))
        );
        transactionRepository.saveAll(seedTx);

        List<Budget> seedBudgets = List.of(
                budget(user, TransactionCategory.FOOD, 800.00, LocalDate.now().getMonthValue(), LocalDate.now().getYear()),
                budget(user, TransactionCategory.SHOPPING, 500.00, LocalDate.now().getMonthValue(), LocalDate.now().getYear()),
                budget(user, TransactionCategory.BILLS, 600.00, LocalDate.now().getMonthValue(), LocalDate.now().getYear()),
                budget(user, TransactionCategory.ENTERTAINMENT, 300.00, LocalDate.now().getMonthValue(), LocalDate.now().getYear())
        );
        budgetRepository.saveAll(seedBudgets);

        Goal goal = Goal.builder()
                .user(user)
                .title("Tesla Model S")
                .targetAmount(BigDecimal.valueOf(100000))
                .currentAmount(BigDecimal.valueOf(75000))
                .icon("savings")
                .color("#7000ff")
                .build();
        goalRepository.save(goal);

        List<Alert> seedAlerts = List.of(
                Alert.builder().user(user).type(AlertType.OVERSPENDING).severity(AlertSeverity.WARNING)
                        .title("Overspending Warning")
                        .message("Spending 20% more on Food this month than your typical average.")
                        .expiresAt(LocalDateTime.now().plusDays(7)).build(),
                Alert.builder().user(user).type(AlertType.SAVINGS_GOAL).severity(AlertSeverity.SUCCESS)
                        .title("Savings Goal on Track")
                        .message("You've reached 75% of your Tesla Model S goal. Keep it up!")
                        .actionLabel("View Goal")
                        .expiresAt(LocalDateTime.now().plusDays(14)).build(),
                Alert.builder().user(user).type(AlertType.UPCOMING_SUBSCRIPTION).severity(AlertSeverity.INFO)
                        .title("Upcoming Subscription")
                        .message("Netflix ($15.99) is due in 2 days. Balance is sufficient.")
                        .expiresAt(LocalDateTime.now().plusDays(3)).build(),
                Alert.builder().user(user).type(AlertType.PATTERN_DETECTED).severity(AlertSeverity.INFO)
                        .title("New Pattern Detected")
                        .message("We noticed a recurring Friday evening charge. Label as \"Entertainment\"?")
                        .actionLabel("Yes, label it")
                        .expiresAt(LocalDateTime.now().plusDays(30)).build()
        );
        alertRepository.saveAll(seedAlerts);
    }

    private Transaction tx(User user, String desc, double amount, TransactionType type, TransactionCategory cat, LocalDate date) {
        return Transaction.builder()
                .user(user).description(desc)
                .amount(BigDecimal.valueOf(amount))
                .type(type).category(cat).date(date).build();
    }

    private Transaction txst(User user, String desc, double amount, TransactionType type, TransactionCategory cat, LocalDate date, TransactionStatus status) {
        return Transaction.builder()
                .user(user).description(desc)
                .amount(BigDecimal.valueOf(amount))
                .type(type).category(cat).date(date).status(status).build();
    }

    private Budget budget(User user, TransactionCategory cat, double limit, int month, int year) {
        return Budget.builder()
                .user(user).category(cat)
                .limitAmount(BigDecimal.valueOf(limit))
                .spentAmount(BigDecimal.ZERO)
                .month(month).year(year).build();
    }
}
