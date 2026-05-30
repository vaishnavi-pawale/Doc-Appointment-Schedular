#FROM maven:3-eclipse-temurin-17 AS build
#WORKDIR /app

# Copy only the backend module so the image stays small and the build context is clean.
#COPY backend/pom.xml backend/pom.xml
#COPY backend/src backend/src

#RUN mvn -f backend/pom.xml clean package -DskipTests

#FROM eclipse-temurin:17-alpine
#WORKDIR /app

#COPY --from=build /app/backend/target/*.jar app.jar

#EXPOSE 8080

#ENTRYPOINT ["java", "-jar", "app.jar"]

# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml .
RUN mvn -q dependency:go-offline

COPY src ./src
RUN mvn -q clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]