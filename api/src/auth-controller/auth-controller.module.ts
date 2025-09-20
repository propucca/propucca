import { Module } from '@nestjs/common';
import { AuthControllerService } from './auth-controller.service';
import { AuthControllerController } from './auth-controller.controller';
import { EncryptionService } from '@/encryption/encryption.service';
import { EmailService } from '@/email/email.service';
import { otpGeneratorService } from '@/utils/otpGenerator.service';

@Module({
  imports: [AuthControllerModule],
  controllers: [AuthControllerController],
  providers: [
    AuthControllerService,
    EncryptionService,
    EmailService,
    otpGeneratorService,
  ],
})
export class AuthControllerModule {}
