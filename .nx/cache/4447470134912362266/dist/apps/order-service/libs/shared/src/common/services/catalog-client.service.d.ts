import { HttpService } from '@nestjs/axios';
export declare class CatalogClientService {
    private readonly httpService;
    constructor(httpService: HttpService);
    getProduct(baseUrl: string, productId: number): Promise<any>;
}
