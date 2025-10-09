import { Module } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { json, urlencoded } from 'express';

import { ModuleRefUtils } from 'src/common-module/utils/module-ref.utils';


import { AfterAppCreatedUtils } from 'src/app-module/utils/configuration/after-app-created.utils';
import { CustomLoggerService } from 'src/logger-module/service/logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ConfigUtils } from 'src/app-module/utils/config.utils';
import { KafkaModule } from 'src/nestjs-kafka-module';
import { KafkaConsumer } from './consumer/kafka-consumer';
import { RestTemplate } from 'src/common-module/utils/rest-template/rest-template.utils';
import { RedisPubsubService } from './service/redis-pubsub.service';
import { RedisStreamService } from './service/redis-stream.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            cache: true,
            isGlobal: true,
            ignoreEnvVars: true,
            validate: (config: Record<string, any>) => { return ConfigUtils.validate(config) }
        }),
        ScheduleModule.forRoot(),
        TypeOrmModule.forFeature([]),
        KafkaModule.register([{
            name: 'KAFKA_SERVICE',
            options: {
                client: {
                    brokers: (process.env['kafka.brokers'] || '').split(',').map(url => {
                        const [host, port] = url.split(':');
                        return `${host}:${port}`;
                    }),
                    retry: {
                        initialRetryTime: 30000,
                        retries: Number.MAX_SAFE_INTEGER,
                    }
                },
                consumer: {
                    groupId: process.env['kafka.group-id'],
                    retry: {
                        initialRetryTime: 30000,
                        retries: Number.MAX_SAFE_INTEGER,
                    }
                }
            }
        }]),
    ],
    controllers: [
    ],
    providers: [
        CustomLoggerService,
        RestTemplate,
        KafkaConsumer,
        RedisPubsubService,
        RedisStreamService
    ],
    exports: []
})
export class MainModule {
    constructor(moduleRef: ModuleRef) {
        ModuleRefUtils.registerModuleRef(MainModule.name, moduleRef);

        AfterAppCreatedUtils.registerCallback(async (app: any) => {
            await app.use(json({ limit: '5mb' }));
            await app.use(urlencoded({ limit: '5mb', extended: true }));
        });
    }
}
