import { Module, Global } from '@nestjs/common';
import { CustomLoggerService } from './logger.service';

@Global() // global scope
@Module({
  providers: [CustomLoggerService],
  exports: [CustomLoggerService],
})
export class LoggerModule {}
