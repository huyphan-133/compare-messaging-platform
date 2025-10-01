# Message Platform Comparison - Server

This is a Spring Boot application designed to compare different messaging platforms (Kafka and Redis Pub/Sub) for message throughput and performance.

## Features

- Send messages to different messaging platforms (Kafka, Redis Pub/Sub)
- Configurable message throughput and rounds
- REST API for triggering message sending
- Built with Spring Boot 3.5.6 and Java 17

## Prerequisites

- Java 17 or higher
- Gradle 7.x
- Kafka (for Kafka messaging)
- Redis (for Redis Pub/Sub)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd compare_messaging_flatform/server
   ```

2. **Configure the application**
   Update the `application.properties` file with your Kafka and Redis server details.

3. **Build the application**
   ```bash
   ./gradlew build
   ```

4. **Run the application**
   ```bash
   ./gradlew bootRun
   ```

   The application will start on `http://localhost:8080` by default.

## API Endpoints

### Send Messages

Send messages to the specified messaging platform.

- **URL**: `/api/messages/send`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "throughput": 1000,
    "rounds": 5,
    "type": "KAFKA"
  }
  ```
  - `throughput`: Number of messages to send per round
  - `rounds`: Number of rounds to repeat the test
  - `type`: Messaging platform (`KAFKA` or `REDIS`)

## Project Structure

- `src/main/groovy/org/kbsv/demo2/`
  - `config/`: Configuration classes
  - `controller/`: REST API controllers
  - `dto/`: Data Transfer Objects
  - `service/`: Business logic and services
  - `Demo2Application.groovy`: Main application class

## Dependencies

- Spring Boot 3.5.6
- Spring Kafka
- Spring Data Redis
- Groovy
- Jackson
- JUnit (for testing)

## Configuration

Configure the following in `application.properties`:

```properties
# Kafka Configuration
spring.kafka.bootstrap-servers=your-kafka-servers
spring.kafka.client-id=your-client-id

# Redis Configuration (if using Redis)
spring.redis.host=your-redis-host
spring.redis.port=6379
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
