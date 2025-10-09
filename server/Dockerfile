FROM openjdk:17-jdk
ENV TZ="Asia/Ho_Chi_Minh"
ENV JAVA_OPTS="-Xms256m -Xmx512m"
WORKDIR /app/ms
RUN microdnf install findutils

COPY . .

RUN chmod +x gradlew
RUN ./gradlew clean --refresh-dependencies bootJar

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar build/libs/demo2-0.0.1-SNAPSHOT.jar"]