import ErrorCode from '../enums/error.enum';

export interface SuccessResponse<Data = any> {
  isSuccessFull: true;
  status: number;
  success: string;
  data: Data;
}

interface ErrorDescription {
  message: string;
  stack: string[];
}

export interface ErrorResponse<Data = any> {
  isSuccessFull: false;
  status: number;
  error: string;
  description: ErrorDescription;
  trace: string[];
  data?: Data;
  code: ErrorCode;
}
