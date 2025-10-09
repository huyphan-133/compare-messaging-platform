// redis-stream.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';

@Injectable()
export class RedisStreamService implements OnModuleInit, OnModuleDestroy {
    private redis: Redis;
    private consumerGroup = 'my-consumer-group';
    private consumerName = `consumer-${Math.floor(Math.random() * 1000)}`;
    private streamKey = 'compare-platform';
    private isRunning = true;

    private readonly REDIS_HOST = process.env['redis.host'];
    private readonly REDIS_PORT = parseInt(process.env['redis.port']);

    async onModuleInit() {
        const options: RedisOptions = {
            host: this.REDIS_HOST,
            port: this.REDIS_PORT,
        };
        this.redis = new Redis(options);

        // Create consumer group (ignore error if it already exists)
        try {
            await this.redis.xgroup('CREATE', this.streamKey, this.consumerGroup, '$', 'MKSTREAM');
            console.log(`Consumer group "${this.consumerGroup}" created.`);
        } catch (err) {
            if (!err.message.includes('BUSYGROUP')) {
                throw err;
            }
            console.log(`Consumer group "${this.consumerGroup}" already exists.`);
        }

        // Start listening for messages
        this.pollStream();
    }

    private async pollStream() {
        while (this.isRunning) {
            try {
                const response = await this.redis.xreadgroup(
                    'GROUP',
                    this.consumerGroup,
                    this.consumerName,
                    'COUNT',
                    10,
                    'BLOCK',
                    500,
                    'STREAMS',
                    this.streamKey,
                    '>'
                );

                if (response) {
                    const [streamName, messages] = response[0] as [string, [string, string[]][]];
                    for (const [id, fields] of messages) {
                        const start = new Date().getTime();
                        const message = this.parseMessage(fields);
                        const end = new Date().getTime();
                        console.log(`
                            Stream message ID: ${id}
                            Time from receive: ${end - start} ms,
                            Producer to consumer: ${start - message.timestamp} ms,
                            Total time: ${end - message.timestamp} ms
                        `);

                        // Acknowledge message
                        await this.redis.xack(this.streamKey, this.consumerGroup, id);
                    }
                }
            } catch (err) {
                console.error('Error reading stream:', err);
            }
        }
    }

    private parseMessage(fields: string[]) {
       return JSON.parse(fields[1]);
    }

    async onModuleDestroy() {
        this.isRunning = false;
        await this.redis.quit();
    }
}
