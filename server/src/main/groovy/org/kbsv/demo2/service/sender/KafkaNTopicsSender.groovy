package org.kbsv.demo2.service.sender

import groovy.util.logging.Slf4j
import org.kbsv.demo2.model.Message
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.stereotype.Service

@Slf4j
@Service
class KafkaNTopicsSender implements ISender {
    @Autowired
    private KafkaTemplate<String, Message> kafkaTemplate
//
    private static final List<String> KAFKA_TOPICS =
            [
                    "compare-platform-multi-topic-1",
                    "compare-platform-multi-topic-2",
                    "compare-platform-multi-topic-3",
                    "compare-platform-multi-topic-4",
                    "compare-platform-multi-topic-5",
            ]

    @Override
    def send(Message message) {
        try {
            kafkaTemplate.send(KAFKA_TOPICS[message.partitionNumber], message as Message)
        } catch (Exception e) {
            log.error("Error sending message: ${e.message}", e)
        }
    }
}
