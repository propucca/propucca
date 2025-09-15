import { Injectable } from '@nestjs/common';

import { ILoginDto } from './dto/auth-controller.dto';

import { ResponseMessage } from '@/constants/constants';
import { CustomLoggerService } from '@/logger/logger.service';
import { JwtSign } from '@/jwttoken/jwttoken.service';
import { ICommonResponse } from '@/interface/interfaces';
import { ORMService } from '@/database/orm/orm.service';
import { User } from '@/database/orm/orm.schema';

@Injectable()
export class AuthControllerService {
  constructor(
    private logger: CustomLoggerService,
    private orm: ORMService,
  ) {}

  async login(request: ILoginDto): Promise<ICommonResponse<any>> {
    try {
      const user = await this.orm.findOne(
        { username: request.username },
        User,
        [],
        [],
        [],
      );

      if (user === false) {
        this.logger.log('User fetch failed', {
          errorCode: '#400',
          functionName: 'auth/login',
          logType: 'error',
        });

        return {
          success: 0,
          message: ResponseMessage.unknown,
        };
      }

      var userData = user !== null ? user.dataValues : {};
      if (user === null) {
        const insert = await this.orm.create(request, User);

        if (insert === false) {
          this.logger.log('User insert failed', {
            errorCode: '#400',
            functionName: 'auth/login',
            logType: 'error',
          });

          return {
            success: 0,
            message: ResponseMessage.unknown,
          };
        }

        userData = insert.dataValues;
      }

      const token = await JwtSign(userData);

      return {
        success: 1,
        message: 'Login Successful!',
        data: { token, user: userData },
      };
    } catch (err: any) {
      this.logger.log(err.message, {
        functionName: 'login',
        errorCode: '#500',
        logType: 'error',
      });
      return {
        success: 0,
        message: ResponseMessage.unknown,
      };
    }
  }
}
