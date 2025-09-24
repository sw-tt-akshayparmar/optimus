import ErrorCode from '../enums/error.enum';

export class Exception<Data = any> extends Error {
  public readonly code: ErrorCode;
  public readonly data?: Data;

  constructor(code: ErrorCode, message?: string, data?: Data) {
    super(message || 'Something went wrong');
    this.name = 'Exception';
    this.code = code;
    this.data = data;
    Object.setPrototypeOf(this, Exception.prototype);
  }
}
