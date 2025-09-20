import { IsNotEmpty } from 'class-validator';

export class ILoginDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class IforgetPwdDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  code: string;
}

export class ISendOtp {
  @IsNotEmpty()
  email: string;
}
