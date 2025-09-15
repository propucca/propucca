import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@/shared.module';
import { AuthControllerModule } from './auth-controller/auth-controller.module';
import { AuthMiddleware } from '@/middlewares/auth-middleware';
import { BlogModule } from './blog/blog.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SharedModule,
    AuthControllerModule,
    BlogModule,
    HomeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
