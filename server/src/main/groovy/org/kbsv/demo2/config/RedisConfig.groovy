package org.kbsv.demo2.config

import org.kbsv.demo2.model.Message
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.redis.connection.RedisConnectionFactory
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory
import org.springframework.data.redis.connection.stream.MapRecord
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer
import org.springframework.data.redis.serializer.StringRedisSerializer
import org.springframework.data.redis.stream.StreamMessageListenerContainer

import java.time.Duration

@Configuration
class RedisConfig {
    @Value('${spring.redis.host:localhost}')
    private String redisHost

    @Value('${spring.redis.port:6379}')
    private int redisPort

    @Value('${spring.redis.password:}')
    private String redisPassword

    @Bean
    LettuceConnectionFactory redisConnectionFactory() {
        def factory = new LettuceConnectionFactory(redisHost, redisPort)
        if (redisPassword) {
            factory.password = redisPassword
        }
        factory.afterPropertiesSet()
        return factory
    }

    @Bean
    RedisTemplate<String, String> redisTemplate(LettuceConnectionFactory connectionFactory) {
        def template = new RedisTemplate<String, String>()
        template.setConnectionFactory(connectionFactory)
        template.setKeySerializer(new StringRedisSerializer())
        template.setValueSerializer(new StringRedisSerializer())
        return template
    }

    @Bean
    StringRedisTemplate stringRedisTemplate(RedisConnectionFactory factory) {
        new StringRedisTemplate(factory)
    }
}
