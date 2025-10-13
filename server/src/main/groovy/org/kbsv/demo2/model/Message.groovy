package org.kbsv.demo2.model

import groovy.transform.CompileStatic

import java.time.Instant

@CompileStatic
class Message {
    String id
    String content
    long timestamp = Instant.now().toEpochMilli()
    String source = "producer"
    int partitionNumber
}