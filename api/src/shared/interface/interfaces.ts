import { IsNotEmpty } from 'class-validator';

export interface ILoggerOptions {
  functionName: string; // from which function the error started
  errorCode: '#500' | '#400' | '#200'; // severity of the error based on code
  logType: 'log' | 'error' | 'warn' | 'fatal';
}

export interface ICommonResponse<TData> {
  success: 0 | 1;
  data?: TData;
  message: string;
}
