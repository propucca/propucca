import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { ORMService } from '@/database/orm/orm.service';

@Module({
  controllers: [RolesController],
  providers: [RolesService,ORMService],
})
export class RolesModule {}
