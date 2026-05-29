FROM maven:3.9.6-eclipse-temurin-8 AS builder
WORKDIR /app

# Copy backend source and build the executable jar
COPY backend/pom.xml backend/pom.xml
COPY backend/src backend/src
RUN mvn -f backend/pom.xml clean package -DskipTests

FROM eclipse-temurin:8-jre
WORKDIR /app

# Copy built Spring Boot jar from the builder stage
COPY --from=builder /app/backend/target/*.jar app.jar

# Optional defaults for containerized runs (can be overridden at runtime)
ENV DB_HOST=localhost \
	DB_PORT=3306 \
	DB_NAME=doctor_appointment_db \
	DB_USERNAME=root \
	DB_PASSWORD=root \
	DB_CREATE_IF_NOT_EXIST=true \
	DB_USE_SSL=false \
	DB_SERVER_TIMEZONE=UTC \
	SERVER_PORT=8080

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
