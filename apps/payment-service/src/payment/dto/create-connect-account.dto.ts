import { IsEmail, IsInt, Min } from 'class-validator';

export class CreateConnectAccountDto {
  @IsEmail()
  email: string;

  @IsInt()
  @Min(1)
  userId: number;
}
