import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import { ACacheAdapter } from "./a-cache.adapter";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class MemCacheAdapter extends ACacheAdapter {

    constructor(@Inject(CACHE_MANAGER) cacheManager: Cache) {
        cacheManager.stores['name'] = 'mem-cache'
        super(cacheManager)
    }
}