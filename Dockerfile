FROM maven:3-eclipse-temurin-17 AS build
WORKDIR /app

# Copy only the backend module so the image stays small and the build context is clean.
COPY backend/pom.xml backend/pom.xml
COPY backend/src backend/src

RUN mvn -f backend/pom.xml clean package -DskipTests

FROM eclipse-temurin:17-alpine
WORKDIR /app

COPY --from=build /app/backend/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
