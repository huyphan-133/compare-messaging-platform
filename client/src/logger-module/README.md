## 1. Các package cần cài đặt

- install

``` bash
npm install log4js @log4js-node/logstash-http
```

- file package.json:

```
```

- file .env

```
# Tham số cấu hình cho log module ========================================
log.app-name=app-name
log.path=./logs
log.pattern=[%p] %d %h %m
log.logstash.enabled=true
log.logstash.url=http://ip:port

log.level.<logger_name>=off #on/off
# Tham số cấu hình cho log module ========================================
```

- module cần khai báo trước

```
```

## 2. Cách sử dụng
- Khai báo module trong app.module.ts