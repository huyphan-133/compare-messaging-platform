export interface IConvertUtils {
    parse(data: any, patterns?: ConvertHandler[]): any;
}

export interface ConvertHandler {
    regex: RegExp;
    handler: (data: any) => any;
}