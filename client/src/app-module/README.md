## 1. Các package cần cài đặt

- install

``` bash
```

- file package.json:

```
```

- file .env

```
# Tham so cau hinh cho app module ========================================
env.keep-os=true    # ưu tiên giá trị env của os, mặc định true

## Trường hợp dùng sqlite ================================================
# data-source.database=
# data-source.synchronize=
# data-source.pool-size=
## Trường hợp dùng sqlite ================================================

# Tham so cau hinh cho app module ========================================
```

- module cần khai báo trước

```
```

- main.ts example

```
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerUtils } from './app-module/utils/logging/log.utils';
import { InterceptorUtils } from './app-module/utils/interceptor/interceptor.utils';
import { WSAdapterUtils } from './app-module/utils/websocket/ws.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {

  });

  LoggerUtils.handlers.forEach((handler) => {
    app.useLogger(handler);
  })

  app.enableCors()
  InterceptorUtils.handlers.forEach((handler) => {
    app.useGlobalInterceptors(handler)
  })

  if (WSAdapterUtils.adapterContructor) {
    const adapter = await WSAdapterUtils.create(app)
    app.useWebSocketAdapter(adapter)
  }

  let __port: number = parseInt(process.env['server.port'] || '3000')
  await app.listen(__port);
}
bootstrap();
```

## 2. Cách sử dụng

- Khai báo module trong app.module.ts
