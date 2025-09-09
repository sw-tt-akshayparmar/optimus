import ErrorCode from "~/enums/error.enum";

export class Exception extends Error {
  public readonly code: ErrorCode;
  public readonly data: any;

  constructor(code: ErrorCode, message?: string, data?: any) {
    super(message || "Something went wrong");
    this.name = "Exception";
    this.code = code;
    this.data = data;
    Object.setPrototypeOf(this, Exception.prototype);
  }
}
