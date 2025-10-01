import { Logger } from "@nestjs/common"
import { IAuthProvider } from "./i-auth.provider"
import { UserDetail } from "src/common-module/dto/user/user.dto";

export class AuthUtils {
    static readonly log = new Logger(AuthUtils.name);

    static authProviders: IAuthProvider[] = [];

    public static regProvider(provider: IAuthProvider) {
        AuthUtils.authProviders.push(provider);
    }

    static async getUserDetail(accessToken: string): Promise<UserDetail> {
        try {
            let values: any[] = await Promise.allSettled(this.authProviders.map((provider: IAuthProvider) => {
                return provider.getUserDetail(accessToken)
            }));

            let value: any = values.find((item: any) => {
                return item.status === 'fulfilled' && item.value && item.value.username !== 'anonymousUser';
            })
            if (value) {
                return value['value'];
            } else {
                return {
                    username: 'anonymousUser',
                };
            }
        } catch (ex) {
            this.log.error(ex.message);
            return {
                username: 'anonymousUser',
            };
        }
    }
}