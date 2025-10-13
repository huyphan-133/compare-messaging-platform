import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { IHeaders, KafkaService, SubscribeTo } from "src/nestjs-kafka-module";
import { CustomLoggerService } from "src/logger-module/service/logger.service";

@Injectable()
export class KafkaNPartitionsConsumer implements OnModuleInit {
    @Inject() readonly logger: CustomLoggerService;
    @Inject('KAFKA_SERVICE') client: KafkaService;

    onModuleInit() {
        this.client.subscribeToResponseOf("compare-platform-multi-topic-1", this)
        this.client.subscribeToResponseOf("compare-platform-multi-topic-2", this)
        this.client.subscribeToResponseOf("compare-platform-multi-topic-3", this)
        this.client.subscribeToResponseOf("compare-platform-multi-topic-4", this)
        this.client.subscribeToResponseOf("compare-platform-multi-topic-5", this)
    }

    @SubscribeTo((() => {
        let topic = "compare-platform-multi-topic-1"
        console.log(">>>>>>>>>>>>>>>>>>>>>> ", topic);
        return topic;
    })())
    async handle1(payload: any, key: any, offset: number, timestamp: number, partition: number, headers: IHeaders) {
        this.handleMessage(payload, timestamp);
    }

    @SubscribeTo((() => {
        let topic = "compare-platform-multi-topic-2"
        console.log(">>>>>>>>>>>>>>>>>>>>>> ", topic);
        return topic;
    })())
    async handle2(payload: any, key: any, offset: number, timestamp: number, partition: number, headers: IHeaders) {
        this.handleMessage(payload, timestamp);
    }

    @SubscribeTo((() => {
        let topic = "compare-platform-multi-topic-3"
        console.log(">>>>>>>>>>>>>>>>>>>>>> ", topic);
        return topic;
    })())
    async handle3(payload: any, key: any, offset: number, timestamp: number, partition: number, headers: IHeaders) {
        this.handleMessage(payload, timestamp);
    }

    @SubscribeTo((() => {
        let topic = "compare-platform-multi-topic-4"
        console.log(">>>>>>>>>>>>>>>>>>>>>> ", topic);
        return topic;
    })())
    async handle4(payload: any, key: any, offset: number, timestamp: number, partition: number, headers: IHeaders) {
        this.handleMessage(payload, timestamp);
    }
    
    @SubscribeTo((() => {
        let topic = "compare-platform-multi-topic-5"
        console.log(">>>>>>>>>>>>>>>>>>>>>> ", topic);
        return topic;
    })())
    async handle5(payload: any, key: any, offset: number, timestamp: number, partition: number, headers: IHeaders) {
        this.handleMessage(payload, timestamp);
    }

    handleMessage(payload: any, timestamp: number) {
        try {
            const start = new Date().getTime();
            let data: any = JSON.parse(payload);
            const end = new Date().getTime();
            console.log(`
                ID: ${data.id},
                Time from receive: ${end - start} ms,
                producer to kafka: ${timestamp - data.timestamp} ms,
                kafka to consumer: ${start - timestamp} ms,
                total time: ${end - data.timestamp} ms
                `);
        } catch (e) {
            this.logger.error(`ERROR payload=${payload} e=${e.message}`);
        }
    }

}