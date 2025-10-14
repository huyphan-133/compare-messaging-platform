package org.kbsv.demo2.controller

import org.kbsv.demo2.dto.MessageRequest
import org.kbsv.demo2.service.MessageProducerService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/messages")
class MessageController {

    @Autowired
    private MessageProducerService messageProducerService

    @PostMapping("/send")
    String send(@RequestBody MessageRequest request) {
        messageProducerService.send(request.throughput, request.rounds, request.type, request.numberOfPartitions)
        return "Started sending ${request.throughput} messages to ${request.type} in ${request.rounds} rounds with seconds delay to ${request.type}"
    }
}