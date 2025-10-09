// redis.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';

@Injectable()
export class RedisPubsubService implements OnModuleInit, OnModuleDestroy {
    private subscriber: Redis;

    private readonly REDIS_HOST = process.env['redis.host'];
    private readonly REDIS_PORT = parseInt(process.env['redis.port']);


    onModuleInit() {
        const options: RedisOptions = {
            host: this.REDIS_HOST,
            port: this.REDIS_PORT,
        };
        this.subscriber = new Redis(options);

        // Subscribe to a channel
        this.subscriber.subscribe('compare-platform', (err, count) => {
            if (err) {
                console.error('Failed to subscribe:', err);
            } else {
                console.log(`Subscribed successfully! Currently subscribed to ${count} channel(s).`);
            }
        });

        // Handle incoming messages
        this.subscriber.on('message', (channel, message) => {
            const start = new Date().getTime();
            let data: any = JSON.parse(message);
            const end = new Date().getTime();
            console.log(`
                Time from receive: ${end - start} ms,
                producer to consumer: ${start - data.timestamp} ms,
                total time: ${end - data.timestamp} ms
                `);
        });
    }


    async onModuleDestroy() {
        await this.subscriber.quit();
    }
}
