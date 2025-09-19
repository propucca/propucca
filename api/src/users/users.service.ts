import { Injectable, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto, UpdateUserDto } from './dto/update-user.dto';
import { ORMService } from '@/database/orm/orm.service';
import { User } from '@/database/orm/orm.schema';
import { EncryptionService } from '@/encryption/encryption.service';
import { ResponseMessage } from '@/constants/constants';
import { CustomLoggerService } from '@/logger/logger.service';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly ormService: ORMService, private readonly pwdService: EncryptionService,private logger:CustomLoggerService) {}
  async create(request: CreateUserDto) {
   try{
     const user = await this.ormService.findOne(
        { email: request.data.email,is_active: true },
        User,
        [],
        [],
        [],
      );

      if (user === false) {
        this.logger.log(ResponseMessage.userfetchfailed, {
          errorCode: '#400',
          functionName: 'users/create',
          logType: 'error',
        });

        return {
          success: 0,
          message: ResponseMessage.unknown,
        };
      }

    if (user !== null) {
      return {
        status: 0,
        msg: ResponseMessage.userexists
      }
    }
    let encryptedPassword = await this.pwdService.encrypt(request.data.password);

    let createUser = await this.ormService.create({ ...request.data, password: encryptedPassword }, User);

    if(!createUser){
      return {
        status:0,
        msg: ResponseMessage.usercreatefailed,

      }
    }
    return{
      status:1,
      msg: ResponseMessage.usercreate,
      insertedId: createUser.dataValues.user_id
    }
   }
    catch(error){ 
      this.logger.log(ResponseMessage.usercreatefailed, {
        errorCode: '#500',
        functionName: 'users/create',
        logType: 'error',
      });
      return {
        status:0,
        msg: ResponseMessage.usercreatefailed,
      }
    }
  }

async findAll(request: GetUserDto & { sort?: { [key: string]: number } }) {
 try{
   const find: any = {};

  if (request.search && Object.keys(request.search).length > 0) {
    Object.assign(find, request.search);
  }

  let sort: string[] = [];
  if (request.sort && Object.keys(request.sort).length > 0) {
    const key = Object.keys(request.sort)[0]; 
    const order = request.sort[key] === 1 ? 'ASC' : 'DESC';
    sort = [key, order];
  }

  if (request.pagination && request.paginationDetails) {
    var users = await this.ormService.findAll(find, User, sort, [], [], {
      limit: request.paginationDetails.limit,
      offset:
        (request.paginationDetails.page - 1) *
        request.paginationDetails.limit,
    });
    if(users === false){
      this.logger.log(ResponseMessage.userfetchfailed, {
        errorCode: '#400',
        functionName: 'users/findAll',
        logType: 'error',
      });
    }
    if(users === null){
      return {
        status: 0,
        msg: ResponseMessage.usersnotfound
      };
    }
    return {
      status:1,
      msg: ResponseMessage.usersfound,
      data: users.map((ele: any) => ({
        id: ele.user_id,
        name: ele.user_name,
        email: ele.email,
        role_id: ele.role_id,
        is_active: ele.is_active
      }))
    }
  }
  var users = await this.ormService.findAll(find, User, sort, [], []);
      if(users === false){
      this.logger.log(ResponseMessage.userfetchfailed, {
        errorCode: '#400',
        functionName: 'users/findAll',
        logType: 'error',
      });
    }
    if(users === null){
      return {
        status: 0,
        msg: ResponseMessage.usersnotfound
      };
    }
    return {
      status:1,
      msg: ResponseMessage.usersfound,
      data: users.map((ele: any) => ({
        id: ele.user_id,
        name: ele.user_name,
        email: ele.email,
        role_id: ele.role_id,
        is_active: ele.is_active
      }))
    }

 }
 catch(error){ 
      this.logger.log(ResponseMessage.userfetchfailed, {
        errorCode: '#500',
        functionName: 'users/findAll',
        logType: 'error',
      });
      return {
        status:0,
        msg: ResponseMessage.unknown,
      };
 }
}


  async findOne(id: string) {
    try{
      var user = await this.ormService.findOne({user_id:id}, User);
    if(user === false){
      this.logger.log(ResponseMessage.userfetchfailed, {
        errorCode: '#400',
        functionName: 'users/findOne',
        logType: 'error',
      });
    }
    if(user === null){
      return {
        status: 0,
        msg: ResponseMessage.usernotfound
      };
    }
    return {
      status:1,
      msg: ResponseMessage.userfound,
      data: {id: user.user_id, name: user.user_name, email: user.email, role_id: user.role_id, is_active: user.is_active}
    }
    }
    catch(error){ 
      this.logger.log(ResponseMessage.userfetchfailed, {
        errorCode: '#500',
        functionName: 'users/findOne',
        logType: 'error',
      });
      return {
        status:0,
        msg: ResponseMessage.unknown,
      };
    }
  }

  async update(request: UpdateUserDto) {
    try{
        const user = await this.ormService.findOne(
        { user_id: request.find.id,is_active: true },
        User,
        [],
        [],
        [],
      );

      if (user === false) {
        this.logger.log(ResponseMessage.userfetchfailed, {
          errorCode: '#400',
          functionName: 'users/update',
          logType: 'error',
        });

        return {
          success: 0,
          message: ResponseMessage.unknown,
        };
      }

    if (user === null) {
      return {
        status: 0,
        msg: ResponseMessage.usernotfound
      }
    }
     var updateUser = await this.ormService.update(request.data,{user_id: request.find.id}, User);

      if(!updateUser){
        return {
          status:0,
          msg: ResponseMessage.userupdatefailed,
        }
      }
      return{
        status:1,
        msg: ResponseMessage.userupdate,
      }

    }
    catch(error){ 
      this.logger.log(ResponseMessage.userupdatefailed, {
        errorCode: '#500',
        functionName: 'users/update',
        logType: 'error',
      });
      return {
        status:0,
        msg: ResponseMessage.unknown,
      }
    }
  }

  async remove(request: DeleteUserDto) {
    try{
       const user = await this.ormService.findOne(
      { user_id: request.find.id, is_active: true },
      User,
      [],
      [],
      [],
    );

    if (user === false) {
      this.logger.log(ResponseMessage.userfetchfailed, {
        errorCode: '#400',
        functionName: 'users/delete',
        logType: 'error',
      });
      return {
        success: 0,
        message: ResponseMessage.unknown,
      };
    }

    if (user === null) {
      return {
        status: 0,
        msg: ResponseMessage.usernotfound,
      };
    }

    const deleteUser = await this.ormService.update({is_active: false},{ user_id: request.find.id }, User);
    if (!deleteUser) {
      return {
        status: 0,
        msg: ResponseMessage.userdeletefailed,
      };
    }
    return {
      status: 1,
      msg: ResponseMessage.userdelete,
    };
  }
    catch(error){ 
      this.logger.log(ResponseMessage.userdeletefailed, {
        errorCode: '#500',
        functionName: 'users/delete',
        logType: 'error',
      });
      return {
        status:0,
        msg: ResponseMessage.unknown,
      }
    }
  }
}
