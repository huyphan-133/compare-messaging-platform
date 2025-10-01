import { Between, FindOptionsRelations, In, Like, Not, Repository, SelectQueryBuilder } from 'typeorm';
import * as _ from "lodash";
import { plainToInstance } from 'class-transformer';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';
import { UserDetail } from 'src/common-module/dto/user/user.dto';
import { DataTableFilter, Filter, SortOrder } from 'src/common-module/dto/data-table-filter.dto';
import { IConvertUtils } from 'src/common-module/utils/convert/i-convert.utils';
import { DateTimeConvert } from 'src/common-module/utils/convert/datetime-convert.utils';
import { ObjectUtils } from 'src/common-module/utils/convert/object.utils';

export class BaseEntityService {
    constructor(public entityRepository: Repository<any>) { }

    /**
     * Lấy danh sách all record
     * @returns 
     */
    list(): Promise<any[]> {
        return this.entityRepository.find();
    }

    /**
     * Lấy 1 record theo PK
     * @param id 
     * @returns 
     */
    get<T>(id: any, options: { relations?: FindOptionsRelations<T> } = {}): Promise<T> {
        return this.entityRepository.findOne({ where: { id: id }, relations: options.relations })
    }

    /**
     * Thêm record
     * @param item 
     * @returns 
     */
    save(item: any): Promise<any> {
        let __clazz: any = this.entityRepository.target
        let __item = plainToInstance(__clazz, item)
        Object.keys(item).forEach((key) => {
            __item[key] = item[key]
        })
        return this.entityRepository.save(__item);
    }

    /**
     * Cập nhật 1 record theo PK
     * @param id 
     * @param item 
     * @returns 
     */
    async update(id: any, item: any, params?: { userDetail?: UserDetail }): Promise<any> {
        let __item: any = await this.entityRepository.findOne({ where: { id: id } })
        if (!__item) {
            return null
        }
        _.assign(__item, item)
        let value: any = await this.entityRepository.save(__item)
        return value
    }

    /**
     * Xóa 1 record theo PK
     * @param id 
     * @returns 
     */
    async delete(id: any): Promise<any> {
        let item = await this.entityRepository.findOne({ where: { id: id } })
        if (!item) {
            return null
        }

        await this.entityRepository.remove(item);
        item.id = id;
        return item
    }

    /**
     * Trả danh sách dữ liệu phân trang
     * @param dataTableFilter 
     * @param options 
     * @returns 
     */
    loadDataTable<T>(dataTableFilter: DataTableFilter, options: LoadDataTableOptions<T> = {}): Promise<[T[], number]> {
        options.mappingFields = options.mappingFields || {}

        dataTableFilter.first = dataTableFilter.first || 0
        dataTableFilter.rows = dataTableFilter.rows || 10
        dataTableFilter.filters = dataTableFilter.filters || {}
        if (!dataTableFilter.sortField || dataTableFilter.sortField === 'undefined') {
            dataTableFilter.sortField = 'id'
        }
        if (!dataTableFilter.sortOrder) {
            dataTableFilter.sortOrder = SortOrder.DESC
        }

        let columns: ColumnMetadata[] = this.entityRepository.metadata.columns

        let __queryClause: any = {}
        let __filters: Filter[] = this.__orderFilter(dataTableFilter.filters)
        __filters.forEach((__filter) => {
            let key = __filter.code;
            key = options.mappingFields[key] || key;

            let column: ColumnMetadata = columns.find((c: ColumnMetadata) => {
                return key === c.propertyName || key.startsWith(`${c.propertyName}.`)
            })

            if (_.isEmpty(__filter.dataType)) __filter.dataType = 'string';

            let convertUtils: IConvertUtils

            switch (__filter.matchMode) {
                case "equals":
                    this.__setKey(__queryClause, key, __filter.value)
                    break;
                case "not":
                    this.__setKey(__queryClause, key, Not(__filter.value))
                    break;
                case "contains":
                    if (column?.type === 'json') {
                        __queryClause[key] = Like(`%${__filter.value}%`)
                    } else {
                        this.__setKey(__queryClause, key, Like(`%${__filter.value}%`))
                    }
                    break;
                case "startsWith":
                    this.__setKey(__queryClause, key, Like(`${__filter.value}%`));
                    break;
                case "endsWith":
                    this.__setKey(__queryClause, key, Like(`%${__filter.value}`));
                    break;
                case "inList":
                    /**
                     * Trường hợp là string thì cần chuyển về Array
                     */
                    if (_.isString(__filter.value)) {
                        __filter.value = JSON.parse(__filter.value);
                    }
                    this.__setKey(__queryClause, key, In(__filter.value));
                    break
                case "notInList":
                    /**
                     * Trường hợp là string thì cần chuyển về Array
                     */
                    if (_.isString(__filter.value)) {
                        __filter.value = JSON.parse(__filter.value);
                    }
                    this.__setKey(__queryClause, key, Not(In(__filter.value)));
                    break
                case "greaterThan":
                case "greaterThanOrEquals":
                case "lowersThan":
                case "lowersThanOrEquals":
                case "between":
                    switch (__filter.dataType) {
                        case 'string':
                        case 'number':
                        case 'datetime':
                            convertUtils = new DateTimeConvert()
                            __filter.value = [
                                convertUtils.parse(__filter.value[0]),
                                convertUtils.parse(__filter.value[1])
                            ]
                            break;
                    }
                    this.__setKey(__queryClause, key, Between(__filter.value[0], __filter.value[1]));
                    break;
            }
        })
        let __orders: any = {}
        __orders[dataTableFilter.sortField] = dataTableFilter.sortOrder === SortOrder.DESC ? 'DESC' : 'ASC'

        return this.entityRepository.findAndCount({
            where: __queryClause,
            skip: dataTableFilter.first,
            take: dataTableFilter.rows,
            order: __orders,
            relations: options.relations
        });
    }

