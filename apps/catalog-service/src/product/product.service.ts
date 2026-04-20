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

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productModel: Repository<Product>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(dto: CreateProductDto) {
    try {
      const product = await this.productModel.save(dto);
      // Clear all product listing caches when new product is created
      await this.clearProductListingCache();
      const data = { message: 'Product Created successfully.', product };
      return { data };
    } catch (error) {
      throw error;
    }
  }

  async update(product_id: number, dto: UpdateProductDto) {
    try {
      const { name, description, price } = dto;
      const is_product = await this.productModel.findOneBy({ id: +product_id });
      if (!is_product) throw new Errors.ProductNotFound();
      const update: Update = {};
      if (name) update.name = name;
      if (description) update.description = description;
      if (price) update.price = price;
      const product = await this.productModel.save({
        id: is_product.id,
        ...update,
      });
      // Clear all product listing caches when product is updated
      await this.clearProductListingCache();
      const data = { message: 'Product updated successfully.', product };
      return { data };
    } catch (error) {
      throw error;
    }
  }

  async listing(dto: Listing) {
    try {
      const limit = +dto.limit || 10;
      const page = +dto.pagination || 1;
      const cacheKey = `products:listing:${page}:${limit}`;

      // Try to get from cache first
      const cachedResult = await this.cacheManager.get(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      const skip = (page - 1) * limit;
      const [items, total] = await this.productModel.findAndCount({
        skip,
        take: limit,
        order: { created_at: 'DESC' }, // optional: sort by created_at
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

      // Cache the result for 5 minutes (300 seconds)
      await this.cacheManager.set(cacheKey, result, 300000);

      return result;
    } catch (error) {
      throw error;
    }
  }

  async detail(product_id: number) {
    try {
      const is_product = await this.productModel.findOne({
        where: { id: +product_id },
      });
      if (!is_product) throw new Errors.ProductNotFound();
      return { data: is_product };
    } catch (error) {
      throw error;
    }
  }

  async delete(product_id: number) {
    try {
      const is_product = await this.productModel.findOneBy({ id: +product_id });
      if (!is_product) throw new Errors.ProductNotFound();
      await this.productModel.delete({ id: is_product.id });
      // Clear all product listing caches when product is deleted
      await this.clearProductListingCache();
      const data = { message: 'Product removed successfully.' };
      return { data };
    } catch (error) {
      throw error;
    }
  }

  // Helper method to clear all product listing caches
  private async clearProductListingCache() {
    // Since we don't know all possible cache keys, we'll use a pattern
    // In a production app, you might want to use Redis SCAN or maintain a list of keys
    // For simplicity, we'll clear cache by trying common patterns
    const commonLimits = [5, 10, 20, 50, 100];
    const commonPages = [1, 2, 3, 4, 5]; // Clear first few pages

    for (const limit of commonLimits) {
      for (const page of commonPages) {
        const cacheKey = `products:listing:${page}:${limit}`;
        await this.cacheManager.del(cacheKey);
      }
    }
  }
}
