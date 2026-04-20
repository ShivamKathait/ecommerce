import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Role } from 'src/common/utils';

export class ProfileResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  name?: string | null;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty({ enum: Role })
  @Expose()
  role: Role;

  @ApiProperty()
  @Expose()
  is_email_verified: boolean;

  @ApiProperty()
  @Expose()
  created_at: Date;
}
