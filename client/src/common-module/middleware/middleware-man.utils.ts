import { Logger, NestMiddleware, Type } from "@nestjs/common";
import { RouteInfo } from "@nestjs/common/interfaces";

/**
 * Chưa chạy được
 */
export class MiddlewareManUtils {
    static readonly log: Logger = new Logger(MiddlewareManUtils.name);

    private static readonly DEFAULT_ORD: number = 999999;
    private static __middlewares: IMiddlewareDetails[] = [];

    static registerMiddleware(middleware: IMiddlewareDetails) {
        this.log.log(`auto register Middleware '${middleware.code}'...`);
        middleware.ord = middleware.ord || MiddlewareManUtils.DEFAULT_ORD;
        middleware.forRoutes = middleware.forRoutes || '*';
        MiddlewareManUtils.__middlewares.push(middleware);
        MiddlewareManUtils.__middlewares = MiddlewareManUtils.__middlewares.sort((a: IMiddlewareDetails, b: IMiddlewareDetails) => {
            return (a.ord || MiddlewareManUtils.DEFAULT_ORD) - (b.ord || MiddlewareManUtils.DEFAULT_ORD);
        })
    }

    static middlewares(): IMiddlewareDetails[] {
        return MiddlewareManUtils.__middlewares;
    }
}

export interface IMiddlewareDetails {

    code: string,
    ord?: number,
    middleware: Type<any> | Function,

    /**
     * Kiểm tra tất cả các request
     */
    matchAll: boolean;

    forRoutes?: string | Type<any> | RouteInfo;
}