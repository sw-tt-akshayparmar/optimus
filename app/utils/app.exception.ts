// AppException.ts

export class AppException extends Error {
  public readonly errorCode: string;
  public readonly statusCode: number;
  public readonly data?: any;
  public readonly timestamp: string;

  constructor({
    errorCode,
    message,
    statusCode = 500,
    data,
  }: {
    errorCode: string;
    message: string;
    statusCode?: number;
    data?: any;
  }) {
    super(message);

    this.name = this.constructor.name;

    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.data = data;
    this.timestamp = new Date().toISOString();

    // Maintains proper stack trace (only in V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      error: this.name,
      message: this.message,
      errorCode: this.errorCode,
      statusCode: this.statusCode,
      data: this.data,
      timestamp: this.timestamp,
    };
  }
}
