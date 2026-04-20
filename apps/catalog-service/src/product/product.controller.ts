import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard, Roles, RolesGuard } from '@ecommerce/auth';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { IDDto, UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from 'src/common/utils';
import { Listing } from './dto/listing.dto';

@ApiTags('product')
@Controller({ path: 'product', version: '1' })
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * vendor will create product here
   * @param {CreateProductDto} dto  -
   * @param req -The req data from the vendor's auth token
   * @returns
   */
  @ApiBearerAuth('authorization')
  @Roles(Role.VENDOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: `Vendor create Product Api` })
  @Post()
  create(@Body() dto: CreateProductDto, @Req() req) {
    return this.productService.create(dto, req.user.id);
  }

  /**
   * vendor will create product here
   * @param {CreateProductDto} dto  -
   * @param req -The req data from the vendor's auth token
   * @returns
   */
  @ApiBearerAuth('authorization')
  @Roles(Role.VENDOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: `Vendor update Product Api` })
  @Patch('/:id/update')
  update(@Param() ID: IDDto, @Body() dto: UpdateProductDto, @Req() req) {
    return this.productService.update(parseInt(ID.id), dto, req.user);
  }

  @ApiBearerAuth('authorization')
  @Roles(Role.VENDOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: `Vendor update Product Api` })
  @Patch(':id')
  updateById(
    @Param('id', ParseIntPipe) productId: number,
    @Body() dto: UpdateProductDto,
    @Req() req,
  ) {
    return this.productService.update(productId, dto, req.user);
  }

  /**
   * Here vendor can see all the components
   * @param {Listing} dto - component data to save
   * @returns
   */
  @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
  @ApiOperation({ summary: `Product listing Api` })
  @Get('listing')
  async component_list(@Query() dto: Listing) {
    return this.productService.listing(dto);
  }

  @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
  @ApiOperation({ summary: `Product listing Api` })
  @Get()
  async list(@Query() dto: Listing) {
    return this.productService.listing(dto);
  }

  @ApiBearerAuth('authorization')
  @Roles(Role.VENDOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: `Vendor own products Api` })
  @Get('vendor/me')
  async listMyProducts(@Req() req, @Query() dto: Listing) {
    return this.productService.listVendorProducts(req.user.id, dto);
  }

  /**
   * vendor will create product here
   * @param {CreateProductDto} dto  -
   * @returns
   */
  @ApiOperation({ summary: `Product detail Api` })
  @Get('/:id/detail')
  detail(@Param() ID: IDDto) {
    return this.productService.detail(parseInt(ID.id));
  }

  @ApiOperation({ summary: `Product detail Api` })
  @Get(':id')
  detailById(@Param('id', ParseIntPipe) productId: number) {
    return this.productService.detail(productId);
  }

  /**
   * vendor will create product here
   * @param {CreateProductDto} dto  -
   * @param req -The req data from the vendor's auth token
   * @returns
   */
  @ApiBearerAuth('authorization')
  @Roles(Role.VENDOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: `Vendor delete Product Api` })
  @Delete('/:id')
  delete(@Param() ID: IDDto, @Req() req) {
    return this.productService.delete(parseInt(ID.id), req.user);
  }
}
