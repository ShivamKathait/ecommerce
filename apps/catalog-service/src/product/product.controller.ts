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
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
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
  update(@Param() ID: IDDto, @Body() dto: UpdateProductDto) {
    return this.productService.update(parseInt(ID.id), dto);
  }

  /**
   * Here vendor can see all the components
   * @param {Listing} dto - component data to save
   * @returns
   */
  // @ApiBearerAuth("authorization")
  // @Roles(Role.VENDOR)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
  @ApiOperation({ summary: `Product listing Api` })
  @Get('listing')
  async component_list(@Query() dto: Listing) {
    return this.productService.listing(dto);
  }

  /**
   * vendor will create product here
   * @param {CreateProductDto} dto  -
   * @returns
   */
  // @ApiBearerAuth("authorization")
  // @Roles(Role.VENDOR)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: `Product detail Api` })
  @Get('/:id/detail')
  detail(@Param() ID: IDDto) {
    return this.productService.detail(parseInt(ID.id));
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
  delete(@Param() ID: IDDto) {
    return this.productService.delete(parseInt(ID.id));
  }
}
