"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ProductService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("./entities/product.entity");
const typeorm_2 = require("typeorm");
const Errors = require("../../../../libs/shared/src/error-handler/error-service");
const cache_manager_1 = require("@nestjs/cache-manager");
const inventory_entity_1 = require("../inventory/entities/inventory.entity");
let ProductService = ProductService_1 = class ProductService {
    productModel;
    inventoryModel;
    cacheManager;
    logger = new common_1.Logger(ProductService_1.name);
    constructor(productModel, inventoryModel, cacheManager) {
        this.productModel = productModel;
        this.inventoryModel = inventoryModel;
        this.cacheManager = cacheManager;
    }
    async create(dto) {
        try {
            let product = await this.productModel.save(dto);
            let inventory = { product_id: product.id, };
            await this.inventoryModel.save(inventory);
            await this.clearProductListingCache();
            let data = { message: "Product Created successfully.", product };
            return { data };
        }
        catch (error) {
            throw error;
        }
    }
    async update(product_id, dto) {
        try {
            let { name, description, price, } = dto;
            const is_product = await this.productModel.findOneBy({ id: +product_id });
            if (!is_product)
                throw new Errors.ProductNotFound();
            let update = {};
            if (name)
                update.name = name;
            if (description)
                update.description = description;
            if (price)
                update.price = price;
            let product = await this.productModel.save({ id: is_product.id, ...update });
            await this.clearProductListingCache();
            let data = { message: "Product updated successfully.", product };
            return { data };
        }
        catch (error) {
            throw error;
        }
    }
    async listing(dto) {
        try {
            const limit = +dto.limit || 10;
            const page = +dto.pagination || 1;
            const cacheKey = `products:listing:${page}:${limit}`;
            const cachedResult = await this.cacheManager.get(cacheKey);
            if (cachedResult) {
                return cachedResult;
            }
            const skip = (page - 1) * limit;
            const [items, total] = await this.productModel.findAndCount({
                skip,
                take: limit,
                order: { created_at: 'DESC' },
            });
            const result = {
                data: items,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            };
            await this.cacheManager.set(cacheKey, result, 300000);
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async detail(product_id) {
        try {
            const is_product = await this.productModel.findOne({
                where: { id: +product_id },
                relations: { inventory: true },
            });
            if (!is_product)
                throw new Errors.ProductNotFound();
            return { data: is_product };
        }
        catch (error) {
            throw error;
        }
    }
    async delete(product_id) {
        try {
            const is_product = await this.productModel.findOneBy({ id: +product_id });
            if (!is_product)
                throw new Errors.ProductNotFound();
            await this.productModel.delete({ id: is_product.id });
            await this.clearProductListingCache();
            let data = { message: "Product removed successfully." };
            return { data };
        }
        catch (error) {
            throw error;
        }
    }
    async clearProductListingCache() {
        const commonLimits = [5, 10, 20, 50, 100];
        const commonPages = [1, 2, 3, 4, 5];
        for (const limit of commonLimits) {
            for (const page of commonPages) {
                const cacheKey = `products:listing:${page}:${limit}`;
                await this.cacheManager.del(cacheKey);
            }
        }
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = ProductService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(inventory_entity_1.Inventory)),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository, Object])
], ProductService);
//# sourceMappingURL=product.service.js.map