package com.example.jee.controller;

import com.example.jee.beans.Quiz;
import com.example.jee.beans.User;
import com.example.jee.beans.Question;
import com.example.jee.beans.Answer;
import com.example.jee.repository.QuizRepository;
import com.example.jee.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.security.test.context.support.WithMockUser;

@SpringBootTest
@AutoConfigureMockMvc
class QuizControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        quizRepository.deleteAll();
        userRepository.deleteAll();
        testUser = new User();
        testUser.setUsername("testuser");
        testUser.setPassword("password");
        userRepository.save(testUser);

        Quiz quiz1 = new Quiz();
        quiz1.setTitle("Quiz 1");
        quiz1.setCreatedBy(testUser);
        Quiz quiz2 = new Quiz();
        quiz2.setTitle("Quiz 2");
        quiz2.setCreatedBy(testUser);
        quizRepository.saveAll(Arrays.asList(quiz1, quiz2));
    }

    @Test
    @WithMockUser(username = "testuser")
    void testGetAllQuizzes_ReturnsQuizzes() throws Exception {
        mockMvc.perform(get("/api/quizzes")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Quiz 1"))
                .andExpect(jsonPath("$[1].title").value("Quiz 2"));
    }

    @Test
    @WithMockUser(username = "testuser")
    void testSubmitQuizAnswers_ScoreCalculation() throws Exception {
        // Create a quiz with 4 questions, each 5 points
        Quiz quiz = new Quiz();
        quiz.setTitle("Submission Quiz");
        quiz.setCreatedBy(testUser);
        List<Question> questions = new ArrayList<>();
        Map<Long, List<Long>> userAnswers = new HashMap<>();
        for (int i = 1; i <= 4; i++) {
            Question q = new Question();
            q.setText("Q" + i);
            q.setPoints(5);
            q.setQuiz(quiz);
            List<Answer> answers = new ArrayList<>();
            // One correct answer per question
            Answer a1 = new Answer();
            a1.setText("A1-Q" + i);
            a1.setCorrect(true);
            a1.setQuestion(q);
            answers.add(a1);
            Answer a2 = new Answer();
            a2.setText("A2-Q" + i);
            a2.setCorrect(false);
            a2.setQuestion(q);
            answers.add(a2);
            q.setAnswers(answers);
            questions.add(q);
        }
        quiz.setQuestions(questions);
        quiz = quizRepository.save(quiz);

        // User answers 3 questions correctly, 1 incorrectly
        for (int i = 0; i < 4; i++) {
            Question q = quiz.getQuestions().get(i);
            if (i < 3) {
                // Correct answer
                userAnswers.put(q.getId(), Collections.singletonList(q.getAnswers().get(0).getId()));
            } else {
                // Incorrect answer
                userAnswers.put(q.getId(), Collections.singletonList(q.getAnswers().get(1).getId()));
            }
        }

        mockMvc.perform(
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/api/quizzes/" + quiz.getId() + "/submit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(userAnswers))
        )
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Your score: 15")));
    }
} 