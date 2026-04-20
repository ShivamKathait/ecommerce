import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { getInternalServiceHeaders } from './internal-service-headers.util';

type InventoryApiEnvelope<T = unknown> = {
  data?: T;
};

@Injectable()
export class InventoryClientService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async reserveInventory(
    baseUrl: string,
    authToken: string,
    productId: number,
    quantity: number,
    reservationId: string,
  ) {
    const response = await firstValueFrom(
      this.httpService.post<InventoryApiEnvelope>(
        `${baseUrl}/v1/inventory/product/${productId}/reservations`,
        { quantity, reservationId },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Idempotency-Key': reservationId,
          },
        },
      ),
    );

    return response.data?.data;
  }

  async confirmReservation(
    baseUrl: string,
    authToken: string,
    productId: number,
    reservationId: string,
  ) {
    const response = await firstValueFrom(
      this.httpService.post<InventoryApiEnvelope>(
        `${baseUrl}/v1/inventory/product/${productId}/reservations/${reservationId}/confirm`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      ),
    );

    return response.data?.data;
  }

  async releaseReservation(
    baseUrl: string,
    authToken: string,
    productId: number,
    reservationId: string,
  ) {
    const response = await firstValueFrom(
      this.httpService.post<InventoryApiEnvelope>(
        `${baseUrl}/v1/inventory/product/${productId}/reservations/${reservationId}/release`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      ),
    );

    return response.data?.data;
  }

  async confirmReservationInternal(
    baseUrl: string,
    productId: number,
    reservationId: string,
  ) {
    const response = await firstValueFrom(
      this.httpService.post<InventoryApiEnvelope>(
        `${baseUrl}/v1/inventory/internal/product/${productId}/reservations/${reservationId}/confirm`,
        {},
        {
          headers: this.getInternalHeaders(),
        },
      ),
    );

    return response.data?.data;
  }

  async releaseReservationInternal(
    baseUrl: string,
    productId: number,
    reservationId: string,
  ) {
    const response = await firstValueFrom(
      this.httpService.post<InventoryApiEnvelope>(
        `${baseUrl}/v1/inventory/internal/product/${productId}/reservations/${reservationId}/release`,
        {},
        {
          headers: this.getInternalHeaders(),
        },
      ),
    );

    return response.data?.data;
  }

  private getInternalHeaders() {
    return getInternalServiceHeaders(this.configService);
  }
}
