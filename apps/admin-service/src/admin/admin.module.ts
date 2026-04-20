import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { HttpModule } from '@nestjs/axios';
import { AuthClientService } from 'src/common/services/auth-client.service';

@Module({
  imports: [HttpModule],
  controllers: [AdminController],
  providers: [AdminService, AuthClientService],
  exports: [AdminService],
})
export class AdminModule {}
