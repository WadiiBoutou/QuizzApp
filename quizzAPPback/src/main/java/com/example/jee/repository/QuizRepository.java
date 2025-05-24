package com.example.jee.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.jee.beans.Quiz;
import com.example.jee.beans.User;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByCreatedBy(User createdBy);
}