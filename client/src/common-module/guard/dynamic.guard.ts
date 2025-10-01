import { Injectable, CanActivate, Logger, ExecutionContext } from "@nestjs/common";
import { CacheUtils } from "../utils/cache/cache.utils";
import { ICacheAdapter } from "../utils/cache/i-cache-adapter";
import { Observable } from "rxjs";
import * as _ from "lodash";

@Injectable()
export class DynamicGuard implements CanActivate {
    static readonly log: Logger = new Logger(DynamicGuard.name);

    private static readonly DEFAULT_ORD: number = 999999;
    private static __handlers: IGuardHandlerDetails[] = [];

    private get cacheAdapter(): ICacheAdapter {
        return CacheUtils.getCacheAdapter();
    }

    static registerAdapter(handlerDetails: IGuardHandlerDetails) {
        this.log.log(`auto register Guard '${handlerDetails.code}'...`);
        DynamicGuard.__handlers.push({
            ord: handlerDetails.ord || DynamicGuard.DEFAULT_ORD,
            code: handlerDetails.code,
            handler: handlerDetails.handler,
            matchAll: handlerDetails.matchAll
        })
        DynamicGuard.__handlers = DynamicGuard.__handlers.sort((a: IGuardHandlerDetails, b: IGuardHandlerDetails) => {
            return (a.ord || DynamicGuard.DEFAULT_ORD) - (b.ord || DynamicGuard.DEFAULT_ORD);
        })
    }

    static getAdapter(code: string): CanActivate {
        return DynamicGuard.__handlers.find((h: IGuardHandlerDetails) => h.code === code)?.handler;
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return this.__canActive(context, 0);
    }

    private async __canActive(context: ExecutionContext, step: number = 0): Promise<boolean> {
        if (step >= DynamicGuard.__handlers.length) return true;
        
        let __handler: IGuardHandlerDetails = DynamicGuard.__handlers[step];

        if (__handler.matchAll) {
            return new Promise((resolve) => {
                let rs: boolean;
                let __rs = __handler.handler.canActivate(context);
                if (_.isBoolean(__rs)) {
                    rs = __rs as boolean;
                    if (!rs) return resolve(rs);
                    return resolve(this.__canActive(context, ++step));
                } else if (__rs instanceof Promise) {
                    (__rs as Promise<boolean>).then((val: boolean) => {
                        if (!val) return resolve(false);
                        return resolve(this.__canActive(context, ++step));
                    });
                } else if (__rs instanceof Observable) {
                    __rs.subscribe({
                        next: (val: boolean) => {
                            if (!val) return resolve(false);
                            return resolve(this.__canActive(context, ++step));
                        }
                    })
                }
            });
        } else {
            return this.__canActive(context, ++step);
        }
    }
}

export interface IGuardHandlerDetails {
    code: string,
    ord?: number,
    handler: CanActivate,

    /**
     * Kiểm tra tất cả các request
     */
    matchAll: boolean;
}