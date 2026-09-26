# syntax=docker/dockerfile:1.7
#
# One image recipe for every Spring Boot service. Pick the module with a build arg:
#   docker build --build-arg SERVICE=order-service -t foodiehub/order-service .
# infrastructure/docker-compose.yml builds all ten this way.

ARG SERVICE

FROM maven:3.9-eclipse-temurin-21 AS build
ARG SERVICE
WORKDIR /workspace
# POMs first so the dependency layer is reused until a POM changes.
COPY pom.xml .
COPY api-gateway/pom.xml api-gateway/
COPY discovery-server/pom.xml discovery-server/
COPY auth-service/pom.xml auth-service/
COPY user-service/pom.xml user-service/
COPY restaurant-service/pom.xml restaurant-service/
COPY menu-service/pom.xml menu-service/
COPY order-service/pom.xml order-service/
COPY payment-service/pom.xml payment-service/
COPY delivery-service/pom.xml delivery-service/
COPY notification-service/pom.xml notification-service/
RUN --mount=type=cache,target=/root/.m2 \
    mvn -B -q -pl ${SERVICE} -am dependency:go-offline || true
COPY . .
RUN --mount=type=cache,target=/root/.m2 \
    mvn -B -q -pl ${SERVICE} -am -DskipTests package \
 && cp ${SERVICE}/target/${SERVICE}-*.jar /workspace/app.jar

FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --from=build --chown=app:app /workspace/app.jar app.jar
USER app
# Size the heap from the container's memory limit rather than the host's.
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75 -XX:+ExitOnOutOfMemoryError"
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]
