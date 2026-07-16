package com.lifeos.goal;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, String> {

    List<Goal> findByUserIdOrderByCreatedAtDesc(String userId);
}
