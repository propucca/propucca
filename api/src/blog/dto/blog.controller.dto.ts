import { IsNotEmpty } from 'class-validator';

export class IBlogCreate {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  user_id: number;
  @IsNotEmpty()
  content: string;
}

export class IBlogUpdate {
  @IsNotEmpty()
  data: IBlogCreate;
  @IsNotEmpty()
  user_id: number;
  @IsNotEmpty()
  id: number;
}

export class IBlogDelete {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  user_id: number;
}

export class IBlogGetAll {
  @IsNotEmpty()
  user_id: number;
}

export class IBlogGetById {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  user_id: number;
}
