export interface SuccessResponse {
  isSuccessFull: true;
  status: number;
  success: string;
  data: any;
}
interface ErrorDescription {
  message: string;
  stack: string[];
}

export interface ErrorResponse {
  isSuccessFull: false;
  status: number;
  error: string;
  description: ErrorDescription;
  trace: string[];
  data?: any;
}
