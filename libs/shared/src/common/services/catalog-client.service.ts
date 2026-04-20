import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CatalogClientService {
  constructor(private readonly httpService: HttpService) {}

  async getProduct(baseUrl: string, productId: number) {
    const response = await firstValueFrom(
      this.httpService.get(`${baseUrl}/v1/product/${productId}`),
    );

    return response.data?.data;
  }
}

