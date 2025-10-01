import { LoggerService } from "@nestjs/common";

export class LoggerUtils {
    static handlers: LoggerService[] = []

    static regHandler(loggerHandle: LoggerService) {
        LoggerUtils.handlers.push(loggerHandle)
    }
}