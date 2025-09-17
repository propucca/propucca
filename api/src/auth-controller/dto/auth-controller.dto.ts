import { IsNotEmpty } from 'class-validator';

export class ILoginDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password:string;
}

export class ISignUpDto {
  @IsNotEmpty()
  user_name:string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password:string;
}

export class IforgetPwdDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  new_password:string;
}

export class ISendOtp {
  @IsNotEmpty()
  email: string;
}

export class IVerifyOtp {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  otp:string;
}
