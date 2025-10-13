package org.kbsv.demo2.service.sender

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class SenderFactory {
    @Autowired
    private KafkaNPartitionsSender kafkaNPartitionsSender

    @Autowired
    private RedisPubSubSender redisPubSubSender

    @Autowired
    private RedisStreamSender redisStreamSender

    @Autowired
    private KafkaNTopicsSender kafkaNTopicsSender

    @Autowired
    private KafkaOnlyOneSender kafkaOnlyOneSender

    ISender getSender(String type) {
        switch (type) {
            case 'kafka-only-one':
                return kafkaOnlyOneSender
            case 'kafka-n-partitions':
                return kafkaNPartitionsSender
            case 'kafka-n-topics':
                return kafkaNTopicsSender
            case 'redis-pubsub':
                return redisPubSubSender
            case 'redis-stream':
                return redisStreamSender
            default:
                throw new IllegalArgumentException("Unsupported sender type: $type")
        }
    }
}
