import { MakeDirectoryOptions, Mode, PathLike, PathOrFileDescriptor, RmDirOptions, RmOptions, WriteFileOptions, mkdirSync, readFileSync, rmSync, rmdirSync, writeFileSync } from "fs";
import { Injectable, Logger } from "@nestjs/common";
import { AFsAdapter } from "./a-fs.adapter";

@Injectable()
export class LocalFsAdapter extends AFsAdapter {

    constructor() {
        super(LocalFsAdapter.name);
    }

    override async getFileUrl(path: PathLike): Promise<any> {
        return path;
    }

    override async readFileSync(path: PathOrFileDescriptor, options?: { encoding?: null; flag?: string; }): Promise<any> {
        return readFileSync(path, options);
    }

    override async writeFileSync(file: PathOrFileDescriptor, data: string | NodeJS.ArrayBufferView, options?: WriteFileOptions): Promise<any> {
        return writeFileSync(file, data, options);
    }

    override async mkdirSync(path: PathLike, options?: Mode | MakeDirectoryOptions): Promise<any> {
        return mkdirSync(path, options);
    }

    override async appendFileSync(path: PathOrFileDescriptor, data: string | Uint8Array, options?: WriteFileOptions): Promise<any> {
        
    }

    override async existsSync(path: PathLike): Promise<boolean> {
        return false;
    }

    override async rmdirSync(path: PathLike, options?: RmDirOptions): Promise<any> {
        return rmdirSync(path, options);
    }

    override async rmSync(path: PathLike, options?: RmOptions): Promise<any> {
        return rmSync(path, options);
    }
}