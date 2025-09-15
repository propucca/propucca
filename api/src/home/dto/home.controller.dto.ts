import { IsNotEmpty } from 'class-validator';

export class IBlogGetById {
  @IsNotEmpty()
  id: number;
}