    /**
     * 20230310: Chưa chạy
     * @param dataTableFilter 
     * @param options 
     * @returns 
     */
    loadDataTableUsingQueryBuilder<T>(dataTableFilter: DataTableFilter, options: LoadDataTableOptions<T> = {}): Promise<[T[], number]> {
        options.mappingFields = options.mappingFields || {}

        dataTableFilter.first = dataTableFilter.first || 0
        dataTableFilter.rows = dataTableFilter.rows || 10
        dataTableFilter.filters = dataTableFilter.filters || {}
        if (!dataTableFilter.sortField || dataTableFilter.sortField === 'undefined') {
            dataTableFilter.sortField = 'id'
        }
        if (!dataTableFilter.sortOrder) {
            dataTableFilter.sortOrder = SortOrder.DESC
        }

        let columns: ColumnMetadata[] = this.entityRepository.metadata.columns
        let __whereClause: string[] = []
        let __whereParams: any = {}

        let __filters: Filter[] = this.__orderFilter(dataTableFilter.filters)
        __filters.forEach((__filter) => {
            let key = __filter.code;
            key = options.mappingFields[key] || key;

            let column: ColumnMetadata = columns.find((c: ColumnMetadata) => {
                return key === c.propertyName || key.startsWith(`${c.propertyName}.`)
            })

            if (_.isEmpty(__filter.dataType)) __filter.dataType = 'string';

            let convertUtils: IConvertUtils

            let __leftOp: string;
            if (!column) {
                let relation: RelationMetadata = this.entityRepository.metadata.relations.find((r: RelationMetadata) => {
                    return key.startsWith(`${r.propertyName}.`)
                })
                console.log(relation.propertyPath)
            } else if (column.type === 'json') {
                __leftOp = `JSON_EXTRACT(${this.entityRepository.metadata.name}.${column.propertyName}, "$${key.substring(column.propertyName.length, key.length)}")`
            } else {
                __leftOp = `${this.entityRepository.metadata.name}.${key}`
            }

            if (!__leftOp) return

            switch (__filter.matchMode) {
                case "equals":
                    __whereClause.push(`${__leftOp}=:${key}`)
                    __whereParams[key] = __filter.value
                    break;
                case "not":
                    __whereClause.push(`${__leftOp} <> :${key}`)
                    __whereParams[key] = __filter.value
                    break;
                case "contains":
                    __whereClause.push(`${__leftOp} LIKE :${key}`)
                    __whereParams[key] = `%${__filter.value}%`
                    break;
                case "startsWith":
                    __whereClause.push(`${__leftOp} LIKE :${key}`)
                    __whereParams[key] = `${__filter.value}%`
                    break;
                case "endsWith":
                    __whereClause.push(`${__leftOp} IN :${key}`)
                    __whereParams[key] = `%${__filter.value}`
                    break;
                case "inList":
                    /**
                     * Trường hợp là string thì cần chuyển về Array
                     */
                    if (_.isString(__filter.value)) {
                        __filter.value = JSON.parse(__filter.value);
                    }
                    __whereClause.push(`${__leftOp} IN (:${key})`)
                    __whereParams[key] = __filter.value
                    break
                case "notInList":
                    /**
                     * Trường hợp là string thì cần chuyển về Array
                     */
                    if (_.isString(__filter.value)) {
                        __filter.value = JSON.parse(__filter.value);
                    }
                    __whereClause.push(`${__leftOp} NOT IN (:${key})`)
                    __whereParams[key] = __filter.value
                    break
                case "greaterThan":
                case "greaterThanOrEquals":
                case "lowersThan":
                case "lowersThanOrEquals":
                case "between":
                    switch (__filter.dataType) {
                        case 'string':
                        case 'number':
                        case 'datetime':
                            convertUtils = new DateTimeConvert()
                            __filter.value = [
                                convertUtils.parse(__filter.value[0]),
                                convertUtils.parse(__filter.value[1])
                            ]
                            break;
                    }
                    __whereClause.push(`${__leftOp} BETWEEN :${key}_From AND :${key}_To`)
                    __whereParams[`${key}_From`] = __filter.value[0]
                    __whereParams[`${key}_To`] = __filter.value[1]
                    break;
            }
        })
        let __orders: any = {}
        __orders[dataTableFilter.sortField] = dataTableFilter.sortOrder === SortOrder.DESC ? 'DESC' : 'ASC'

        let qb: SelectQueryBuilder<any> = this.entityRepository.createQueryBuilder(this.entityRepository.metadata.name)
        qb.where(__whereClause.join(' and '), __whereParams)
            .skip(dataTableFilter.first)
            .take(dataTableFilter.rows)
            .orderBy(__orders)

        return qb.getManyAndCount()
    }

