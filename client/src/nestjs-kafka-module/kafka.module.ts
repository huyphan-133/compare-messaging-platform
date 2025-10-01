import { Module, DynamicModule, Global, Provider } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { KafkaModuleOption, KafkaModuleOptionsAsync, KafkaOptionsFactory } from './interfaces';
import { KafkaModuleOptionsProvider } from './kafka-module-options.provider';
import { KAFKA_MODULE_OPTIONS } from './constants';
import { ApplicationConfig, ModuleRef } from '@nestjs/core';

@Global()
@Module({})
export class KafkaModule {
  static register(options: KafkaModuleOption[]): DynamicModule {
    const clients = (options || []).map((item) => ({
      provide: item.name,
      useFactory: async (moduleRef: ModuleRef) => {
        const service = new KafkaService(item.options);

        // Register for cleanup when module is destroyed
        const app = moduleRef.get(ApplicationConfig, { strict: false });
        if (app) {
          process.on('beforeExit', async () => {
            if (service.onModuleDestroy) {
              await service.onModuleDestroy();
            }
          });
        }

        // Manually trigger onModuleInit
        // if (service.onModuleInit) {
        //   // Defer the call to next tick to ensure module is fully initialized
        //   process.nextTick(() => service.onModuleInit());
        // }
        return service;
      },
      inject: [ModuleRef],
    }));

    return {
      module: KafkaModule,
      providers: clients,
      exports: clients,
    };
  }

  public static registerAsync(
    consumers: string[],
    connectOptions: KafkaModuleOptionsAsync,
  ): DynamicModule {
    const clients = [];
    for (const consumer of consumers) {
      clients.push({
        provide: consumer,
        useFactory: async (
          kafkaModuleOptionsProvider: KafkaModuleOptionsProvider,
        ) => {
          return new KafkaService(
            kafkaModuleOptionsProvider.getOptionsByName(consumer),
          );
        },
        inject: [KafkaModuleOptionsProvider],
      });
    }

    const createKafkaModuleOptionsProvider = this.createKafkaModuleOptionsProvider(connectOptions);

    return {
      module: KafkaModule,
      imports: connectOptions.imports || [],
      providers: [
        createKafkaModuleOptionsProvider,
        KafkaModuleOptionsProvider,
        ...clients,
      ],
      exports: [
        createKafkaModuleOptionsProvider,
        ...clients,
      ],
    };
  }

  private static createKafkaModuleOptionsProvider(
    options: KafkaModuleOptionsAsync,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: KAFKA_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: KAFKA_MODULE_OPTIONS,
      useFactory: async (optionsFactory: KafkaOptionsFactory) =>
        await optionsFactory.createKafkaModuleOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}