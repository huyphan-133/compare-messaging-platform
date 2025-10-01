import * as CryptoJS from "crypto-js";
import * as Crypto from "crypto";
import * as _ from 'lodash'
import { CryptoOptions, ICryptoHandler } from "./i-crypto.handler";
import { Logger } from "@nestjs/common";
import { ObjectUtils } from "../convert/object.utils";

export class CryptoHandler implements ICryptoHandler {
    readonly log = new Logger(CryptoHandler.name)

    usingBase64Encode: boolean = true;

    keyPair: any = {
        sha1WithRsa: {
            publicKey: `-----BEGIN PUBLIC KEY-----\n${process.env['crypto.sign.sha1_with_rsa.public-key']}\n-----END PUBLIC KEY-----`,
            privateKey: `-----BEGIN PRIVATE KEY-----\n${process.env['crypto.sign.sha1_with_rsa.private-key']}\n-----END PRIVATE KEY-----`,
            passphrase: process.env['crypto.sign.sha1_with_rsa.passphare']
        },
        aes: {
            secretKey: process.env['crypto.sign.aes.secret-key'] || 'e@YZzUe7@b8M2jwFFr9YHq6WvfmBUQmH'
        }
    }

    async encrypt(value: any, options?: CryptoOptions): Promise<any> {
        if (value === undefined || value === null) return value

        options = options || {}

        let __value = _.cloneDeep(value)
        __value = await ObjectUtils.serializeObject(value)

        options.algorithm = options.algorithm || 'aes'

        switch (options.algorithm) {
            case 'sha1':
                __value = CryptoJS.SHA1(__value).toString()
                break
            case 'md5':
                __value = CryptoJS.MD5(__value).toString()
                break
            case 'sha1_with_rsa':
                const __signer = Crypto.createSign('SHA1')
                __signer.update(__value)
                __signer.end()
                __value = __signer.sign({
                    key: this.keyPair.privateKey,
                    passphrase: this.keyPair.passphrase
                }).toString('base64')
                break
            case 'aes':
                __value = CryptoJS.AES.encrypt(__value, this.keyPair.aes.secretKey).toString()
                break
            default:
                throw new Error("Method not implemented.");
        }
        if (this.usingBase64Encode) {
            __value = this.__base64Encode(__value)
        }
        return Promise.resolve(__value)
    }

    async decrypt<T>(value: any, options?: CryptoOptions): Promise<T> {
        if (value === undefined || value === null) return value

        options = options || {}
        options.algorithm = options.algorithm || 'aes'

        let __value = _.cloneDeep(value)
        if (this.usingBase64Encode) {
            __value = this.__base64Decode(__value)
        }
        try {
            switch (options.algorithm) {
                case 'sha1':
                    throw new Error("Method not implemented.");
                case 'md5':
                    throw new Error("Method not implemented.");
                case 'sha1_with_rsa':
                    throw new Error("Method not implemented.");
                case 'aes':
                    __value = CryptoJS.AES.decrypt(__value, this.keyPair.aes.secretKey).toString(CryptoJS.enc.Utf8)
                    break
                default:
                    throw new Error("Method not implemented.");
            }
            __value = await ObjectUtils.deSerializeObject<T>(__value, options.planToObject)
        } catch (e) {
            this.log.error(e)
            __value = null
        }
        return Promise.resolve(__value)
    }

    private __base64Encode(str: string): string {
        return Buffer.from(str, 'binary').toString('base64')
    }

    private __base64Decode(str: string): string {
        return Buffer.from(str, 'base64').toString('binary');
    }
}