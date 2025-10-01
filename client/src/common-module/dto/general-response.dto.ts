export class GeneralResponse {
    code: ResponseCode = ResponseCode.SUCCESS;
    transactionTime = new Date().getTime();

    errorCode?: string;
    category?: string;
    subCategory?: string;
    message?: string;
    messageDetail?: string;

    value?: any;

    /**
     * Tạo đối tượng General Response từ GeneralResponseTemp
     * @param errorCodeDetail 
     * @param option 
     * @returns 
     */
    static getInstance(errorCodeDetail: GeneralResponseTemp, options?: { message?: string, value?: any }): GeneralResponse {
        let __gr = new GeneralResponse()
        __gr.code = errorCodeDetail.code || __gr.code
        __gr.errorCode = errorCodeDetail.errorCode
        __gr.message = options?.message || errorCodeDetail.message
        __gr.value = options?.value
        return __gr
    }
}

export enum ResponseCode {
    SUCCESS = 0,
    ERROR = -1,
    ERROR_CAN_RETRY = -2
}

export class GeneralResponseErrorDetail {
    // Nhóm lỗi xác thực (1xxx)
    static readonly API_KEY_NOT_FOUND_ERROR: GeneralResponseTemp = { errorCode: '1000', message: 'API Key không tồn tại', code: ResponseCode.ERROR }
    static readonly API_KEY_NOT_EXISTS_ERROR: GeneralResponseTemp = { errorCode: '1000', message: 'API Key không tồn tại', code: ResponseCode.ERROR }
    static readonly API_KEY_NOT_PERMIT_ERROR: GeneralResponseTemp = { errorCode: '1001', message: 'API Key không có quyền', code: ResponseCode.ERROR }
    static readonly API_KEY_EXPIRED_ERROR: GeneralResponseTemp = { errorCode: '1002', message: 'API Key không có quyền', code: ResponseCode.ERROR }
    static readonly USER_LIMIT_FUNC_ERROR: GeneralResponseTemp = { errorCode: '1020', message: 'Chức năng đang giới hạn người sử dụng', code: ResponseCode.ERROR }
    static readonly USER_NOT_PERMIT_ERROR: GeneralResponseTemp = { errorCode: '1021', message: 'User không có quyền', code: ResponseCode.ERROR }

    static readonly USER_NOT_VALIDATED: GeneralResponseTemp = { errorCode: '1100', message: 'User chưa được xác nhận', code: ResponseCode.ERROR }
    static readonly INVALID_USERNAME_OR_PASSWORD: GeneralResponseTemp = { errorCode: '1101', message: 'Sai username hoặc password', code: ResponseCode.ERROR }

    // Nhóm lỗi Validate dữ liệu (2xxx)
    static readonly PARAMS_VALIDATION_ERROR: GeneralResponseTemp = { errorCode: '2000', message: 'Truyền thiếu hoặc sai tham số', code: ResponseCode.ERROR }

    // Nhóm lỗi Nghiệp vụ (3xxx)
    static readonly NOT_FOUND_ERROR: GeneralResponseTemp = { errorCode: '3001', message: 'Bản ghi không tồn tại', code: ResponseCode.ERROR }
    static readonly NOT_FOUND: GeneralResponseTemp = { errorCode: '3001', message: 'Bản ghi không tồn tại', code: ResponseCode.ERROR }

    // Nhóm lỗi tích hợp hệ thống vệ tinh (4xxx)
    static readonly SYSTEM_INTEGRATION_ERROR: GeneralResponseTemp = { errorCode: '4000', message: 'Lỗi tích hợp hệ thống vệ tinh', code: ResponseCode.ERROR }

    // Nhóm lỗi ngoại lệ (9xxx)
    static readonly EXECEPTION_ERROR: GeneralResponseTemp = { errorCode: '9000', message: 'Lỗi ngoại lệ', code: ResponseCode.ERROR }
    static readonly INTERNAL_SERVER_ERROR: GeneralResponseTemp = { errorCode: '9000', message: 'Lỗi ngoại lệ', code: ResponseCode.ERROR }
    static readonly TIMEOUT_ERROR: GeneralResponseTemp = { errorCode: '9001', message: 'Lỗi ngoại lệ', code: ResponseCode.ERROR }
}

/**
 * Kiểu dữ liệu sinh GeneralResponse nhanh
 */
export type GeneralResponseTemp = {
    code?: ResponseCode
    errorCode: string
    message: string
}