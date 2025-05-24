package com.example.jee.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AIService {

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}";

    public Map<String, Object> generateQuiz(String prompt, int numberOfQuestions, boolean singleCorrectAnswer) {
        try {
            // Build the AI prompt
            String aiPrompt = String.format(
                "Generate a quiz about '%s' with %d questions. " +
                "Each question should have exactly 4 answers, with %s. " +
                "Format the response as a JSON object with the following structure: " +
                "{\"title\": \"Quiz Title\", \"description\": \"Quiz Description\", " +
                "\"questions\": [{\"text\": \"Question text\", \"points\": 5, " +
                "\"answers\": [{\"text\": \"Answer text\", \"correct\": true/false}]}]}. " +
                "If you cannot format it as JSON, return it as plain text with questions and answers clearly marked.",
                prompt, numberOfQuestions, singleCorrectAnswer ? "only one correct answer" : "multiple possible correct answers"
            );

            // Call the Google AI Studio API
            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> request = new HashMap<>();
            Map<String, Object> parts = new HashMap<>();
            parts.put("text", aiPrompt);
            request.put("contents", new Object[] { Map.of("parts", new Object[] { parts }) });

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_API_URL, entity, String.class);
            

            // Parse and validate the response
            return parseAIResponse(response.getBody());
        } catch (Exception e) {
            throw new RuntimeException("Error calling Google AI Studio API: " + e.getMessage(), e);
        }
    }

    private Map<String, Object> parseAIResponse(String aiResponse) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> responseMap = mapper.readValue(aiResponse, Map.class);
            
            // Extract the actual quiz JSON from the response structure
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseMap.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                throw new RuntimeException("No candidates in AI response");
            }
    
            Map<String, Object> candidate = candidates.get(0);
            Map<String, Object> content = (Map<String, Object>) candidate.get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            if (parts == null || parts.isEmpty()) {
                throw new RuntimeException("No content in AI response");
            }
    
            String text = (String) parts.get(0).get("text");
            
            // Extract JSON from the text (it might be wrapped in ```json)
            String jsonContent = text;
            if (text.contains("```json")) {
                jsonContent = text.substring(
                    text.indexOf("```json") + 7,
                    text.lastIndexOf("```")
                ).trim();
            }
    
            // Parse the actual quiz JSON
            Map<String, Object> quizData = mapper.readValue(jsonContent, Map.class);
            validateQuizStructure(quizData);
            return quizData;
        } catch (Exception e) {
            throw new RuntimeException("Error parsing AI response: " + e.getMessage(), e);
        }
    }

    private Map<String, Object> parsePlainTextResponse(String plainText) {
        Map<String, Object> quizData = new HashMap<>();
        quizData.put("title", "Mathématiques de Base");
        quizData.put("description", "Quiz sur les mathématiques de base");
        quizData.put("questions", extractQuestionsFromPlainText(plainText));
        return quizData;
    }

    private List<Map<String, Object>> extractQuestionsFromPlainText(String plainText) {
        List<Map<String, Object>> questions = new ArrayList<>();
        String[] lines = plainText.split("\n");
        
        Map<String, Object> currentQuestion = null;
        List<Map<String, Object>> currentAnswers = null;
        
        for (String line : lines) {
            line = line.trim();
            if (line.isEmpty()) continue;
            
            // Check if this is a question (starts with a number and a dot or a question mark)
            if (line.matches("^\\d+\\.\\s.*\\?$") || line.matches("^\\d+\\)\\s.*\\?$")) {
                // Save previous question if exists
                if (currentQuestion != null && currentAnswers != null) {
                    currentQuestion.put("answers", currentAnswers);
                    questions.add(currentQuestion);
                }
                
                // Start new question
                currentQuestion = new HashMap<>();
                currentQuestion.put("text", line.replaceFirst("^\\d+[\\.\\)]\\s*", ""));
                currentQuestion.put("points", 5);
                currentAnswers = new ArrayList<>();
            }
            // Check if this is an answer (starts with a letter and a dot or parenthesis)
            else if (line.matches("^[a-d][\\.\\)]\\s.*") && currentQuestion != null) {
                Map<String, Object> answer = new HashMap<>();
                String answerText = line.replaceFirst("^[a-d][\\.\\)]\\s*", "");
                answer.put("text", answerText);
                // Assume the first answer is correct if singleCorrectAnswer is true
                answer.put("correct", currentAnswers.isEmpty());
                currentAnswers.add(answer);
            }
        }
        
        // Add the last question if exists
        if (currentQuestion != null && currentAnswers != null) {
            currentQuestion.put("answers", currentAnswers);
            questions.add(currentQuestion);
        }
        
        return questions;
    }

    private void validateQuizStructure(Map<String, Object> quizData) {
        if (!quizData.containsKey("title") || !quizData.containsKey("description") || !quizData.containsKey("questions")) {
            throw new RuntimeException("Invalid quiz structure: missing required fields");
        }

        List<Map<String, Object>> questions = (List<Map<String, Object>>) quizData.get("questions");
        if (questions == null || questions.isEmpty()) {
            throw new RuntimeException("No questions found in the quiz");
        }

        for (Map<String, Object> question : questions) {
            if (!question.containsKey("text") || !question.containsKey("points") || !question.containsKey("answers")) {
                throw new RuntimeException("Invalid question structure: missing required fields");
            }

            List<Map<String, Object>> answers = (List<Map<String, Object>>) question.get("answers");
            if (answers == null || answers.size() < 2) {
                throw new RuntimeException("Each question must have at least 2 answers");
            }

            for (Map<String, Object> answer : answers) {
                if (!answer.containsKey("text") || !answer.containsKey("correct")) {
                    throw new RuntimeException("Invalid answer structure: missing required fields");
                }
            }
        }
    }
}