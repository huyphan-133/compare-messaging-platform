import { UserDetail } from "src/common-module/dto/user/user.dto";

export interface IAuthProvider {
    createAccessToken(payload: any): Promise<string>;
    verifyAccessToken(accessToken: string): Promise<any>;
    getUserDetail(accessToken: string): Promise<UserDetail>;
    createResponsePayload(userDetail: UserDetail, options?: {
        refreshToken?: string
    }): Promise<any>;
}