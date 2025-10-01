package org.kbsv.demo2.config

import org.kbsv.demo2.model.Message
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer
import org.springframework.data.redis.serializer.StringRedisSerializer

@Configuration
class RedisConfig {
    @Value('${spring.redis.host:localhost}')
    private String redisHost

    @Value('${spring.redis.port:6379}')
    private int redisPort

    @Bean
    LettuceConnectionFactory redisConnectionFactory() {
        new LettuceConnectionFactory(redisHost, redisPort)
    }

    @Bean
    RedisTemplate<String, String> redisTemplate(LettuceConnectionFactory connectionFactory) {
        def template = new RedisTemplate<String, String>()
        template.setConnectionFactory(connectionFactory)
        template.setKeySerializer(new StringRedisSerializer())
        template.setValueSerializer(new StringRedisSerializer())
        return template
    }

}
