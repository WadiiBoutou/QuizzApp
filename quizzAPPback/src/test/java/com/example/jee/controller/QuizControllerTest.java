package com.example.jee.controller;

import com.example.jee.beans.Quiz;
import com.example.jee.repository.QuizRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class QuizControllerTest {

    @Mock
    private QuizRepository quizRepository;

    @InjectMocks
    private QuizController quizController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllQuizzes_ReturnsListOfQuizzes() {
        Quiz quiz1 = new Quiz();
        quiz1.setId(1L);
        quiz1.setTitle("Quiz 1");
        Quiz quiz2 = new Quiz();
        quiz2.setId(2L);
        quiz2.setTitle("Quiz 2");
        List<Quiz> quizzes = Arrays.asList(quiz1, quiz2);

        when(quizRepository.findAll()).thenReturn(quizzes);

        List<Quiz> result = quizController.getAllQuizzes();
        assertEquals(2, result.size());
        assertEquals("Quiz 1", result.get(0).getTitle());
        assertEquals("Quiz 2", result.get(1).getTitle());
        verify(quizRepository, times(1)).findAll();
    }
} 