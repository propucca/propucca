import { Injectable, LoggerService } from '@nestjs/common';

import { ILoggerOptions } from '../interface/interfaces';

@Injectable()
export class CustomLoggerService implements LoggerService {
  log(message: string, optionalParams: ILoggerOptions): void {
    // console.log(`${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()} - ${message}` )
    console.log(
      `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
      optionalParams.logType,
      optionalParams?.errorCode,
      optionalParams.functionName,
      message,
    );
  }

  fatal(message: any, ...optionalParams: any[]) {
    console.log(message);
  }

  error(message: any, ...optionalParams: any[]) {
    console.log(message);
  }

  warn(message: any, ...optionalParams: any[]) {
    console.log(message);
  }

  debug?(message: any, ...optionalParams: any[]) {
    console.log(message);
  }

  verbose?(message: any, ...optionalParams: any[]) {
    console.log(message);
  }
}
