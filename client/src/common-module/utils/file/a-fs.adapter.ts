import { Logger } from "@nestjs/common";
import { IFsAdapter } from "./i-fs.adapter";
import { FsFactory } from "./fs.factory";
import { Dir, MakeDirectoryOptions, Mode, OpenDirOptions, PathLike, PathOrFileDescriptor, RmDirOptions, RmOptions, WriteFileOptions } from "fs";

export abstract class AFsAdapter implements IFsAdapter {
    log: Logger;
    adapterName: string;

    constructor(adapterName: string) {
        this.adapterName = adapterName;

        this.log = new Logger(adapterName);
        this.log.log(`auto register FS Adapter '${adapterName}...'`)
        FsFactory.registerAdapter(adapterName, this);
    }
    
    getFileUrl(path: PathLike): Promise<any> {
        throw new Error("Method not implemented.");
    }
    rmSync(path: PathLike, options?: RmOptions): Promise<any> {
        throw new Error("Method not implemented.");
    }
    rmdirSync(path: PathLike, options?: RmDirOptions): Promise<any> {
        throw new Error("Method not implemented.");
    }
    mkdirSync(path: PathLike, options?: Mode | MakeDirectoryOptions): Promise<any> {
        throw new Error("Method not implemented.");
    }
    copyFileSync(src: PathLike, dest: PathLike, mode?: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
    opendirSync(path: PathLike, options?: OpenDirOptions): Promise<Dir> {
        throw new Error("Method not implemented.");
    }
    appendFileSync(path: PathOrFileDescriptor, data: string | Uint8Array, options?: WriteFileOptions): Promise<any> {
        throw new Error("Method not implemented.");
    }
    existsSync(path: PathLike): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    readFileSync(path: PathOrFileDescriptor, options?: { encoding?: null; flag?: string; }): Promise<any> {
        throw new Error("Method not implemented.");
    }
    writeFileSync(file: PathOrFileDescriptor, data: string | NodeJS.ArrayBufferView, options?: WriteFileOptions): Promise<any> {
        throw new Error("Method not implemented.");
    }
}