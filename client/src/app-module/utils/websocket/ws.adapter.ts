import { INestApplicationContext } from "@nestjs/common";

export class WSAdapterUtils {
    static adapterContructor: ReturnType<any>;

    static async create(app: INestApplicationContext | any) {
        let adapter = new this.adapterContructor(app)
        return adapter
    }

    static registerAdapter(adapter: ReturnType<any>) {
        WSAdapterUtils.adapterContructor = adapter
    }
}