import { Injectable, Inject, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import * as Errors from '@ecommerce/shared/error-handler/error-service';
import { Update } from 'src/common/interface';
import { Listing } from './dto/listing.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Role } from 'src/common/utils';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productModel: Repository<Product>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(dto: CreateProductDto, vendorId: number) {
    const product = await this.productModel.save({ ...dto, vendor_id: vendorId });
    await this.clearProductListingCache();
    const data = { message: 'Product Created successfully.', product };
    return { data };
  }

  async update(
    productId: number,
    dto: UpdateProductDto,
    actor: { id: number; role: Role },
  ) {
    const { name, description, price } = dto;
    const product = await this.productModel.findOneBy({ id: productId });
    if (!product) throw new Errors.ProductNotFound();
    this.assertOwnerOrAdmin(product, actor);

    const update: Update = {};
    if (name) update.name = name;
    if (description) update.description = description;
    if (price) update.price = price;
    const updated = await this.productModel.save({
      id: product.id,
      ...update,
    });
    await this.clearProductListingCache();
    const data = { message: 'Product updated successfully.', product: updated };
    return { data };
  }

  async listing(dto: Listing) {
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

  async detail(product_id: number) {
    const is_product = await this.productModel.findOne({
      where: { id: +product_id },
    });
    if (!is_product) throw new Errors.ProductNotFound();
    return { data: is_product };
  }

  async delete(productId: number, actor: { id: number; role: Role }) {
    const product = await this.productModel.findOneBy({ id: productId });
    if (!product) throw new Errors.ProductNotFound();
    this.assertOwnerOrAdmin(product, actor);
    await this.productModel.delete({ id: product.id });
    await this.clearProductListingCache();
    const data = { message: 'Product removed successfully.' };
    return { data };
  }

  async listVendorProducts(vendorId: number, dto: Listing) {
    return this.listing({
      ...dto,
      vendor_id: String(vendorId),
    });
  }

  private async clearProductListingCache() {
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

  private assertOwnerOrAdmin(product: Product, actor: { id: number; role: Role }) {
    if (actor.role === Role.ADMIN) {
      return;
    }
    if (product.vendor_id !== actor.id) {
      throw new Errors.ForbiddenProductAccess();
    }
  }
}
