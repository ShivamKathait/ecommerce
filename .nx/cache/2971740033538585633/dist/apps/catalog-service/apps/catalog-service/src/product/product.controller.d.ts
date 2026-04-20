import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { IDDto, UpdateProductDto } from './dto/update-product.dto';
import { Listing } from './dto/listing.dto';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(dto: CreateProductDto, req: any): Promise<{
        data: {
            message: string;
            product: {
                vendor_id: number;
                name: string;
                description: string;
                price: number;
            } & import("./entities/product.entity").Product;
        };
    }>;
    update(ID: IDDto, dto: UpdateProductDto, req: any): Promise<{
        data: {
            message: string;
            product: {
                id: number;
            } & import("./entities/product.entity").Product;
        };
    }>;
    updateById(productId: number, dto: UpdateProductDto, req: any): Promise<{
        data: {
            message: string;
            product: {
                id: number;
            } & import("./entities/product.entity").Product;
        };
    }>;
    component_list(dto: Listing): Promise<{}>;
    list(dto: Listing): Promise<{}>;
    listMyProducts(req: any, dto: Listing): Promise<{}>;
    detail(ID: IDDto): Promise<{
        data: import("./entities/product.entity").Product;
    }>;
    detailById(productId: number): Promise<{
        data: import("./entities/product.entity").Product;
    }>;
    delete(ID: IDDto, req: any): Promise<{
        data: {
            message: string;
        };
    }>;
}
