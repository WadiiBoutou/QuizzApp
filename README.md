QuizMaster AI
An intelligent quiz application that leverages AI to generate dynamic quizzes and provide personalized learning experiences.

Features
QuizMaster AI combines modern web technologies with Google's Gemini AI to create engaging quiz experiences. The application generates questions automatically based on various topics and difficulty levels, tracks user performance, and provides detailed analytics to enhance learning outcomes.
Technology Stack
The backend is built with Spring Boot 3.x and Java 21, providing robust REST API endpoints and seamless integration with Google Gemini AI for intelligent question generation. Data persistence is handled through MySQL database with JPA/Hibernate for efficient data management.
The frontend utilizes React 18 with modern JavaScript features, delivering a responsive and intuitive user interface across desktop and mobile devices.

Getting Started
Prerequisites
•	Java 21 or higher
•	Node.js 18 or higher
•	MySQL 8.0
•	Docker and Docker Compose

Installation
Clone the repository and navigate to the project directory.
For the backend, navigate to the quizzAPPback directory, configure your MySQL database connection in the application properties, and run the Spring Boot application using Maven.
For the frontend, navigate to the quizzAPPfront directory, install dependencies with npm, and start the development server.

Docker Deployment
The application supports containerized deployment using Docker Compose. Configure your environment variables and run docker-compose up to launch all services including the database, backend, and frontend components.

AI Integration
The application integrates with Google Gemini AI to provide intelligent quiz generation capabilities. This integration enables dynamic content creation based on user preferences and learning objectives, ensuring fresh and relevant quiz experiences.

CI/CD Pipeline
The project implements automated testing and deployment through GitHub Actions. Separate workflows handle backend and frontend testing, with continuous deployment automatically updating the production environment upon successful builds.

Contributing
Contributions are welcome through pull requests. Please ensure all tests pass and follow the established coding standards before submitting changes.
