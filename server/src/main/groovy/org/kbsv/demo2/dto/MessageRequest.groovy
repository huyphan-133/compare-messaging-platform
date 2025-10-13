package org.kbsv.demo2.dto

class MessageRequest {
    int throughput
    int rounds
    String type
    /**
     * Kafka 1 topic: specify number of partitions
     * Kafka many topics: specify number of topic
     */
    int numberOfPartitions  = 1

}
