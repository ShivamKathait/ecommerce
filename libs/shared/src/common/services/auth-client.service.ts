import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Role } from '../utils';

@Injectable()
export class AuthClientService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async loginAdmin(email: string, password: string) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.getBaseUrl()}/v1/auth/login/admin`, {
        email,
        password,
      }),
    );
    return response.data;
  }

  async loginVendor(email: string, password: string) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.getBaseUrl()}/v1/auth/login/vendor`, {
        email,
        password,
      }),
    );
    return response.data;
  }

  async updateUserRole(userId: number, role: Role) {
    const response = await firstValueFrom(
      this.httpService.patch(
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
    const token = this.configService.get<string>('INTERNAL_SERVICE_TOKEN');
    if (!token) {
      throw new Error('INTERNAL_SERVICE_TOKEN is not configured');
    }

    return { 'x-internal-token': token };
  }
}
