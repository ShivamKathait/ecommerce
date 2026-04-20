import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Listing } from './dto/listing.dto';

const mockProductRepository = {
  save: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findAndCount: jest.fn(),
};

const mockInventoryRepository = {
  save: jest.fn(),
};

const mockCacheManager = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
};

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(Inventory),
          useValue: mockInventoryRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
      };

      const savedProduct = { id: 1, ...createProductDto, is_active: true };

      mockProductRepository.save.mockResolvedValue(savedProduct);
      mockCacheManager.del.mockResolvedValue(undefined);

      const result = await service.create(createProductDto);

      expect(mockProductRepository.save).toHaveBeenCalledWith(createProductDto);
      expect(result).toEqual({
        data: {
          message: 'Product Created successfully.',
          product: savedProduct,
        },
      });
    });
  });

  describe('listing', () => {
    it('should return paginated products', async () => {
      const listingDto: Listing = { pagination: '1', limit: '10' };
      const products = [{ id: 1, name: 'Product 1' }];
      const total = 1;

      mockCacheManager.get.mockResolvedValue(null);
      mockProductRepository.findAndCount.mockResolvedValue([products, total]);
      mockCacheManager.set.mockResolvedValue(undefined);

      const result = await service.listing(listingDto);

      expect(mockProductRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        order: { created_at: 'DESC' },
      });
      expect(result).toEqual({
        data: products,
        meta: {
          total,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });

    it('should return cached result if available', async () => {
      const listingDto: Listing = { pagination: '1', limit: '10' };
      const cachedResult = { data: [], meta: {} };

      mockCacheManager.get.mockResolvedValue(cachedResult);

      const result = await service.listing(listingDto);

      expect(mockProductRepository.findAndCount).not.toHaveBeenCalled();
      expect(result).toBe(cachedResult);
    });
  });
});
