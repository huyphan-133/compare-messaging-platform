import { Module } from '@nestjs/common';
import { MainModule } from './main-module/main.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigUtils } from './app-module/utils/config.utils';
import { CacheModule } from '@nestjs/cache-manager';
import { join } from 'node:path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { KafkaModule } from './nestjs-kafka-module';
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      ignoreEnvVars: true,
      validate: (config: Record<string, any>) => { return ConfigUtils.validate(config) }
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    CacheModule.register(),
    MainModule,
  ],
  controllers: [],
  providers: [
  ],
})
export class AppModule {
}
