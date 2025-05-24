
package com.example.jee.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.jee.beans.Quiz;
import com.example.jee.beans.User;
import com.example.jee.beans.UserAnswer;

@Repository
public interface UserAnswerRepository extends JpaRepository<UserAnswer, Long> {
    List<UserAnswer> findByUserAndQuiz(User user, Quiz quiz);
}