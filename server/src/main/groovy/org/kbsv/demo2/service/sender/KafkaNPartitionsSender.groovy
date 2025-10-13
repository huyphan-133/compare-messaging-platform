package org.kbsv.demo2.service.sender

import groovy.util.logging.Slf4j
import org.kbsv.demo2.model.Message
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.stereotype.Service

@Slf4j
@Service
class KafkaNPartitionsSender implements ISender {
    @Autowired
    private KafkaTemplate<String, Message> kafkaTemplate
//
    private static final String KAFKA_TOPIC = "compare-platform-multi-partition"

    @Override
    def send(Message message) {
        try {
            kafkaTemplate.send(KAFKA_TOPIC, message.partitionNumber, null, message as Message)
        } catch (Exception e) {
            log.error("Error sending message: ${e.message}", e)
        }
    }
}
