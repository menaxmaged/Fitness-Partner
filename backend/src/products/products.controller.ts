import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
// import { ProductDocument } from './schema/product.schema';
import { ProductDto } from './dto/product.dto'; // Add this import
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'; 
@ApiTags('Products')
@Controller('products')
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
}