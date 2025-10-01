import { FormField, IOption } from 'src/common-module/dto/form/form-field.dto';
import { StringUtils } from '../convert/string.utils';
import * as _ from 'lodash';
import { GeneralResponse, GeneralResponseErrorDetail, GeneralResponseTemp, ResponseCode } from 'src/common-module/dto/general-response.dto';

export class Validator {
  static validate(constraints: FormField[], params: any): GeneralResponse {
    let errorDetail: Record<string, any> = {};
    let errFields: string[] = [];
    let nullObjectFields: string[] = [];
    let tooLongFields: string[] = [];
    let tooShortFields: string[] = [];
    let notInListFields: string[] = [];
    let patternErrorFields: string[] = [];
    let missingKeyFields: string[] = [];

    constraints.forEach((constraint: FormField) => {
      let errorCodeList: string[] = [];
      let errorMessageList: string[] = [];

      let value: any = this.modifyData(constraint, params);

      if (this.checkMissingKey(constraint, params)) {
        errorCodeList.push(ConstraintError.MISSING_KEY.errorCode);
        errorMessageList.push(ConstraintError.MISSING_KEY.message);
      }

      if (this.checkNullObject(constraint, params)) {
        errorCodeList.push(ConstraintError.NULL_OBJECT.errorCode);
        errorMessageList.push(ConstraintError.NULL_OBJECT.message);
      }

      if (this.checkTooLong(constraint, params)) {
        errorCodeList.push(ConstraintError.TOO_LONG.errorCode);
        errorMessageList.push(ConstraintError.TOO_LONG.message);
      }

      if (this.checkTooShort(constraint, params)) {
        errorCodeList.push(ConstraintError.TOO_SHORT.errorCode);
        errorMessageList.push(ConstraintError.TOO_SHORT.message);
      }

      if (this.checkPattern(constraint, params)) {
        errorCodeList.push(ConstraintError.PATTERN_ERROR.errorCode);
        errorMessageList.push(ConstraintError.PATTERN_ERROR.message);
      }

      if (this.checkLessThanMin(constraint, params)) {
        errorCodeList.push(ConstraintError.LESS_THAN_MIN.errorCode);
        errorMessageList.push(ConstraintError.LESS_THAN_MIN.message);
      }

      if (this.checkMoreThanMax(constraint, params)) {
        errorCodeList.push(ConstraintError.MORE_THAN_MAX.errorCode);
        errorMessageList.push(ConstraintError.MORE_THAN_MAX.message);
      }

      if (this.checkNotInList(constraint, params)) {
        errorCodeList.push(ConstraintError.NOT_IN_LIST.errorCode);
        errorMessageList.push(ConstraintError.NOT_IN_LIST.message);
      }

      errorDetail[constraint.code] = {
        value: value,
        errorCodeList: Array.from(new Set(errorCodeList)),
        errorMessageList: Array.from(new Set(errorMessageList)),
      };

      if (errorCodeList.length > 0) {
        errFields.push(constraint.code);
      }
      if (errorCodeList.includes(ConstraintError.NULL_OBJECT.errorCode)) {
        nullObjectFields.push(constraint.code);
      }
      if (errorCodeList.includes(ConstraintError.TOO_LONG.errorCode)) {
        tooLongFields.push(constraint.code);
      }
      if (errorCodeList.includes(ConstraintError.TOO_SHORT.errorCode)) {
        tooShortFields.push(constraint.code);
      }
      if (errorCodeList.includes(ConstraintError.NOT_IN_LIST.errorCode)) {
        notInListFields.push(constraint.code);
      }
      if (errorCodeList.includes(ConstraintError.PATTERN_ERROR.errorCode)) {
        patternErrorFields.push(constraint.code);
      }
      if (errorCodeList.includes(ConstraintError.MISSING_KEY.errorCode)) {
        missingKeyFields.push(constraint.code);
      }
    });

    let generalResponse: GeneralResponse = GeneralResponse.getInstance(GeneralResponseErrorDetail.PARAMS_VALIDATION_ERROR)
    generalResponse.code = errFields.length > 0 ? ResponseCode.ERROR : ResponseCode.SUCCESS
    generalResponse.value = {
      errorDetail: errorDetail,
      errFields: errFields,
      nullObjectFields: nullObjectFields,
      missingKeyFields: missingKeyFields,
      tooLongFields: tooLongFields,
      tooShortFields: tooShortFields,
      notInListFields: notInListFields,
      patternErrorFields: patternErrorFields,
    };

    return generalResponse;
  }

