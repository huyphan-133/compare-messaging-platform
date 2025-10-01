export const FieldsToSign = (...fields: string[]): ClassDecorator => {
    return (target: Function) => {
        Reflect.defineMetadata('fields-to-sign', fields, target.prototype);
    }
}