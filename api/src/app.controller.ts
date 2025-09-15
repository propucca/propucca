import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // remove this after initial deployments
  @Get()
  mainFunc(): string {
    return this.appService.getHello();
  }
}
