import { ResponseCode } from "./general-response.dto";

export class DataTableResponse {
    code: ResponseCode | 0 | -1 = ResponseCode.SUCCESS;
    transactionTime: number = new Date().getTime();

    errorCode?: string;
    category?: string;
    subCategory?: string;
    message?: string;
    messageDetail?: string;

    totalRows: number = 0;
    rows: number = 0;
    first: number = 0;
    items: any[] = [];
}