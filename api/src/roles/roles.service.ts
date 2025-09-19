import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { DeleteRoleDto, UpdateRoleDto } from './dto/update-role.dto';
import { ORMService } from '@/database/orm/orm.service';
import { Role } from '@/database/orm/orm.schema';
import { EncryptionService } from '@/encryption/encryption.service';
import { CustomLoggerService } from '@/logger/logger.service';
import { ResponseMessage } from '@/constants/constants';
import { GetRoleDto } from './dto/get-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly ormService: ORMService, private logger: CustomLoggerService) { }
  async create(request: CreateRoleDto) {
    try {
      const role = await this.ormService.findOne(
        { role_name: request.data.role_name, is_active: true },
        Role,
        [],
        [],
        [],
      );

      if (role === false) {
        this.logger.log(ResponseMessage.rolefetchfailed, {
          errorCode: '#500',
          functionName: 'roles/create',
          logType: 'error',
        });

        return {
          success: 0,
          message: ResponseMessage.unknown,
        };
      }

      if (role !== null) {
        return {
          status: 0,
          msg: ResponseMessage.roleexists
        }
      }

      let createRole = await this.ormService.create({ ...request.data }, Role);

      if (!createRole) {
        return {
          status: 0,
          msg: ResponseMessage.rolecreatefailed,

        }
      }
      return {
        status: 1,
        msg: ResponseMessage.rolecreate,
        insertedId: createRole.dataValues.role_id
      }
    }
    catch (error) {
      this.logger.log(ResponseMessage.rolecreatefailed, {
        errorCode: '#500',
        functionName: 'roles/create',
        logType: 'error'
      });
      return {
        status: 0,
        msg: ResponseMessage.unknown,
      };
    }
  }


  async findAll(request: GetRoleDto) {
    try {
      const find: any = {};

      if (request.search && Object.keys(request.search).length > 0) {
        Object.assign(find, request.search);
      }

      let sort: string[] = [];
      if (request.sort && Object.keys(request.sort).length > 0) {

        const sortObj = request.sort as { [key: string]: number };
        const key = Object.keys(sortObj)[0];
        const order = sortObj[key] === 1 ? 'ASC' : 'DESC';
        sort = [key, order];
      }

      let pagination: { limit: number; offset: number } | undefined;
      if (request.pagination && request.paginationDetails) {
        pagination = {
          limit: request.paginationDetails.limit,
          offset:
            (request.paginationDetails.page - 1) *
            request.paginationDetails.limit,
        };
      }

      const roles = await this.ormService.findAll(
        find,
        Role,
        sort,
        [],
        [],
        pagination,
      );

      if (roles === false) {
        this.logger.log(ResponseMessage.rolefetchfailed, {
          errorCode: '#400',
          functionName: 'roles/findAll',
          logType: 'error',
        });
        return {
          status: 0,
          msg: ResponseMessage.unknown,
        };
      }

      if (!roles || roles.length === 0) {
        return {
          status: 0,
          msg: ResponseMessage.rolenotfound,
        };
      }

      return {
        status: 1,
        msg: ResponseMessage.rolesfound,
        data: roles.map((ele: any) => ({
          id: ele.role_id,
          name: ele.role_name,
          is_active: ele.is_active,
        })),
      };
    }
    catch (error) {
      this.logger.log(ResponseMessage.rolefetchfailed, {
        errorCode: '#500',
        functionName: 'roles/findAll',
        logType: 'error'
      });
      return {
        status: 0,
        msg: ResponseMessage.unknown,
      };
    }
  }


  async findOne(id: string) {
    try {

      const role = await this.ormService.findOne({ role_id: id }, Role);
      if (role === false) {
        this.logger.log(ResponseMessage.rolefetchfailed, {
          errorCode: '#400',
          functionName: 'roles/findOne',
          logType: 'error',
        });
      }
      if (role === null) {
        return {
          status: 0,
          msg: ResponseMessage.rolenotfound,
        };
      }
      return {
        status: 1,
        msg: ResponseMessage.rolefound,
        data: {
          id: role.role_id,
          name: role.role_name,
          is_active: role.is_active,
        },
      };
    }
    catch (error) {
      this.logger.log(ResponseMessage.rolefetchfailed, {
        errorCode: '#500',
        functionName: 'roles/findOne',
        logType: 'error'
      });
      return {
        status: 0,
        msg: ResponseMessage.unknown,
      };
    }
  }

  async update(request: UpdateRoleDto) {
    try {
      const role = await this.ormService.findOne(
        { role_id: request.find.id, is_active: true },
        Role,
        [],
        [],
        [],
      );

      if (role === false) {
        this.logger.log(ResponseMessage.rolefetchfailed, {
          errorCode: '#400',
          functionName: 'roles/update',
          logType: 'error',
        });

        return {
          success: 0,
          message: ResponseMessage.unknown,
        };
      }

      if (role === null) {
        return {
          status: 0,
          msg: ResponseMessage.rolenotfound
        }
      }
      var updateRole = await this.ormService.update(request.data, { role_id: request.find.id }, Role);

      if (!updateRole) {
        return {
          status: 0,
          msg: ResponseMessage.roleupdatefailed,
        }
      }
      return {
        status: 1,
        msg: ResponseMessage.roleupdate,
      }

    }
    catch (error) {
      this.logger.log(ResponseMessage.roleupdatefailed, {
        errorCode: '#500',
        functionName: 'roles/update',
        logType: 'error'
      });
      return {
        status: 0,
        msg: ResponseMessage.unknown,
      };
    }
  }

  async remove(request: DeleteRoleDto) {
    try {
      const role = await this.ormService.findOne(
        { role_id: request.find.id, is_active: true },
        Role,
        [],
        [],
        [],
      );

      if (role === false) {
        this.logger.log(ResponseMessage.rolefetchfailed, {
          errorCode: '#400',
          functionName: 'roles/delete',
          logType: 'error',
        });
        return {
          success: 0,
          message: ResponseMessage.unknown,
        };
      }

      if (role === null) {
        return {
          status: 0,
          msg: ResponseMessage.usernotfound,
        };
      }

      const deleteRole = await this.ormService.update({ is_active: false }, { role_id: request.find.id }, Role);
      if (!deleteRole) {
        return {
          status: 0,
          msg: ResponseMessage.roledeletefailed,
        };
      }
      return {
        status: 1,
        msg: ResponseMessage.roledelete,
      };
    }
    catch (error) {
      this.logger.log(ResponseMessage.roledeletefailed, {
        errorCode: '#500',
        functionName: 'roles/delete',
        logType: 'error'
      });
      return {
        status: 0,
        msg: ResponseMessage.unknown,
      };
    }
  }
}

