export interface ICryptoHandler {
    encrypt(data: any, options?: CryptoOptions): Promise<any>;
    decrypt<T>(data: any, options?: CryptoOptions): Promise<T>;
}

export type CryptoOptions = {
    /**
     * Thuật toán mã hóa
     */
    algorithm?: 'md5' | 'aes' | 'sha1' | 'sha1_with_rsa';
    /**
     * Phương thức chuyển đổi giá trị sang Object mong muốn
     * @param value 
     * @returns 
     */
    planToObject?: (value: any) => Promise<any>
}