    /**
     * Bỏ bớt trường dữ liệu
     * @param item 
     * @param excludeKeys 
     * @returns 
     */
    modifyData(item: any, excludeKeys: string[] = [], params?: { depthModify?: boolean }) {
        if (_.isEmpty(item)) return item
        let __item = _.cloneDeep(item)
        excludeKeys.forEach((key: any) => {
            delete __item[key]
        })
        return __item
    }

    /**
     * Flat member trong props của object
     * @param item 
     * @returns 
     */
    flatObject(item: any) {
        return ObjectUtils.flatObject(item)
    }

    /**
     * Tự động tạo Object theo key truyền vào
     * @param obj 
     * @param key pattern dạng *.*.*..., vd: key1.key2.key3
     * @param value 
     */
    __setKey(obj: any, key: string, value: any) {
        ObjectUtils.setKey(obj, key, value)
    }

    /**
     * Trả về mảng filter theo thứ tự ưu tiên
     * @param filters 
     */
    __orderFilter(filters: Record<string, Filter>): Filter[] {
        let __filters: Filter[] = [];
        Object.keys(filters).forEach((key: string) => {
            filters[key].code = key
            __filters.push(filters[key])
        })
        __filters = __filters.sort((a, b) => {
            return a.order >= b.order ? 1 : -1;
        })
        return __filters
    }
}

export type LoadDataTableOptions<T> = {
    relations?: FindOptionsRelations<T>
    /**
     * field lọc dữ liệu --> field trong entity
     */
    mappingFields?: Record<string, string>
    /**
     * các trường cần trả ra
     */
    fields?: string[]
    /**
     * Thông tin user
     */
    userDetail?: UserDetail
}
