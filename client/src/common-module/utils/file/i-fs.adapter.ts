import { Dir, MakeDirectoryOptions, Mode, OpenDirOptions, PathLike, PathOrFileDescriptor, RmDirOptions, RmOptions, WriteFileOptions } from "fs";
import { URL } from 'node:url';

export interface IFsAdapter {
    adapterName: string;
    
    /**
     * 
     * @param dto 
     */
    readFileSync(path: PathOrFileDescriptor,
        options?: {
            encoding?: null | undefined;
            flag?: string | undefined;
        } | null): Promise<Buffer | URL | any>;

    /**
     * 
     * @param file 
     * @param data 
     * @param options 
     */
    writeFileSync(file: PathOrFileDescriptor, data: string | NodeJS.ArrayBufferView, options?: WriteFileOptions): Promise<any>;

    /**
     * 
     * @param path 
     * @param data 
     * @param options 
     */
    appendFileSync(path: PathOrFileDescriptor, data: string | Uint8Array, options?: WriteFileOptions): Promise<any>;

    /**
     * 
     * @param path 
     */
    existsSync(path: PathLike): Promise<boolean>;

    /**
     * 
     * @param src 
     * @param dest 
     * @param mode 
     */
    copyFileSync(src: PathLike, dest: PathLike, mode?: number): Promise<any>;

    /**
     * 
     * @param path 
     * @param options 
     */
    opendirSync(path: PathLike, options?: OpenDirOptions): Promise<Dir>;

    /**
     * 
     * @param path 
     * @param options 
     */
    rmdirSync(path: PathLike, options?: RmDirOptions): Promise<any>;

    /**
     * 
     * @param path 
     * @param options 
     */
    mkdirSync(path: PathLike, options?: Mode | MakeDirectoryOptions | null): Promise<any>;

    /**
     * 
     * @param path 
     * @param options 
     */
    rmSync(path: PathLike, options?: RmOptions): Promise<any>;

    /**
     * Lấy đường dẫn truy cập file
     * @param path 
     */
    getFileUrl(path: PathLike): Promise<any>;
}

export class ReadFileSyncDto {
    path: PathOrFileDescriptor;
    options?: {
        encoding?: null | undefined;
        flag?: string | undefined;
    } | null
}