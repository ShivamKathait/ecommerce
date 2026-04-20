import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  paymentIntentId: string;
}

