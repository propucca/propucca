import { Injectable } from '@nestjs/common';

import { CustomLoggerService } from '@/logger/logger.service';
import { ResponseMessage } from '@/constants/constants';
import {
  IBlogCreate,
  IBlogDelete,
  IBlogGetAll,
  IBlogGetById,
  IBlogUpdate,
} from './dto/blog.controller.dto';
import { User, Post } from '@/database/orm/orm.schema';
import { ORMService } from '@/database/orm/orm.service';

@Injectable()
export class BlogService {
  constructor(
    private readonly logger: CustomLoggerService,
    private readonly orm: ORMService,
  ) {}

  async getAll(request: IBlogGetAll): Promise<object> {
    try {
      const data = await this.orm.findAll(
        { user_id: request.user_id },
        Post,
        ['modified_on'],
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
        functionName: 'post/getAll',
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
        { is_active: true, id: request.id, user_id: request.user_id },
        Post,
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
        functionName: 'post/getById',
        errorCode: '#500',
        logType: 'error',
      });

      return {
        success: 0,
        message: ResponseMessage.unknown,
      };
    }
  }

  async create(request: IBlogCreate): Promise<object> {
    try {
      const insert = await this.orm.create(request, Post);

      if (insert === false) {
        this.logger.log('insert failed', {
          errorCode: '#400',
          functionName: 'post/create',
          logType: 'error',
        });

        return {
          success: 0,
          message: ResponseMessage.unknown,
        };
      }

      return {
        success: 1,
        message: ResponseMessage.postcreate,
      };
    } catch (err) {
      this.logger.log(err.message, {
        functionName: 'post/create',
        errorCode: '#500',
        logType: 'error',
      });

      return {
        success: 0,
        message: ResponseMessage.unknown,
      };
    }
  }

  async update(request: IBlogUpdate): Promise<object> {
    try {
      const updates = await this.orm.update(
        request.data,
        { id: request.id, user_id: request.user_id },
        Post,
      );

      if (updates === false) {
        this.logger.log('update failed', {
          errorCode: '#400',
          functionName: 'post/update',
          logType: 'error',
        });

        return {
          success: 0,
          message: ResponseMessage.unknown,
        };
      }

      return {
        success: 1,
        message: ResponseMessage.postupdate,
      };
    } catch (err) {
      this.logger.log(err.message, {
        functionName: 'update/update',
        errorCode: '#500',
        logType: 'error',
      });

      return {
        success: 0,
        message: ResponseMessage.unknown,
      };
    }
  }

  async delete(request: IBlogDelete): Promise<object> {
    try {
      const updates = await this.orm.update(
        { is_active: false },
        { id: request.id, user_id: request.user_id },
        Post,
      );

      if (updates === false) {
        this.logger.log('update failed', {
          errorCode: '#400',
          functionName: 'post/delete',
          logType: 'error',
        });

        return {
          success: 0,
          message: ResponseMessage.unknown,
        };
      }

      return {
        success: 1,
        message: ResponseMessage.postdelete,
      };
    } catch (err) {
      this.logger.log(err.message, {
        functionName: 'post/delete',
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
