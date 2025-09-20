import { Global, Module } from '@nestjs/common';
import { ORMService } from './orm.service';

import { SequelizeModule } from '@nestjs/sequelize';
import { User, Role, Otp } from './orm.schema';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  controllers: [],
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      ssl: true,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: true,
      logging: false,
      models: [User, Role, Otp],
    }),
  ],
  providers: [ORMService],
  exports: [ORMService],
})
export class OrmModule {}
