export class StringUtils {
    /**
     * Xóa dấu
     */
    static normalizeName(name: string) {
        name = name || ''
        return name.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
    }

    static encodeURISpecialChar(content: string) {
        let __encodedContent: string;
        let __needEncode: boolean = false;
        for (let idx = 0; idx < content.length; idx++) {
            if (content.charCodeAt(idx) > 0x1EF9) {
                __needEncode = true;
                break;
            }
        }
        __encodedContent = __needEncode ? encodeURIComponent(content) : content;
        return __encodedContent;
    }

    static decodeURISpecialChar(content: string) {
        try {
            return decodeURIComponent(content);
        } catch (ex) {
            return content;
        }
    }
}