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
}