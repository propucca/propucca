import { Controller, Post, Body } from '@nestjs/common';
import { AuthControllerService } from './auth-controller.service';

import { ILoginDto, IUser } from './dto/auth-controller.dto';

@Controller('auth')
export class AuthControllerController {
  constructor(private readonly authControllerService: AuthControllerService) {}

  @Post('/login')
  async login(@Body() requestBody: ILoginDto): Promise<any> {
    return await this.authControllerService.login(requestBody);
  }
}
