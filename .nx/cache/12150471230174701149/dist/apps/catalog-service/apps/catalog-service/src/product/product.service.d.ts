import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Listing } from './dto/listing.dto';
import { Cache } from 'cache-manager';
import { Inventory } from 'src/inventory/entities/inventory.entity';
export declare class ProductService {
    private readonly productModel;
    private readonly inventoryModel;
    private cacheManager;
    private readonly logger;
    constructor(productModel: Repository<Product>, inventoryModel: Repository<Inventory>, cacheManager: Cache);
    create(dto: CreateProductDto): Promise<{
        data: {
            message: string;
            product: CreateProductDto & Product;
        };
    }>;
    update(product_id: number, dto: UpdateProductDto): Promise<{
        data: {
            message: string;
            product: {
                id: number;
            } & Product;
        };
    }>;
    listing(dto: Listing): Promise<{}>;
    detail(product_id: number): Promise<{
        data: Product;
    }>;
    delete(product_id: number): Promise<{
        data: {
            message: string;
        };
    }>;
    private clearProductListingCache;
}
