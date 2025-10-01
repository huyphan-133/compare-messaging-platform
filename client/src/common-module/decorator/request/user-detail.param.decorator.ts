import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { UserDetail } from "src/common-module/dto/user/user.dto";

export const UserDetailParam = createParamDecorator((data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    let userDetail: UserDetail = request['userDetail'];
    return data ? userDetail?.[data] : userDetail;
})