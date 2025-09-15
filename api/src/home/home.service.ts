import { Injectable } from '@nestjs/common';

import { CustomLoggerService } from '@/logger/logger.service';
import { ResponseMessage } from '@/constants/constants';
import { IBlogGetById } from './dto/home.controller.dto';
import { Post, User } from '@/database/orm/orm.schema';
import { ORMService } from '@/database/orm/orm.service';

@Injectable()
export class HomeService {
  constructor(
    private readonly logger: CustomLoggerService,
    private readonly orm: ORMService,
  ) {}

  async getAll(): Promise<object> {
    try {
      const data = await this.orm.findAll(
        {},
        Post,
        ['modified_on', 'DESC'],
        [User],
        ['content'],
      );

      if (data === false) {
        this.logger.log('Data not found', {
          errorCode: '#400',
          functionName: 'post/getAll',
          logType: 'error',
        });

        return {
          success: 0,
          message: ResponseMessage.unknown,
        };
      }

      return {
        success: 1,
        data: data,
      };
    } catch (err) {
      this.logger.log(err.message, {
        functionName: 'home/getAll',
        errorCode: '#500',
        logType: 'error',
      });

      return {
        success: 0,
        message: ResponseMessage.unknown,
      };
    }
  }

  async getById(request: IBlogGetById): Promise<object> {
    try {
      const data = await this.orm.findOne(
        { is_active: true, id: request.id },
        Post,
        [],
        [User],
        [],
      );

      if (data === false) {
        this.logger.log('Data not found', {
          errorCode: '#400',
          functionName: 'post/getById',
          logType: 'error',
        });

        return {
          success: 0,
          message: ResponseMessage.unknown,
        };
      }

      return {
        success: 1,
        data: data,
      };
    } catch (err) {
      this.logger.log(err.message, {
        functionName: 'home/getById',
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
