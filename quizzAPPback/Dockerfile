# Use an OpenJDK base image
FROM openjdk:21-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the Maven build file and source code
COPY target/jee-0.0.1-SNAPSHOT.jar app.jar

# Expose the backend port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]