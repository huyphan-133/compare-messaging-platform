import { Body, Delete, Get, HttpStatus, Param, Post, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { FormField } from 'src/common-module/dto/form/form-field.dto';
import { BaseEntityService } from 'src/common-module/service/base-entity/base-entity.service';
import { GeneralResponse, GeneralResponseErrorDetail, ResponseCode } from 'src/common-module/dto/general-response.dto';
import { Validator } from 'src/common-module/utils/validator/validator';
import { UserDetail } from 'src/common-module/dto/user/user.dto';
import { DataTableFilter } from 'src/common-module/dto/data-table-filter.dto';
import { DataTableResponse } from 'src/common-module/dto/data-table-response.dto';

export abstract class BaseEntityController {
    /**
     * Các field không trả về qua API
     */
    __getExcludeKeys: string[] = ['createdBy', 'updatedBy', 'updatedAt', 'deleted', 'deletedAt', 'deletedBy', 'log', 'fieldsToSign', 'sign',]

    /**
     * Các field không thể cập nhật bằng API
     */
    __updateExcludeFields: string[] = ['id', 'uuid', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'deleted', 'deletedAt', 'deletedBy', 'version', 'log', 'fieldsToSign', 'sign',]
    /**
     * Ràng buộc khi update object
     */
    __updateDtoContraints: FormField[] = []

    /**
     * Các field không thể cập nhật khi thêm mới bằng API
     */
    __createExcludeFields: string[] = ['id', 'uuid', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'deleted', 'deletedAt', 'deletedBy', 'version', 'log', 'fieldsToSign', 'sign',]

    /**
     * Ràng buộc khi create object
     */
    __createDtoContraints: FormField[] = []

    constructor(public entityService: BaseEntityService) {
    }

    @Get()
    async index(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<any> {
        try {
            let items: any[] = await this.entityService.list()
            let __items = items.map((item: any) => {
                return this.entityService.modifyData(item, this.__getExcludeKeys)
            })
            return __items
        } catch (e) {
            let generalResponse = GeneralResponse.getInstance(GeneralResponseErrorDetail.INTERNAL_SERVER_ERROR, { message: e.message })
            res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            return generalResponse
        }
    }

    @Get('/:id(\\d+)')
    async get(@Param('id') id: number, @Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<any> {
        try {
            let item: any = await this.entityService.get(id)
            let __item: any
            if (item) {
                __item = this.entityService.modifyData(item, this.__getExcludeKeys)
                return __item
            }
            res.status(HttpStatus.NOT_FOUND)
            return GeneralResponse.getInstance(GeneralResponseErrorDetail.NOT_FOUND_ERROR)
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            return GeneralResponse.getInstance(GeneralResponseErrorDetail.INTERNAL_SERVER_ERROR, { message: e.message })
        }
    }

    /**
     * Call trước khi thực hiện save data
     * @param item 
     */
    async onBeforeSave(item: any): Promise<GeneralResponse> {
        let __gr: GeneralResponse = Validator.validate(this.__createDtoContraints, item)
        return Promise.resolve(__gr)
    }

    /**
     * Call sau khi api save xử lý xong
     */
    onAfterSave(item?: any) { }

    @Post()
    async save(@Body() body: any, @Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<GeneralResponse> {
        body = this.entityService.modifyData(body, this.__createExcludeFields)
        let __userDetail: UserDetail = req['userDetail']
        if (__userDetail) {
            body['createdBy'] = __userDetail?.username
        }

        let __gr = await this.onBeforeSave(body)
        if (__gr.code !== ResponseCode.SUCCESS) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            return __gr
        }

        try {
            let item = await this.entityService.save(body)
            if (item == null) {
                res.status(HttpStatus.NOT_FOUND)
                return GeneralResponse.getInstance(GeneralResponseErrorDetail.NOT_FOUND_ERROR)
            }
            this.onAfterSave(item);
            return this.entityService.modifyData(item, this.__getExcludeKeys)
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            return GeneralResponse.getInstance(GeneralResponseErrorDetail.INTERNAL_SERVER_ERROR, { message: e.message })
        }
    }

    /**
     * Call trước khi thực hiện update data
     * @param item 
     */
    async onBeforeUpdate(item: any): Promise<GeneralResponse> {
        let __gr: GeneralResponse = Validator.validate(this.__updateDtoContraints, item)
        return Promise.resolve(__gr)
    }
    /**
     * Call sau khi api update xử lý xong
     */
    onAfterUpdate() { }

    @Put('/:id(\\d+)')
    async update(@Param('id') id: number, @Body() body: any, @Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<any> {
        body = this.entityService.modifyData(body, this.__updateExcludeFields)
        let __userDetail: UserDetail = req['userDetail']
        if (__userDetail) {
            body['updatedBy'] = __userDetail?.username
        }

        let __gr = await this.onBeforeUpdate(body)
        if (__gr.code !== ResponseCode.SUCCESS) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            return __gr
        }

        try {
            let item: any = await this.entityService.update(id, body)
            if (!item) {
                res.status(HttpStatus.NOT_FOUND)
                return GeneralResponse.getInstance(GeneralResponseErrorDetail.NOT_FOUND_ERROR)
            }
            this.onAfterUpdate()
            return this.entityService.modifyData(item, this.__getExcludeKeys)
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            return GeneralResponse.getInstance(GeneralResponseErrorDetail.INTERNAL_SERVER_ERROR, { message: e.message })
        }
    }

    /**
     * Call sau khi api delete xử lý xong
     */
    onAfterDelete() { }

    @Delete('/:id(\\d+)')
    async delete(@Param('id') id: number, @Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<any> {
        try {
            let item: any = await this.entityService.delete(id)
            if (!item) {
                res.status(HttpStatus.NOT_FOUND)
                return GeneralResponse.getInstance(GeneralResponseErrorDetail.NOT_FOUND_ERROR)
            }
            this.onAfterDelete();
            return this.entityService.modifyData(item, this.__getExcludeKeys)
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            return GeneralResponse.getInstance(GeneralResponseErrorDetail.INTERNAL_SERVER_ERROR, { message: e.message })
        }
    }

    @Get(['/load-data-table', '/loadDataTable'])
    async loadDataTable(@Req() request: Request, @Res({ passthrough: true }) res: Response): Promise<any> {
        if (request.query.filters) {
            request.query.filters = JSON.parse(request.query.filters.toString())
        }
        let dataTableFilter = plainToClass(DataTableFilter, request.query, {
            enableImplicitConversion: true,
        })

        let loadDataTableMethod: Promise<[any[], number]>
        if (request.query['mt'] === 'qb') {
            loadDataTableMethod = this.entityService.loadDataTableUsingQueryBuilder(dataTableFilter)
        } else {
            loadDataTableMethod = this.entityService.loadDataTable(dataTableFilter)
        }
        try {
            let data: any = await loadDataTableMethod
            let dataTableResponse = new DataTableResponse()
            dataTableResponse.first = dataTableFilter.first;
            dataTableResponse.rows = dataTableFilter.rows;
            dataTableResponse.items = data[0].map((item: any) => {
                return this.entityService.modifyData(item, this.__getExcludeKeys);
            });
            dataTableResponse.totalRows = data[1];
            return dataTableResponse;
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            return GeneralResponse.getInstance(GeneralResponseErrorDetail.EXECEPTION_ERROR, { message: e.message });
        }
    }

    @Get('/:id(\\d+)/check-sign')
    async checkSign(@Param('id') id: number, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        let item: any = await this.entityService.get(id)
        return item?.isValidSign()
    }
}
