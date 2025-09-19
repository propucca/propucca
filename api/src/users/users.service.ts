import { User } from '@/database/orm/orm.schema';
import { ORMService } from '@/database/orm/orm.service';
import { Injectable } from '@nestjs/common';



@Injectable()
export class UsersService {
    constructor(private ormService:ORMService){}
    getUsers(): object{
        return this.ormService.findAll({},User)
    }
}