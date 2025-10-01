import * as moment from "moment";
import { ConvertHandler, IConvertUtils } from "./i-convert.utils";

export class DateTimeConvert implements IConvertUtils {
    static patterns: ConvertHandler[] = [
        {
            regex: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/g,
            handler: (data) => {
                let __value: Date = moment(Date.parse(data)).toDate();
                return __value;
            }
        }, {
            regex: /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})[ +]{1}(\d{2}):(\d{2})$/g,
            handler: (data) => {
                let regex: RegExp = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})[ +]{1}(\d{2}):(\d{2})$/g;
                let __data = data.replace(regex, '$1-$2-$3T$4:$5:$6+$7:$8');
                let __value: Date = moment(Date.parse(__data)).toDate();
                return __value;
            }
        }, {
            regex: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}[ +]{1}\d{2}:\d{2}$/g,
            handler: (data) => {
                let __value: Date = moment(Date.parse(data)).toDate();
                return __value;
            }
        }, {
            regex: /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).\d{3}[ +]{1}(\d{2})(\d{2})$/g,
            handler: (data: string) => {
                let regex: RegExp = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).\d{3}[ +]{1}(\d{2})(\d{2})$/g;
                let __data = data.replace(regex, '$1-$2-$3T$4:$5:$6+$7:$8');
                let __value: Date = moment(Date.parse(__data)).toDate();
                return __value;
            }
        }, {
            regex: /^(\d)+$/g,
            handler: (data: string) => {
                let __value: Date = new Date(parseInt(data) * 1000);
                return __value;
            }
        }
    ]

    parse(data: any, patterns?: ConvertHandler[]) {
        patterns = patterns || DateTimeConvert.patterns
        let __value: Date;
        for (let idx = 0; idx < patterns.length; idx++) {
            let __regex: RegExp = patterns.at(idx).regex
            if (__regex.test(data)) {
                __value = patterns.at(idx).handler(data)
            }
            __regex.lastIndex = 0
        }
        return __value;
    }
}
