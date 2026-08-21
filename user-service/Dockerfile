# Multi-stage build for user-service
# Build context is expected to be the repository root (see infrastructure/docker-compose.yml)
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /workspace
COPY pom.xml .
COPY api-gateway/pom.xml api-gateway/pom.xml
COPY discovery-server/pom.xml discovery-server/pom.xml
COPY auth-service/pom.xml auth-service/pom.xml
COPY user-service/pom.xml user-service/pom.xml
COPY restaurant-service/pom.xml restaurant-service/pom.xml
COPY menu-service/pom.xml menu-service/pom.xml
COPY order-service/pom.xml order-service/pom.xml
COPY payment-service/pom.xml payment-service/pom.xml
COPY delivery-service/pom.xml delivery-service/pom.xml
COPY notification-service/pom.xml notification-service/pom.xml
# Warm the dependency cache for this module (network access required)
RUN mvn -q -pl user-service -am -Djava.version=21 dependency:go-offline || true
COPY . .
RUN mvn -q -pl user-service -am -Djava.version=21 -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /workspace/user-service/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
