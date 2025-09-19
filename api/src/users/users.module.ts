import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ORMService } from '@/database/orm/orm.service';
import { EncryptionService } from '@/encryption/encryption.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService,ORMService,EncryptionService],
})
export class UsersModule {}
