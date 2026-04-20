import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Listing } from './dto/listing.dto';
import { Cache } from 'cache-manager';
import { Role } from 'src/common/utils';
export declare class ProductService {
    private readonly productModel;
    private cacheManager;
    private readonly logger;
    constructor(productModel: Repository<Product>, cacheManager: Cache);
    create(dto: CreateProductDto, vendorId: number): Promise<{
        data: {
            message: string;
            product: {
                vendor_id: number;
                name: string;
                description: string;
                price: number;
            } & Product;
        };
    }>;
    update(productId: number, dto: UpdateProductDto, actor: {
        id: number;
        role: Role;
    }): Promise<{
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
    delete(productId: number, actor: {
        id: number;
        role: Role;
    }): Promise<{
        data: {
            message: string;
        };
    }>;
    listVendorProducts(vendorId: number, dto: Listing): Promise<{}>;
    private clearProductListingCache;
    private assertOwnerOrAdmin;
}
