import { Controller, Post, Body } from '@nestjs/common';
import { AuthControllerService } from './auth-controller.service';

import { IforgetPwdDto, ILoginDto, ISendOtp, ISignUpDto, IVerifyOtp } from './dto/auth-controller.dto';

@Controller('auth')
export class AuthControllerController {
  constructor(private readonly authControllerService: AuthControllerService) {}

  @Post('/login')
  async login(@Body() requestBody: ILoginDto): Promise<any> {
    return await this.authControllerService.login(requestBody);
  }

   @Post('/signup')
  async signup(@Body() requestBody: ISignUpDto): Promise<any> {
    return await this.authControllerService.signup(requestBody);
  }

  @Post('/forget-password')
  async forget_password(@Body() requestBody:IforgetPwdDto):Promise<any>{
    return await this.authControllerService.forget_password(requestBody);
  }

  @Post('/send-otp')
  async send_otp(@Body() requestBody:ISendOtp):Promise<any>{
    return await this.authControllerService.sendOtp(requestBody);
  }

  @Post('/verify-otp')
  async verify_otp(@Body() requestBody:IVerifyOtp):Promise<any>{
    return await this.authControllerService.verifyOtp(requestBody);
  }

}
