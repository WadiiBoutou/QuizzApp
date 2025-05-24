package com.example.jee.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.jee.beans.Participant;
import com.example.jee.beans.Quiz;
import com.example.jee.beans.User;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {
    List<Participant> findByUser(User user);
    Participant findByUserAndQuiz(User user, Quiz quiz);
}