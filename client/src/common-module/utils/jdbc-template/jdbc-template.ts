import { DataSource, QueryRunner } from "typeorm"

export class JDBCTemplate {
    /**
     * Thực thi raw query
     * 
     * Trường hợp truy vấn sử dụng con trỏ thì để useQueryRunner = true (oracle)
     * @param params 
     * @returns 
     */
    static query(params: { dataSource: DataSource, sqlCommand: string, params: any, queryRunner?: QueryRunner, useQueryRunner?: boolean }): Promise<any> {
        let __paramRegex = new RegExp(/:([\w_]+)/g);
        let __match = [...params.sqlCommand.matchAll(__paramRegex)];

        let __params = [];
        __match.forEach((item, idx) => {
            __params.push(params.params[item[1]]);
        })

        let __sqlCmd: string = params.sqlCommand;
        if (params.dataSource.options.type === 'mysql') {
            __sqlCmd = params.sqlCommand.replace(__paramRegex, '?');
        }

        if (params.useQueryRunner === true) {
            let qr: QueryRunner = params.dataSource.createQueryRunner();
            return params.dataSource.query(__sqlCmd, __params, qr);
        } else if (params.queryRunner) {
            return params.dataSource.query(__sqlCmd, __params, params.queryRunner);
        } else {
            return params.dataSource.query(__sqlCmd, __params);
        }
    }
}