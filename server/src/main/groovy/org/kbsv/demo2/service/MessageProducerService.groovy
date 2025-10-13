package org.kbsv.demo2.service


import groovy.util.logging.Slf4j
import org.kbsv.demo2.model.Message
import org.kbsv.demo2.service.sender.ISender
import org.kbsv.demo2.service.sender.SenderFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service

import java.util.concurrent.Executors
import java.util.concurrent.ScheduledExecutorService
import java.util.concurrent.TimeUnit

@Slf4j
@Service
class MessageProducerService {

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    @Autowired
    private SenderFactory senderFactory

    @Async
    void send(int throughput, int rounds, String type, int numberOfPartitions) {
        ISender sender = senderFactory.getSender(type)

        for (int i = 0; i < rounds; i++) {
            int round = i + 1;
            scheduler.schedule(() -> {
                def messages = genMessages(throughput)
                messages.eachWithIndex { message, messageIndex ->
                    message.id = round + "-" + message.id
                    message.content = "Round $round: " + message.content
                    message.partitionNumber = numberOfPartitions == 1 ? 1 : messageIndex % numberOfPartitions
                    sender.send(message)
                }
                log.info("Round $round: Sent $throughput messages")
            }, i, TimeUnit.SECONDS)
        }

    }

    private static List<Message> genMessages(int count) {
        (1..count).collect { i ->
            new Message(
                    id: UUID.randomUUID().toString(),
                    content: "Message $i"
            )
        }
    }

//    @Async
//    void sendToRedisPubSub(int messageCount) {
//        log.info("Starting to send $messageCount messages to Redis Pub/Sub")
//        long start = System.currentTimeMillis()
//
//        (1..messageCount).each { i ->
//            def message = new Message(
//                    id: UUID.randomUUID().toString(),
//                    content: "Message $i"
//            )
//            redisTemplate.convertAndSend(REDIS_TOPIC, message.toString())
//        }
//
//        long duration = System.currentTimeMillis() - start
//        log.info("Sent $messageCount messages to Redis Pub/Sub in ${duration}ms")
//    }
//
//    @Async
//    void sendToRedisStream(int messageCount) {
//        log.info("Starting to send $messageCount messages to Redis Stream")
//        long start = System.currentTimeMillis()
//
//        def objectMapper = new ObjectMapper()
//
//        (1..messageCount).each { i ->
//            def message = new Message(
//                    id: UUID.randomUUID().toString(),
//                    content: "Message $i"
//            )
//
//            try {
//                def messageJson = objectMapper.writeValueAsString(message)
//                def record = StreamRecords
//                        .newRecord()
//                        .in(STREAM_KEY)
//                        .ofMap(['message': messageJson] as Map<String, String>)
//                        .withId(RecordId.autoGenerate())
//
//                streamOperations.add(record)
//                        .doOnError { e ->
//                            log.error("Error sending message to Redis Stream: ${e.message}", e)
//                        }
//                        .subscribe()
//            } catch (Exception e) {
//                log.error("Error serializing message: ${e.message}", e)
//            }
//        }
//
//        long duration = System.currentTimeMillis() - start
//        log.info("Sent $messageCount messages to Redis Stream in ${duration}ms")
//    }
}