import { randomUUID } from 'crypto';
import { CryptoHandler } from '../../utils/crypto/crypto-handler';
import { ICryptoHandler } from '../../utils/crypto/i-crypto.handler';
import { BeforeInsert, BeforeUpdate, Column } from 'typeorm';
import { Logger } from '@nestjs/common';
import { BaseEntity } from './base.entity';

export abstract class SignedBaseEntity extends BaseEntity {
    log = new Logger(SignedBaseEntity.name)

    @Column({ nullable: true, length: 256 })
    sign: string

    /**
     * Các trường dữ liệu dùng để sinh chữ ký
     */
    fieldsToSign: string[] = []

    /**
     * Sinh chữ ký
     * @returns 
     */
    private async genSign() {
        let __fieldsToSignal: any = Reflect.getMetadata('fields-to-sign', this) || this.fieldsToSign;

        let cryptoHandler: ICryptoHandler = new CryptoHandler()
        let uuid: string = randomUUID().toLowerCase()
        let signData: string = __fieldsToSignal.map((field: string) => {
            return `${this[field]}`
        }).join('|')
        signData = `${uuid}|${signData}`

        let sign: string = await cryptoHandler.encrypt(signData, { algorithm: 'aes' })
        // this.log.debug(`${signData} --> ${sign}`)

        return `${uuid}|${sign}`
    }

    /**
     * Trả về chữ ký có hợp lệ không
     * @returns 
     */
    async isValidSign() {
        let __fieldsToSignal: any = Reflect.getMetadata('fields-to-sign', this) || this.fieldsToSign;

        let cryptoHandler: ICryptoHandler = new CryptoHandler()
        let __signParts: string[] = (this.sign || '').split('|')
        if (__signParts.length < 2) return false

        let sign: string = __signParts.at(1)
        let uuid: string = __signParts.at(0)
        let signData: string = __fieldsToSignal.map((field: string) => {
            return `${this[field]}`
        }).join('|')
        signData = `${uuid}|${signData}`

        let calcSign: string = await cryptoHandler.decrypt(sign, { algorithm: 'aes' })
        // this.log.debug(`${sign} --> ${calcSign}`)

        return signData === calcSign
    }

    @BeforeInsert()
    async beforeInsert() {
        this.sign = await this.genSign();
    }

    @BeforeUpdate()
    async beforeUpdate() {
        this.sign = await this.genSign();
    }
}