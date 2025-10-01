import { Injectable, LogLevel, LoggerService } from '@nestjs/common';
import * as log4js from 'log4js';
import { LoggerUtils } from 'src/app-module/utils/logging/log.utils';

@Injectable()
export class CustomLoggerService implements LoggerService {
    private readonly appName = process.env['log.app-name'];
    private readonly logPath = process.env['log.path'] || './logs';
    private readonly logPattern = process.env['log.pattern'] || '[%p] %d %h %m';

    private readonly logstashEnabled = (process.env['log.logstash.enabled'] || 'false') === 'true';
    private readonly logstashUrl = process.env['log.logstash.url'];

    private logger: log4js.Logger

    private logLevel: { log: boolean, error: boolean, warn: boolean, debug: boolean, verbose: boolean } = {
        log: true,
        error: true,
        warn: true,
        debug: true,
        verbose: true
    }

    private logLevelByLogName: any = {}

    constructor() {
        this.__init()
    }

    log(message: any, ...optionalParams: any[]) {
        if (this.logLevel.log && this.logLevelByLogName[optionalParams[0]] !== false) this.logger.info(`${optionalParams}: ${message}`)
    }
    error(message: any, ...optionalParams: any[]) {
        if (this.logLevel.error && this.logLevelByLogName[optionalParams[0]] !== false) this.logger.error(`${optionalParams}: ${message}`)
    }
    warn(message: any, ...optionalParams: any[]) {
        if (this.logLevel.warn && this.logLevelByLogName[optionalParams[0]] !== false) this.logger.warn(`${optionalParams}: ${message}`)
    }
    debug?(message: any, ...optionalParams: any[]) {
        if (this.logLevel.debug && this.logLevelByLogName[optionalParams[0]] !== false) this.logger.debug(`${optionalParams}: ${message}`)
    }
    verbose?(message: any, ...optionalParams: any[]) {
        if (this.logLevel.verbose && this.logLevelByLogName[optionalParams[0]] !== false) this.logger.debug(`${optionalParams}: ${message}`)
    }
    setLogLevels?(levels: LogLevel[]) {
        Object.keys(this.logLevel).forEach((key: string) => {
            this.logLevel[key] = false
        })
        levels.forEach((level: LogLevel) => {
            this.logLevel[level] = true
        })
    }

    private __init() {
        let config = {
            appenders: {
                out: {
                    type: "stdout",
                    layout: {
                        type: "pattern",
                        pattern: this.logPattern,
                    }
                },
                file: {
                    type: "dateFile", filename: `${this.logPath}/${this.appName}.log`, compress: true, numBackups: 365,
                    layout: {
                        type: "pattern",
                        pattern: this.logPattern,
                    }
                },
            },
            categories: {
                default: {
                    appenders: [
                        "out",
                        "file",
                    ], level: "debug",
                    enableCallStack: true,
                }
            },
        };

        /**
         * load log level theo logger name
         */
        Object.keys(process.env).forEach((key: string) => {
            let logLevelConfigRegex: RegExp = /log.level.([\w]+)/g
            let matches = [...key.matchAll(logLevelConfigRegex)]
            if (matches.length > 0) {
                this.logLevelByLogName[matches[0][1]] = process.env[key] !== 'off'
            }
        })

        if (this.logstashEnabled) {
            config.appenders['logstash'] = {
                type: '@log4js-node/logstash-http',
                url: this.logstashUrl,
                application: this.appName,
                logType: 'application',
                logChannel: 'node',
            };
            config.categories.default.appenders.push('logstash');
        }

        log4js.configure(config);

        this.logger = log4js.getLogger();
        this.logger.addContext('app_name', this.appName);

        LoggerUtils.regHandler(this)
    }
}