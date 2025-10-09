package org.kbsv.demo2.service.sender

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.redis.connection.stream.StreamRecords
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service

@Service
class RedisStreamSender implements ISender {
    @Autowired
    private StringRedisTemplate stringRedisTemplate

    private static final String STREAM_KEY = "compare-platform"

    @Autowired
    private ObjectMapper objectMapper

    @Override
    def send(Object message) {
        def json = objectMapper.writeValueAsString(message)
        def record = StreamRecords.newRecord()
                .ofMap([payload: json])
                .withStreamKey(STREAM_KEY)
        stringRedisTemplate.opsForStream().add(record)
    }
}
