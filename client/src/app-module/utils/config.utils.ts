import { Logger } from "@nestjs/common"
import * as _ from "lodash"

export class ConfigUtils {
    static readonly log = new Logger(ConfigUtils.name)
    static validate(config: Record<string, any>): Record<string, any> {
        let __env: any = ConfigUtils.updateOSVariableKey()
        // this.log.debug(JSON.stringify(process.env, null, 2))
        let keepOS: boolean = config['env.keep-os'] !== 'false'
        Object.keys(config).forEach((key) => {
            config[key] = keepOS ? __env[key] || config[key] : config[key]
            if (keepOS && __env[key]) {
                // this.log.debug(`[${key}] ${config[key]} --> ${__env[key]}`)
            }
        })
        _.assign(__env, config)
        return __env
    }

    private static updateOSVariableKey() {
        let __env: any = _.assign({}, process.env)
        Object.keys(process.env).forEach((key: string) => {
            let __key = key
            __key = key.replace(/__/g, '.')
            __env[__key] = process.env[key]
            __key = __key.replace(/_/g, '-')
            __env[__key] = process.env[key]
        })
        return __env
    }
}