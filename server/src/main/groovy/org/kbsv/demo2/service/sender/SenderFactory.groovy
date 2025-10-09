package org.kbsv.demo2.service.sender

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class SenderFactory {
    @Autowired
    private KafkaSender kafkaSender

    @Autowired
    private RedisPubSubSender redisPubSubSender

    @Autowired
    private RedisStreamSender redisStreamSender

    ISender getSender(String type) {
        switch (type) {
            case 'kafka':
                return kafkaSender
            case 'redis-pubsub':
                return redisPubSubSender
            case 'redis-stream':
                return redisStreamSender
            default:
                throw new IllegalArgumentException("Unsupported sender type: $type")
        }
    }
}
