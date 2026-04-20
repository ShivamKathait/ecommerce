import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { AuthService } from '@ecommerce/auth';
import { PaymentClientService } from 'src/common/services/payment-client.service';
import { User } from 'src/common/entities/user.entity';
import { Role } from 'src/common/utils';
import * as Errors from '@ecommerce/shared/error-handler/error-service';
import { CreateUserDto, LoginDto, OtpDto } from './dto/auth.dto';
import { ResponseUserDto } from './dto/response.dto';

@Injectable()
export class AuthApiService {
  private readonly logger = new Logger(AuthApiService.name);

  constructor(
    @InjectRepository(User) private readonly userModel: Repository<User>,
    private readonly authService: AuthService,
    private readonly paymentClientService: PaymentClientService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const { name, email, password } = createUserDto;
      const normalizedEmail = email.toLowerCase();

      const existingUser = await this.userModel.findOne({
        where: { email: normalizedEmail, is_deleted: false },
        select: { email: true, name: true },
      });

      if (existingUser) {
        throw new Errors.EmailExist();
      }

      const hashPassword = await this.authService.hashPassword(password);
      const user = await this.userModel.save({
        name,
        email: normalizedEmail,
        password: hashPassword,
        role: Role.USER,
        created_at: new Date(),
      });

      await this.authService.generateOtpForUser(user.id);
      const access_token = await this.authService.generateTempToken(
        user.id,
        user.email,
        user.role,
      );
      return { access_token };
    } catch (error) {
      this.logger.error('register failed', error?.stack ?? String(error));
      throw error;
    }
  }

  async verify_otp(dto: OtpDto, user: { id: number }) {
    try {
      const { otp } = dto;

      const fetch_user = await this.userModel.findOne({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          email: true,
          otp: true,
          otp_expire_at: true,
        },
      });

      if (!fetch_user) {
        throw new Errors.UserNotFound();
      }

      if (
        fetch_user.otp_expire_at &&
        new Date(fetch_user.otp_expire_at) < new Date()
      ) {
        throw new Errors.OtpExipred();
      }

      if (Number(fetch_user.otp) !== Number(otp)) {
        throw new Errors.InvalidOtp();
      }

      const cus_id = await this.paymentClientService.createCustomer(
        fetch_user.name,
        fetch_user.email,
      );
      await this.userModel.update(user.id, {
        otp_expire_at: null,
        otp: null,
        is_email_verified: true,
        stripe_customer_id: cus_id,
      });

      await this.authService.clearUserCache(user.id);
      return { data: { message: 'Otp verified successfully.' } };
    } catch (error) {
      this.logger.error('verify_otp failed', error?.stack ?? String(error));
      throw error;
    }
  }

  async login(dto: LoginDto) {
    return this.loginByRole(dto, Role.USER, () => new Errors.UserNotExist());
  }

  async loginAdmin(dto: LoginDto) {
    return this.loginByRole(dto, Role.ADMIN, () => new Errors.AdminNotExist());
  }

  async loginVendor(dto: LoginDto) {
    return this.loginByRole(
      dto,
      Role.VENDOR,
      () => new Errors.VendorNotExist(),
    );
  }

  async updateUserRole(userId: number, role: Role) {
    const existing = await this.userModel.findOne({
      where: { id: userId, is_deleted: false },
    });
    if (!existing) {
      throw new Errors.UserNotFound();
    }

    await this.userModel.update({ id: userId }, { role });
    await this.authService.clearUserCache(userId);
    return {
      data: {
        message: 'User role updated successfully.',
        user_id: userId,
        role,
      },
    };
  }

  private async loginByRole(
    dto: LoginDto,
    role: Role,
    notExistErrorFactory: () => Error,
  ) {
    try {
      const { email, password } = dto;
      const normalizedEmail = email.toLowerCase();

      let isUser = await this.userModel.findOne({
        where: { email: normalizedEmail, is_deleted: false, role },
      });

      if (!isUser) {
        throw notExistErrorFactory();
      }

      isUser = { ...isUser };
      if (isUser.is_email_verified === false) {
        const access_token = await this.authService.generateTempToken(
          isUser.id,
          isUser.email,
          isUser.role,
        );
        await this.authService.generateOtpForUser(isUser.id);
        return {
          data: { is_email_verified: isUser.is_email_verified, access_token },
        };
      }

      const isPassword = await this.authService.compareHash(
        password,
        isUser.password,
      );
      if (!isPassword) {
        throw new Errors.IncorrectCreds();
      }

      const session = await this.authService.createSession(
        isUser.id,
        isUser.role,
      );
      const access_token = await this.authService.generateToken(
        isUser.id,
        session.id,
        isUser.email,
        isUser.role,
      );

      await this.authService.clearUserCache(isUser.id);
      await this.authService.cacheUserSession(isUser, session.id.toString());

      const response = new ResponseUserDto({ ...isUser, access_token });
      await validate(response, { whitelist: true });
      return { data: { message: 'Login successfully.', ...response } };
    } catch (error) {
      this.logger.error('login failed', error?.stack ?? String(error));
      throw error;
    }
  }
}
