import { Module } from '@nestjs/common';
import { AuthControllerService } from './auth-controller.service';
import { AuthControllerController } from './auth-controller.controller';
import { EncryptionService } from '@/encryption/encryption.service';

@Module({
  imports: [AuthControllerModule],
  controllers: [AuthControllerController],
  providers: [AuthControllerService, EncryptionService],
})
export class AuthControllerModule {}
