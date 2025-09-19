import { Injectable } from '@nestjs/common';
import { CustomLoggerService } from '@/logger/logger.service';

const loggerService = new CustomLoggerService();

@Injectable()
export class ORMService {
  constructor() {}

  async create(data: any, table: any): Promise<any> {
    try {
      const record = await table.create(data);

      return record;
    } catch (err) {
      loggerService.log(err.message, {
        functionName: 'create',
        errorCode: '#500',
        logType: 'error',
      });
      return false;
    }
  }

  async findOne(
    find: any,
    table: any,
    sort?: string[],
    join?: any[],
    exclude?: string[],
  ): Promise<any> {
    try {
      const aggregation: any = {
        where: {
          ...find,
        },
      };

      if (sort && sort.length) {
        aggregation['order'] = [sort];
      }

      if (join && join.length) {
        aggregation['include'] = join;
      }

      if (exclude && exclude.length) {
        aggregation['attributes'] = {
          exclude,
        };
      }

      const record = await table.findOne(aggregation);

      return record;
    } catch (err) {
      loggerService.log(err.message, {
        functionName: 'findOne',
        errorCode: '#500',
        logType: 'error',
      });
      return false;
    }
  }

  async findAll(
    find: any,
    table: any,
    sort?: string[],
    join?: any[],
    exclude?: string[],
    pagination?: { limit: number; offset: number }
  ): Promise<any> {
    try {
      const aggregation: any = {
        where: {
          is_active: true,
          ...find,
        },
      };

      if (sort && sort.length) {
        aggregation['order'] = [sort];
      }

      if (join && join.length) {
        aggregation['include'] = join;
      }

      if (exclude && exclude.length) {
        aggregation['attributes'] = {
          exclude,
        };
      }

      if (pagination) {
      aggregation['limit'] = pagination.limit;
      aggregation['offset'] = pagination.offset;
    }

      const record = await table.findAll(aggregation);

      return record;
    } catch (err) {
      loggerService.log(err.message, {
        functionName: 'findAll',
        errorCode: '#500',
        logType: 'error',
      });
      return false;
    }
  }

  async update(data: any, filter: any, table: any) {
    try {
      const record = await table.update(data, {
        where: { ...filter, is_active: true },
      });

      return record;
    } catch (err) {
      loggerService.log(err.message, {
        functionName: 'update',
        errorCode: '#500',
        logType: 'error',
      });
      return false;
    }
  }

  async delete(filter: any, table: any) {
    try {
      const record = await table.destroy({
        where: { ...filter},
      });

      return record;
    } catch (err) {
      loggerService.log(err.message, {
        functionName: 'delete',
        errorCode: '#500',
        logType: 'error',
      });
      return false;
    }
  }
}
