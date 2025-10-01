import { Injectable } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import { IAuthProvider } from './i-auth.provider'
import { ICacheAdapter } from '../cache/i-cache-adapter'
import { CacheUtils } from '../cache/cache.utils'
import { MD5 } from 'crypto-js'
import { randomUUID } from 'crypto'
import { UserDetail } from 'src/common-module/dto/user/user.dto'

@Injectable()
export class JwtProvider implements IAuthProvider {
    accessTokenExpireTime: number = parseInt(process.env['jwt.expire-time']) || 3600;

    refreshTokenEnabled: boolean = process.env['jwt.refresh-token.enabled'] === 'true';
    refreshTokenExpireTime: number = parseInt(process.env['jwt.refresh-token.expire-time']) || this.accessTokenExpireTime * 10;

    options = {
        algorithm: process.env['jwt.algorithm'] || 'HS256',
        expireTime: this.accessTokenExpireTime,
        issuer: process.env['jwt.issuer'] || 'xxx',
        secret: process.env['jwt.secret'] || 'tutq@123',
        tokenType: 'Bearer'
    }

    get cacheAdapter(): ICacheAdapter {
        return CacheUtils.getCacheAdapter();
    }

    async createAccessToken(payload: any): Promise<string> {
        let accessToken = jwt.sign(payload, this.options.secret, {
            algorithm: this.options.algorithm as jwt.Algorithm
        })

        return accessToken;
    }

    async createResponsePayload(userDetail: UserDetail, options?: {
        refreshToken?: string
    }): Promise<any> {
        options = options || {};
        let __accessToken: string;
        let __refreshToken: string = options.refreshToken;
        let __refreshTokenExpireTime: number = 0;
        let __userDetail: UserDetail = userDetail;
        const currentTime = Math.round(new Date().getTime() / 1000);

        if (__refreshToken) {
            let __obj: any = await this.cacheAdapter.get(this.getValidRefreshTokenKey(__refreshToken));
            __accessToken = __obj['accessToken'];
            __userDetail = __obj['userDetail'];
            __refreshTokenExpireTime = this.refreshTokenExpireTime - (currentTime - __obj['createdAt']);

            /**
             * Hủy access_token cũ trước khi cấp phát access_token mới
             */
            await this.cacheAdapter.del(this.getValidTokenKey(__accessToken));
        }

        __accessToken = await this.createAccessToken({
            sub: __userDetail?.username,
            roles: __userDetail.authorities,
            iss: this.options.issuer,
            iat: currentTime,
            exp: currentTime + this.options.expireTime,
            payload: __userDetail.payload
        });

        if (!__refreshToken) {
            __refreshToken = randomUUID().toLowerCase();
            __refreshTokenExpireTime = this.refreshTokenExpireTime;

            /**
             * Lưu refresh_token vào cache để quản lý
             */
            this.cacheAdapter.set(this.getValidRefreshTokenKey(__refreshToken), {
                accessToken: this.encryptValue(__accessToken),
                userDetail: __userDetail,
                createdAt: currentTime
            }, this.refreshTokenExpireTime * 1000);
        }

        /**
         * Lưu access_token vào cache để check token có bị hủy chủ động không (khi logout hoặc backend xóa)
         */
        this.cacheAdapter.set(this.getValidTokenKey(__accessToken), {
            refreshToken: this.encryptValue(__refreshToken),
            userDetail: __userDetail,
            createdAt: currentTime
        }, this.accessTokenExpireTime * 1000);

        return {
            username: __userDetail?.username,
            roles: __userDetail.authorities,
            token_type: this.options.tokenType,
            expires_in: this.options.expireTime,
            access_token: __accessToken,
            refresh_token: this.refreshTokenEnabled ? __refreshToken : undefined,
            refresh_token_expires_in: this.refreshTokenEnabled ? __refreshTokenExpireTime : undefined
        }
    }

    async verifyAccessToken(accessToken: string): Promise<any> {
        let data: any = await this.cacheAdapter.get(this.getValidTokenKey(accessToken));
        if (data) return data;

        data = jwt.verify(accessToken, this.options.secret, {
            algorithms: [this.options.algorithm as jwt.Algorithm]
        });
        return data;
    }

    async getUserDetail(accessToken: string): Promise<UserDetail> {
        let claim: any = await this.verifyAccessToken(accessToken);
        return {
            username: claim.sub.toString(),
            authorities: claim['roles'],
            exp: claim['exp'],
            iat: claim['iat']
        }
    }

    /**
     * Kiểm tra token đã bị hủy chủ động chưa
     * @param accessToken 
     * @returns 
     */
    async checkValidToken(accessToken: string, userDetail?: UserDetail): Promise<any> {
        let rs: any = await this.cacheAdapter.get(this.getValidTokenKey(accessToken));
        return rs;
    }

    /**
     * Hủy token
     */
    async invokeAccessToken(accessToken: string, userDetail?: UserDetail) {
        let data: any = await this.cacheAdapter.get(this.getValidTokenKey(accessToken));
        if (data) {
            await this.cacheAdapter.del(this.getValidRefreshTokenKey(data['refreshToken']));
        }
        await this.cacheAdapter.del(this.getValidTokenKey(accessToken));
        return true;
    }

    private getValidTokenKey(token: string) {
        let __key: string = `jwt-provider:valid-tokens:${token.startsWith('{') ? token : this.encryptValue(token)}`;
        return __key;
    }

    private getValidRefreshTokenKey(token: string) {
        let __key: string = `jwt-provider:valid-refresh-tokens:${token.startsWith('{') ? token : this.encryptValue(token)}`;
        return __key;
    }

    private encryptValue(value: string, algorithm: string = 'md5') {
        let __val: string;
        switch (algorithm) {
            case 'md5':
                __val = `{md5}${MD5(value)}`;
                break;
            default:
                __val = `{md5}${MD5(value)}`;
                break;
        }

        return __val;
    }
}