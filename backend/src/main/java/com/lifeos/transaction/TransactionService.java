package com.lifeos.transaction;

import com.lifeos.common.exception.ResourceNotFoundException;
import com.lifeos.transaction.dto.TransactionRequest;
import com.lifeos.transaction.dto.TransactionResponse;
import com.lifeos.user.User;
import com.lifeos.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public List<TransactionResponse> findByUserId(String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        Sort sort = Sort.by(Sort.Direction.DESC, "date", "createdAt");
        return transactionRepository.findByUserId(user.getId(), sort).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<TransactionResponse> findByUserIdAndType(String userId, TransactionType type) {
        User user = userRepository.findById(userId).orElseThrow();
        Sort sort = Sort.by(Sort.Direction.DESC, "date", "createdAt");
        return transactionRepository.findByUserIdAndType(user.getId(), type, sort).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<TransactionResponse> findByUserIdAndCategory(String userId, TransactionCategory category) {
        User user = userRepository.findById(userId).orElseThrow();
        Sort sort = Sort.by(Sort.Direction.DESC, "date", "createdAt");
        return transactionRepository.findByUserIdAndCategory(user.getId(), category, sort).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<TransactionResponse> findByUserIdAndDateRange(String userId, LocalDate start, LocalDate end) {
        User user = userRepository.findById(userId).orElseThrow();
        Sort sort = Sort.by(Sort.Direction.DESC, "date", "createdAt");
        return transactionRepository.findByUserIdAndDateBetween(user.getId(), start, end, sort).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public TransactionResponse create(String userId, TransactionRequest request) {
        User user = userRepository.findById(userId).orElseThrow();

        Transaction transaction = Transaction.builder()
                .user(user)
                .description(request.getDescription())
                .amount(request.getAmount())
                .type(request.getType())
                .category(request.getCategory())
                .date(request.getDate() != null ? request.getDate() : LocalDate.now())
                .note(request.getNote())
                .build();

        transaction = transactionRepository.save(transaction);

        updateUserBalance(user);

        return toResponse(transaction);
    }

    @Transactional
    public TransactionResponse update(String transactionId, String userId, TransactionRequest request) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "id", transactionId));

        if (!transaction.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Transaction does not belong to user");
        }

        transaction.setDescription(request.getDescription());
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setCategory(request.getCategory());
        transaction.setDate(request.getDate() != null ? request.getDate() : LocalDate.now());
        transaction.setNote(request.getNote());

        transaction = transactionRepository.save(transaction);

        updateUserBalance(transaction.getUser());

        return toResponse(transaction);
    }

    @Transactional
    public void delete(String transactionId, String userId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "id", transactionId));

        if (!transaction.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Transaction does not belong to user");
        }

        transactionRepository.delete(transaction);
        updateUserBalance(transaction.getUser());
    }

    private void updateUserBalance(User user) {
        BigDecimal totalIncome = transactionRepository.sumByUserIdAndType(user.getId(), TransactionType.INCOME);
        BigDecimal totalExpense = transactionRepository.sumByUserIdAndType(user.getId(), TransactionType.EXPENSE);
        user.setTotalBalance(totalIncome.subtract(totalExpense));
        userRepository.save(user);
    }

    private TransactionResponse toResponse(Transaction t) {
        return TransactionResponse.builder()
                .id(t.getId())
                .description(t.getDescription())
                .amount(t.getAmount())
                .type(t.getType())
                .category(t.getCategory())
                .status(t.getStatus())
                .date(t.getDate())
                .note(t.getNote())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
