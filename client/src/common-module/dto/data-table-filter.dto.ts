import { IsInt, IsString } from "class-validator"

export class DataTableFilter {
    @IsInt()
    first?: number = 0;

    @IsInt()
    rows?: number = 10;

    filters?: Record<string, Filter>;

    @IsString()
    sortField?: string;

    @IsInt()
    sortOrder?: SortOrder;
}

export interface Filter {
    code?: string;
    matchMode: 'equals' | 'not' | 'contains' | 'startsWith' | 'endsWith' | 'inList' | 'notInList' | 'greaterThan' | 'greaterThanOrEquals' | 'lowersThan' | 'lowersThanOrEquals' | 'between';
    value: any;
    dataType?: 'datetime' | 'number' | 'string';
    order?: number;
}

export enum SortOrder {
    ASC = 1,
    DESC = -1
}