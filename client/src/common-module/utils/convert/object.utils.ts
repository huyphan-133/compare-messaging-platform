import * as _ from "lodash"

export class ObjectUtils {

    /**
     * Flat member trong props của object
     * @param item 
     * @param key 
     * @returns 
     */
    static flatObject(item: any, key: string = 'props') {
        let __item = _.cloneDeep(item)
        if (__item[key]) {
            _.assign(__item, __item[key])
            delete __item[key]
        }
        return __item
    }

    /**
     * Tự động tạo Object theo key truyền vào
     * @param obj 
     * @param key vd: key1.key2.key3 hoặc key1>key2>key3
     * @param value 
     */
    static setKey(obj: any, key: string, value: any) {
        let __keys = key.split(/[\.\>]/g)
        if (__keys.length < 2) {
            obj[__keys[0]] = value
        } else {
            let __key = __keys.shift()
            obj[__key] = {}
            ObjectUtils.setKey(obj[__key], __keys.join('.'), value)
        }
    }

    /**
     * Lấy giá trị theo key truyền vào
     * @param obj 
     * @param key vd: key1.key2.key3 hoặc key1>key2>key3
     * @param value 
     */
    static getKey(obj: any, key: string): any {
        if (obj === undefined || obj === null) return undefined
        let value: any;
        let __keys = key.split(/[\.\>]/g)
        if (__keys.length < 2) {
            value = obj[__keys[0]]
        } else {
            let __key = __keys.shift()
            value = ObjectUtils.getKey(obj[__key], __keys.join('.'))
        }
        return value
    }

    /**
     * Gộp các record có cùng giá trị key
     * @param key 
     * @param data 
     * @returns 
     */
    static mergeDataByKey(key: string, data: any[], options?: { labelKey: string, valueKey: string }) {
        let __data: any = {}
        data.forEach((item) => {
            const __key = item[key].toString()
            if (!__data[__key]) {
                __data[__key] = {}
                __data[__key][key] = item[key]
            }
            if (options) {
                __data[__key][item[options.labelKey]] = item[options.valueKey]
            } else {
                _.assign(__data[__key], item)
            }
        })
        return Object.values(__data)
    }

    /**
     * 
     * @param value 
     * @returns 
     */
    static async serializeObject(value: any): Promise<any> {
        let __value: string = JSON.stringify(value)
        __value = `{${value?.constructor?.name}}${__value}`
        return __value
    }

    /**
     * 
     * @param value 
     * @returns 
     */
    static async deSerializeObject<T>(value: string, planToObject?: (value: any) => Promise<T>): Promise<T> {
        let __value: any = value
        let __regex: RegExp = new RegExp(/^\{(\w+)\}(.*)/g)
        let __match = [...__regex.exec(value)]
        if (__match.length > 0) {
            let type = __match[1]
            __value = JSON.parse(__match[2])

            if (planToObject) {
                __value = await planToObject(__value)
            } else if (['Date'].includes(type)) {
                __value = new Date(__value)
            }
        }
        return __value
    }
}