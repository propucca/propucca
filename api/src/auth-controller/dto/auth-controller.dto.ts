import { IsNotEmpty } from 'class-validator';

export class ILoginDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  name: string;

  picture: string;
}

export class IUser {
  @IsNotEmpty()
  username: string;
}
