export abstract class UserCreateDto {
    username: string;
    password: string;
}

export class UserDetail {
    src?: string;
    username: 'anonymousUser' | string;
    authorities?: string[] = [];
    payload?: any;
    /**
     * Thời gian hiệu lực của object
     */
    exp?: number;
    /**
     * Thời gian khởi tạo
     */
    iat?: number;
}