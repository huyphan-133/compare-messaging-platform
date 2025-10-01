import { NestInterceptor } from "@nestjs/common";

export class InterceptorUtils {
    static handlers: NestInterceptor[] = []

    static regHandler(handle: NestInterceptor) {
        InterceptorUtils.handlers.push(handle)
    }
}