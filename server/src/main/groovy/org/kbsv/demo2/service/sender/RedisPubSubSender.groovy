package org.kbsv.demo2.service.sender

import com.fasterxml.jackson.databind.ObjectMapper
import groovy.util.logging.Slf4j
import org.kbsv.demo2.model.Message
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.stereotype.Service

@Slf4j
@Service
class RedisPubSubSender implements ISender {
    @Autowired
    private RedisTemplate<String, String> redisTemplate
//
    private static final String CHANNEL = "compare-platform"

    private final objectMapper = new ObjectMapper()

    @Override
    def send(Message message) {
        try {
            String sMessage = objectMapper.writeValueAsString(message)
            redisTemplate.convertAndSend(CHANNEL, sMessage)
        } catch (Exception e) {
            log.error("Error sending message: ${e.message}", e)
        }
    }
}
