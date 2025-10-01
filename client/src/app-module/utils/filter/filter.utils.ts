import { ExceptionFilter, NestInterceptor } from "@nestjs/common";

export class FilterUtils {
    static handlers: ExceptionFilter[] = []

    static regHandler(handle: ExceptionFilter) {
        FilterUtils.handlers.push(handle)
    }
}