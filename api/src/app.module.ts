import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@/shared.module';
import { AuthControllerModule } from './auth-controller/auth-controller.module';
import { AuthMiddleware } from '@/middlewares/auth-middleware';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { EmailModule } from '@/email/email.module';
import { EmailController } from '@/email/email.controller';
import { EmailService } from '@/email/email.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SharedModule,
    AuthControllerModule,
    UsersModule,
    EmailModule,
  ],
  controllers: [AppController, UsersController, EmailController],
  providers: [AppService, UsersService, EmailService],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
