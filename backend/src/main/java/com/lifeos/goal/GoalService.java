package com.lifeos.goal;

import com.lifeos.common.exception.ResourceNotFoundException;
import com.lifeos.goal.dto.GoalRequest;
import com.lifeos.goal.dto.GoalResponse;
import com.lifeos.user.User;
import com.lifeos.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    public List<GoalResponse> findByUserId(String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return goalRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public GoalResponse create(String userId, GoalRequest request) {
        User user = userRepository.findById(userId).orElseThrow();

        Goal goal = Goal.builder()
                .user(user)
                .title(request.getTitle())
                .targetAmount(request.getTargetAmount())
                .currentAmount(BigDecimal.ZERO)
                .icon(request.getIcon() != null ? request.getIcon() : "savings")
                .color(request.getColor() != null ? request.getColor() : "#7000ff")
                .build();

        goal = goalRepository.save(goal);
        return toResponse(goal);
    }

    @Transactional
    public GoalResponse updateProgress(String goalId, String userId, BigDecimal amount) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal", "id", goalId));

        if (!goal.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Goal does not belong to user");
        }

        goal.setCurrentAmount(amount);
        goal = goalRepository.save(goal);

        return toResponse(goal);
    }

    @Transactional
    public void delete(String goalId, String userId) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal", "id", goalId));

        if (!goal.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Goal does not belong to user");
        }

        goalRepository.delete(goal);
    }

    private GoalResponse toResponse(Goal goal) {
        int progress = goal.getTargetAmount().compareTo(BigDecimal.ZERO) > 0
                ? goal.getCurrentAmount().multiply(BigDecimal.valueOf(100))
                        .divide(goal.getTargetAmount(), 0, RoundingMode.HALF_UP)
                        .intValue()
                : 0;

        return GoalResponse.builder()
                .id(goal.getId())
                .title(goal.getTitle())
                .targetAmount(goal.getTargetAmount())
                .currentAmount(goal.getCurrentAmount())
                .progressPercent(Math.min(progress, 100))
                .icon(goal.getIcon())
                .color(goal.getColor())
                .build();
    }
}
