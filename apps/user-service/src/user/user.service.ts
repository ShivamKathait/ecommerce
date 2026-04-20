import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import * as Errors from '@ecommerce/shared/error-handler/error-service';
import { User } from 'src/common/entities/user.entity';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async getMyProfile(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId, is_deleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_email_verified: true,
        created_at: true,
      },
    });

    if (!user) {
      throw new Errors.UserNotFound();
    }

    return {
      data: plainToInstance(ProfileResponseDto, user, {
        excludeExtraneousValues: true,
      }),
    };
  }

  async updateMyProfile(userId: number, dto: UpdateProfileDto) {
    const existing = await this.userRepo.findOne({
      where: { id: userId, is_deleted: false },
      select: { id: true },
    });
    if (!existing) {
      throw new Errors.UserNotFound();
    }

    const payload: Partial<User> = {};
    if (typeof dto.name === 'string') {
      payload.name = dto.name.trim();
    }

    if (Object.keys(payload).length > 0) {
      await this.userRepo.update({ id: userId }, payload);
    }

    return this.getMyProfile(userId);
  }
}
