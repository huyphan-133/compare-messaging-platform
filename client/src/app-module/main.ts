import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { InterceptorUtils } from './utils/interceptor/interceptor.utils';
import { LoggerUtils } from './utils/logging/log.utils';
import { WSAdapterUtils } from './utils/websocket/ws.adapter';
import { AfterAppCreatedUtils } from './utils/configuration/after-app-created.utils';
import { FilterUtils } from './utils/filter/filter.utils';

export async function bootstrap() {
  const log = new Logger();
  
  process.on('uncaughtException', (err) => {
    log.error(`uncaughtException: ${err.stack}`);
  });

  process.on('unhandledRejection', (reason, p) =>
    log.error('Unhandled Rejection at:', p, reason)
  );

  const app = await NestFactory.create(AppModule, {});

  /**
   * Config Logger
   */
  LoggerUtils.handlers.forEach((handler) => {
    app.useLogger(handler);
  })

  app.enableCors();
  InterceptorUtils.handlers.forEach((handler) => {
    app.useGlobalInterceptors(handler);
  })

  FilterUtils.handlers.forEach((handler) => {
    app.useGlobalFilters(handler);
  })

  /**
   * Load WebSocketAdapter tùy chỉnh
   */
  if (WSAdapterUtils.adapterContructor) {
    const adapter = new WSAdapterUtils.adapterContructor(app);
    app.useWebSocketAdapter(adapter);
  }

  let __port: number = parseInt(process.env['server.port'] || '3000');
  
  /**
   * Thực thi các kịch bản cấu hình bổ sung
   */
  await AfterAppCreatedUtils.exec(app);

  await app.listen(__port);
}