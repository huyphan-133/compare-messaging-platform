package org.kbsv.demo2.service.sender

import org.kbsv.demo2.model.Message

interface ISender {
    send(Message message)
}