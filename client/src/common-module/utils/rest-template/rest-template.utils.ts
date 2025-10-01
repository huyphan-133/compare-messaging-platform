import { Injectable } from '@nestjs/common'
import axios from 'axios'
import * as https from 'https'

@Injectable()
export class RestTemplate {
    static __saveHistHandler: (req: any, res: any, options: any) => any | Promise<any>
    __logging = true
    logRequestBody = false
    logRequestHeader = true
    logResponseBody = false
    logResponseHeader = true

    httpsAgent = new https.Agent({
        rejectUnauthorized: false
    })

    static setSaveHistHandler(handler: (req: any, res: any, options: any) => any | Promise<any>) {
        RestTemplate.__saveHistHandler = handler
    }

    __defaultInterceptor(req: any, res: any, options: any = {}) {
        if (this.__logging && RestTemplate.__saveHistHandler) {
            RestTemplate.__saveHistHandler(req, res, options)
        }
    }

    get(url: string, options: { headers?: any, params?: any } = { headers: {}, params: {} }): Promise<any> {
        return new Promise((resolve, reject) => {
            let __requestTime = new Date()
            axios.get(url, {
                headers: {
                    ...(options.headers || {}),
                    'x-app-name': process.env['server.name'] || process.env['log.app-name'] || "unknown-source",
                },
                params: options.params
            }).then((res) => {
                this.__defaultInterceptor(res.request, res, {
                    requestTime: __requestTime,
                    responseTime: new Date().getTime() - __requestTime.getTime()
                })
                resolve(res)
            }).catch((e) => {
                this.__defaultInterceptor(e.request, e.response, {
                    requestTime: __requestTime,
                    responseTime: new Date().getTime() - __requestTime.getTime()
                })
                reject(e)
            })
        })
    }

    post(url: string, request = { data: undefined, headers: {} }, options = {}) {
        return new Promise((resolve, reject) => {
            let __requestTime = new Date()
            axios.post(url, request.data, {
                httpsAgent: this.httpsAgent,
                headers: {
                    ...(request.headers || {}),
                    'x-app-name': process.env['server.name'] || process.env['log.app-name'] || "unknown-source",
                }
            }).then((res) => {
                this.__defaultInterceptor(res.request, res, {
                    requestTime: __requestTime,
                    responseTime: new Date().getTime() - __requestTime.getTime()
                })
                resolve(res)
            }).catch((e) => {
                this.__defaultInterceptor(e.request, e.response, {
                    requestTime: __requestTime,
                    responseTime: new Date().getTime() - __requestTime.getTime()
                })
                reject(e)
            })
        })
    }

    put(url: string, options: any = {}) {
        throw new Error("Method not implemented.");
    }

    delete(url: string, options: any = {}) {
        throw new Error("Method not implemented.");
    }
}