import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from "express";
import { GeneralResponse, GeneralResponseErrorDetail, ResponseCode } from "../dto/general-response.dto";

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (response.writableFinished) return;

        let generalResponse = GeneralResponse.getInstance(GeneralResponseErrorDetail.INTERNAL_SERVER_ERROR, { message: exception.message })
        response.status(exception['status'] || 500).send(generalResponse);
    }
}