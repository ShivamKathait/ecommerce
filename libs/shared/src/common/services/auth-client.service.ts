import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Role } from '../utils';
import { getInternalServiceHeaders } from './internal-service-headers.util';

type AuthApiResponse = Record<string, unknown>;

@Injectable()
export class AuthClientService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async loginAdmin(email: string, password: string) {
    const response = await firstValueFrom(
      this.httpService.post<AuthApiResponse>(
        `${this.getBaseUrl()}/v1/auth/login/admin`,
        {
          email,
          password,
        },
      ),
    );
    return response.data;
  }

  async loginVendor(email: string, password: string) {
    const response = await firstValueFrom(
      this.httpService.post<AuthApiResponse>(
        `${this.getBaseUrl()}/v1/auth/login/vendor`,
        {
          email,
          password,
        },
      ),
    );
    return response.data;
  }

  async updateUserRole(userId: number, role: Role) {
    const response = await firstValueFrom(
      this.httpService.patch<AuthApiResponse>(
        `${this.getBaseUrl()}/v1/auth/users/${userId}/role`,
        { role },
        { headers: this.getInternalHeaders() },
      ),
    );
    return response.data;
  }

  private getBaseUrl(): string {
    return this.configService.get<string>(
      'AUTH_SERVICE_URL',
      'http://localhost:3008',
    );
  }

  private getInternalHeaders() {
    return getInternalServiceHeaders(this.configService);
  }
}
