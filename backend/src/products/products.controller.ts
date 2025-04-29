import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
// import { ProductDocument } from './schema/product.schema';
import { ProductDto } from './dto/product.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'; 
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' }) 
  @ApiResponse({ status: 200, type: [ProductDto] })
  async findAll(@Query('category') category?: string): Promise<ProductDto[]> {
    return this.productsService.findAll(category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single product by ID' })
  @ApiResponse({ status: 200, type: ProductDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id') id: string): Promise<ProductDto> {
    const product = await this.productsService.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  // Admin routes
  @Post('admin')
  @Roles('admin')
  async create(@Body() createDto: CreateProductDto) {
    return this.productsService.create(createDto);
  }

  @Put('admin/:id')
  @Roles('admin')
  async update(@Param('id') id: string, @Body() updateDto: UpdateProductDto) {
    return this.productsService.update(id, updateDto);
  }

  @Delete('admin/:id')
  @Roles('admin')
  async delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}