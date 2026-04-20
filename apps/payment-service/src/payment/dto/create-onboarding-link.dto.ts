import { IsInt, Min } from 'class-validator';

export class CreateOnboardingLinkDto {
  @IsInt()
  @Min(1)
  vendorId: number;

  @IsInt()
  @Min(1)
  userId: number;
}
