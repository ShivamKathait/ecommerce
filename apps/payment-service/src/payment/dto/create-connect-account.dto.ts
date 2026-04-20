import { IsEmail } from 'class-validator';

export class CreateConnectAccountDto {
  @IsEmail()
  email: string;
}
