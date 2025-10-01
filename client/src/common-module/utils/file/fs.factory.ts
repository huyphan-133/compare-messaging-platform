import { IFsAdapter } from "./i-fs.adapter";

export class FsFactory {
    private static adapters: Record<string, IFsAdapter> = {};

    static registerAdapter(name: string, adapter: IFsAdapter) {
        FsFactory.adapters[name] = adapter;
    }

    static getAdapter(name: string): IFsAdapter {
        return FsFactory.adapters[name];
    }
}