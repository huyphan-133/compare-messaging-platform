import { INestApplication, Module } from '@nestjs/common';
import { APP_GUARD, ModuleRef } from '@nestjs/core';
import * as moment from 'moment';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { DynamicGuard } from './guard/dynamic.guard';
import { JwtProvider } from './utils/auth-provider/jwt.provider';
import { MemCacheAdapter } from './utils/cache/mem-cache-adapter';
import { LocalFsAdapter } from './utils/file/local-fs.adapter';
import { ModuleRefUtils } from './utils/module-ref.utils';
import { NodeModulesUtils } from './utils/node-modules.utils';
import { RestTemplate } from './utils/rest-template/rest-template.utils';
import { AfterAppCreatedUtils } from 'src/app-module/utils/configuration/after-app-created.utils';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [CacheModule.register()],
    providers: [
        JwtProvider, LocalFsAdapter, RestTemplate, MemCacheAdapter,
        {
            provide: APP_GUARD,
            useClass: DynamicGuard,
        },
    ],
    exports: [JwtProvider, RestTemplate, MemCacheAdapter]
})
export class CommonModule {
    constructor(moduleRef: ModuleRef) {
        ModuleRefUtils.registerModuleRef(CommonModule.name, moduleRef);

        NodeModulesUtils.loadVersions();

        Date.prototype.toJSON = function () {
            return moment(this).format();
        }

        if (process.env['common.global_exception_filter.enabled'] == 'true') {
            AfterAppCreatedUtils.registerCallback(async (app: INestApplication) => {
                app.useGlobalFilters(new HttpExceptionFilter());
            })
        }
    }
}
