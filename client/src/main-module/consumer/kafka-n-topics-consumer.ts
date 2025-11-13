import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { IHeaders, KafkaService, SubscribeTo } from "src/nestjs-kafka-module";
import { CustomLoggerService } from "src/logger-module/service/logger.service";

@Injectable()
export class KafkaNTopicsConsumer implements OnModuleInit {
    @Inject() readonly logger: CustomLoggerService;
    @Inject('KAFKA_SERVICE') client: KafkaService;

    onModuleInit() {
        this.client.subscribeToResponseOf("compare-platform-multi-partition", this)
    }

    @SubscribeTo((() => {
        let topic = "compare-platform-multi-partition"
        console.log(">>>>>>>>>>>>>>>>>>>>>> ", topic);
        return topic;
    })())
    async handle(payload: any, key: any, offset: number, timestamp: number, partition: number, headers: IHeaders) {
        try {
            const start = new Date().getTime();
            let data: any = JSON.parse(payload);
            const end = new Date().getTime();
            console.log(`
                kafka-multi-partition
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