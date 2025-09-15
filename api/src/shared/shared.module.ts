import { Module } from '@nestjs/common';

import { LoggerModule } from './logger/logger.module';
import { OrmModule } from './database/orm/orm.module';

@Module({
  imports: [LoggerModule, OrmModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class SharedModule {
  constructor() {}
}
