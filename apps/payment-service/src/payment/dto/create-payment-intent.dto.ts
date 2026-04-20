import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsInt()
  @Min(1)
  amount: number;

  @IsString()
  @MaxLength(8)
  currency: string;

  @IsInt()
  @Min(1)
  orderId: number;

  @IsInt()
  @Min(1)
  userId: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  customerId?: string;
}

