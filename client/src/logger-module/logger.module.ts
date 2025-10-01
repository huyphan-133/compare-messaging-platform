import { Module } from '@nestjs/common';
import { CustomLoggerService } from './service/logger.service';

/**
 * 
 */
@Module({
    imports: [],
    providers: [CustomLoggerService],
    exports: []
})
export class LoggerModule { }