  /**
   * Modify data trước khi validate
   * @param constraint 
   * @param params 
   * @returns 
   */
  private static modifyData(constraint: FormField, params: any): any {
    let value: any = params[constraint.code];
    if (!value) return value

    if (constraint.trim && _.isString(value)) {
      value = value?.trim();
    }
    if (value !== null && value !== undefined && constraint.removeAccent) {
      value = StringUtils.normalizeName(value);
    }
    params[constraint.code] = value
    return value
  }

  /**
   * Kiểm tra lỗi thiếu MISSING_KEY
   * @param constraint 
   * @param params 
   * @returns 
   */
  private static checkMissingKey(constraint: FormField, params: any): boolean {
    return !(constraint.code in params) && constraint.required
  }

  /**
   * Kiểm tra lỗi NULL_OBJECT
   * @param constraint 
   * @param params 
   * @returns 
   */
  private static checkNullObject(constraint: FormField, params: any): boolean {
    let __value: any = params[constraint.code]
    return constraint.required
      && _.isEmpty(__value)
      && !_.isBoolean(__value)
  }

  /**
   * Kiểm tra lỗi TOO_LONG
   * @param constraint 
   * @param params 
   * @returns 
   */
  private static checkTooLong(constraint: FormField, params: any): boolean {
    if (constraint.maxLength >= 0) {
      let value: any = params[constraint.code];
      if (_.isString(value)) {
        return value.length > constraint.maxLength
      } else if (_.isArrayLike(value)) {
        return value.length > constraint.maxLength
      } else if (_.isObjectLike(value)) {
        return Object.keys(value).length > constraint.maxLength
      }
    }
    return false
  }

  /**
   * Kiểm tra lỗi TOO_LONG
   * @param constraint 
   * @param params 
   * @returns 
   */
  private static checkTooShort(constraint: FormField, params: any): boolean {
    if (constraint.minLength >= 0) {
      let value: any = params[constraint.code];
      if (_.isString(value)) {
        return value.length < constraint.minLength
      } else if (_.isArrayLike(value)) {
        return value.length < constraint.minLength
      } else if (_.isObjectLike(value)) {
        return Object.keys(value).length < constraint.minLength
      }
    }
    return false
  }

  private static checkPattern(constraint: FormField, params: any): boolean {
    if (constraint.pattern) {
      let value: any = params[constraint.code];
      value = value?.toString();
      const pattern = _.isRegExp(constraint.pattern) ? constraint.pattern : new RegExp(constraint.pattern);
      return value === null || value === undefined || !pattern.test(value)
    }
    return false
  }

  private static checkLessThanMin(constraint: FormField, params: any): boolean {
    if (!isNaN(constraint.min)) {
      try {
        let value: any = params[constraint.code];
        value = parseFloat(value?.toString());
        return value < constraint.min
      } catch (ignored) {
        return true
      }
    }
    return false
  }

  private static checkMoreThanMax(constraint: FormField, params: any): boolean {
    let value: any = params[constraint.code];
    if (!isNaN(constraint.max) && value) {
      try {
        value = parseFloat(value?.toString());
        return value > constraint.max
      } catch (ignored) {
        return true
      }
    }
    return false
  }

  private static checkNotInList(constraint: FormField, params: any): boolean {
    if (constraint.options?.length > 0) {
      let value: any = params[constraint.code];
      let __values: any[] = constraint.options.map((item: IOption) => { return item.value })
      return !__values.includes(value)
    }
    return false
  }
}

export class ConstraintError {
  static readonly NULL_OBJECT: GeneralResponseTemp = { errorCode: "ERR001", message: "NULL_OBJECT" };
  static readonly TOO_LONG: GeneralResponseTemp = { errorCode: "ERR002", message: "TOO_LONG" };
  static readonly LESS_THAN_MIN: GeneralResponseTemp = { errorCode: "ERR003", message: "LESS_THAN_MIN" };
  static readonly MORE_THAN_MAX: GeneralResponseTemp = { errorCode: "ERR004", message: "MORE_THAN_MAX" };
  static readonly NOT_IN_LIST: GeneralResponseTemp = { errorCode: "ERR005", message: "NOT_IN_LIST" };
  static readonly PATTERN_ERROR: GeneralResponseTemp = { errorCode: "ERR006", message: "PATTERN_ERROR" };
  static readonly MISSING_KEY: GeneralResponseTemp = { errorCode: "ERR007", message: "MISSING_KEY" };
  static readonly TOO_SHORT: GeneralResponseTemp = { errorCode: "ERR008", message: "TOO_SHORT" };
  static readonly FORMAT_ERROR: GeneralResponseTemp = { errorCode: "ERR998", message: "FORMAT_ERROR" };
  static readonly ERR999: GeneralResponseTemp = { errorCode: "ERR999", message: "OTHER_ERROR" };
}

