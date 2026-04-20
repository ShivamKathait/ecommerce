import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/create-admin.dto';
import { AuthClientService } from 'src/common/services/auth-client.service';

@Injectable()
export class AdminService {
  constructor(private readonly authClientService: AuthClientService) {}

  async login(dto: LoginDto) {
    return this.authClientService.loginAdmin(dto.email, dto.password);
  }
}
