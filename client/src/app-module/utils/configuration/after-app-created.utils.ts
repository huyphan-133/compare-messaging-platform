import { INestApplication, Logger } from "@nestjs/common"
import { randomUUID } from "crypto"

export class AfterAppCreatedUtils {
    private static readonly log: Logger = new Logger(AfterAppCreatedUtils.name);

    private static registeredCallbacks: Record<string, AfterAppCreateCallback> = {}

    /**
     * Đăng ký kịch bản xử lý thêm sau khi app được khởi tạo
     * @param callback 
     */
    public static registerCallback(callback: AfterAppCreateCallback) {
        this.log.log('register callback after app created...');
        AfterAppCreatedUtils.registeredCallbacks[randomUUID().toString()] = callback;
    }

    /**
     * Thực thi kịch bản
     * @returns 
     */
    public static async exec(app: any) {
        this.log.log('exec callbacks...');
        return Promise.allSettled(Object.values(AfterAppCreatedUtils.registeredCallbacks).map((cb: AfterAppCreateCallback) => {
            return cb(app)
        }));
    }
}

export type AfterAppCreateCallback = (app: INestApplication) => Promise<any>