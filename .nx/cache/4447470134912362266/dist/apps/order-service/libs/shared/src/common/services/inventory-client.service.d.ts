import { HttpService } from '@nestjs/axios';
export declare class InventoryClientService {
    private readonly httpService;
    constructor(httpService: HttpService);
    reserveInventory(baseUrl: string, authToken: string, productId: number, quantity: number, reservationId: string): Promise<any>;
    confirmReservation(baseUrl: string, authToken: string, productId: number, reservationId: string): Promise<any>;
    releaseReservation(baseUrl: string, authToken: string, productId: number, reservationId: string): Promise<any>;
}
