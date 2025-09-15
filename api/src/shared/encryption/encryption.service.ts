import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CustomLoggerService } from '../logger/logger.service';

const SALTROUNDS = 10;

@Injectable()
export class EncryptionService {
  constructor(private loggerService: CustomLoggerService) {}

  // convert plain password to hashed
  async encrypt(plain_password: string): Promise<string | boolean> {
    try {
      return await bcrypt.hash(plain_password, SALTROUNDS);
    } catch (err) {
      this.loggerService.log(`password encryption failed`, {
        functionName: 'encrypt',
        errorCode: '#500',
        logType: 'error',
      });

      return false;
    }
  }

  // compare and reture true or false with hashed password and plain password
  async compare(plain_password: string, hashed: string): Promise<boolean> {
    try {
      return bcrypt.compareSync(plain_password, hashed);
    } catch (err) {
      this.loggerService.log(`password compare failed`, {
        functionName: 'compare',
        errorCode: '#500',
        logType: 'error',
      });

      return false;
    }
  }
}
