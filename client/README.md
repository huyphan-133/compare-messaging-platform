# Compare Messaging Platform Client

This project is designed to **consume data from various messaging platforms** (such as Kafka) and **measure the speed and throughput** of message delivery and processing. It is built using [NestJS](https://nestjs.com/) and provides a flexible, extensible framework for benchmarking and comparing different messaging solutions.

## How the Consumer Works

The main consumer logic is implemented in [`src/main-module/consumer/index.ts`](src/main-module/consumer/index.ts):

- Subscribes to a Kafka topic (default: `compare-platform`).
- On receiving a message, it logs detailed timing information:
  - **Time from receive**: Time taken to process the message after it is received by the consumer.
  - **Producer to Kafka**: Time from when the producer sent the message to when Kafka received it.
  - **Kafka to consumer**: Time from when Kafka received the message to when the consumer started processing it.
  - **Total time**: End-to-end time from when the producer sent the message to when the consumer finished processing it.
- If an error occurs during message processing, it logs the error and the payload for debugging.

Example log output:

```
Time from receive: 2 ms,
producer to kafka: 10 ms,
kafka to consumer: 5 ms,
total time: 15 ms
```

This detailed logging helps you analyze the performance and latency of your messaging platform end-to-end.

## Features

- **Message Consumption**: Connects to a messaging platform (e.g., Kafka) and consumes messages in real time.
- **Performance Metrics**: Measures and logs key metrics such as:
  - Time from producer to Kafka
  - Time from Kafka to consumer
  - Total end-to-end latency
- **Multi-instance Support**: Easily run multiple consumer instances using Docker Compose for load and throughput testing.
- **Extensible Architecture**: Built with modularity in mind, allowing easy integration with other messaging platforms.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Docker](https://www.docker.com/) (for multi-instance and Redis support)

### Installation

```bash
npm install
```

### Running the Application

#### Development

```bash
npm run start:dev
```

#### Production

```bash
npm run build
npm run start:prod
```

#### With Docker Compose

To run multiple consumer instances and Redis:

```bash
docker-compose up --build
```

This will start two consumer services (`datafeed-socket-1`, `datafeed-socket-2`) and a Redis instance.

## Configuration

- Kafka brokers and topics can be configured via environment variables:
  - `kafka.brokers`
  - `kafka.topic.order`

## Project Structure

- `src/` - Main source code (NestJS modules, Kafka integration, utilities)
- `docker-compose.yml` - Multi-instance and Redis setup
- `Dockerfile` - Containerization for production

## License

This project is UNLICENSED and for internal benchmarking and research purposes only.
