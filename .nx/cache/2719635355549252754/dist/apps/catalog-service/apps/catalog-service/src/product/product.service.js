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
const utils_1 = require("../../../../libs/shared/src/common/utils");
let ProductService = ProductService_1 = class ProductService {
    productModel;
    cacheManager;
    logger = new common_1.Logger(ProductService_1.name);
    constructor(productModel, cacheManager) {
        this.productModel = productModel;
        this.cacheManager = cacheManager;
    }
    async create(dto, vendorId) {
        const product = await this.productModel.save({ ...dto, vendor_id: vendorId });
        await this.clearProductListingCache();
        const data = { message: 'Product Created successfully.', product };
        return { data };
    }
    async update(productId, dto, actor) {
        const { name, description, price } = dto;
        const product = await this.productModel.findOneBy({ id: productId });
        if (!product)
            throw new Errors.ProductNotFound();
        this.assertOwnerOrAdmin(product, actor);
        const update = {};
        if (name)
            update.name = name;
        if (description)
            update.description = description;
        if (price)
            update.price = price;
        const updated = await this.productModel.save({
            id: product.id,
            ...update,
        });
        await this.clearProductListingCache();
        const data = { message: 'Product updated successfully.', product: updated };
        return { data };
    }
    async listing(dto) {
        const limit = +dto.limit || 10;
        const page = +dto.pagination || 1;
        const vendorId = dto.vendor_id ? +dto.vendor_id : undefined;
        const cacheKey = `products:listing:${page}:${limit}:vendor:${vendorId ?? 'all'}`;
        const cachedResult = await this.cacheManager.get(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }
        const skip = (page - 1) * limit;
        const [items, total] = await this.productModel.findAndCount({
            where: vendorId ? { vendor_id: vendorId } : {},
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
    async detail(product_id) {
        const is_product = await this.productModel.findOne({
            where: { id: +product_id },
        });
        if (!is_product)
            throw new Errors.ProductNotFound();
        return { data: is_product };
    }
    async delete(productId, actor) {
        const product = await this.productModel.findOneBy({ id: productId });
        if (!product)
            throw new Errors.ProductNotFound();
        this.assertOwnerOrAdmin(product, actor);
        await this.productModel.delete({ id: product.id });
        await this.clearProductListingCache();
        const data = { message: 'Product removed successfully.' };
        return { data };
    }
    async listVendorProducts(vendorId, dto) {
        return this.listing({
            ...dto,
            vendor_id: String(vendorId),
        });
    }
    async clearProductListingCache() {
        const commonLimits = [5, 10, 20, 50, 100];
        const commonPages = [1, 2, 3, 4, 5];
        for (const limit of commonLimits) {
            for (const page of commonPages) {
                const allKey = `products:listing:${page}:${limit}:vendor:all`;
                await this.cacheManager.del(allKey);
                const vendorProducts = await this.productModel.find({
                    select: { vendor_id: true },
                    take: 200,
                });
                const vendorIds = new Set(vendorProducts.map((x) => x.vendor_id));
                for (const vendorId of vendorIds) {
                    const cacheKey = `products:listing:${page}:${limit}:vendor:${vendorId}`;
                    await this.cacheManager.del(cacheKey);
                }
            }
        }
    }
    assertOwnerOrAdmin(product, actor) {
        if (actor.role === utils_1.Role.ADMIN) {
            return;
        }
        if (product.vendor_id !== actor.id) {
            throw new Errors.ForbiddenProductAccess();
        }
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = ProductService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository, Object])
], ProductService);
//# sourceMappingURL=product.service.js.map