import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
  Query,
  Body,
  NotFoundException,
  UseGuards,
  BadRequestException,
  Logger,
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
import { UpdateFlavorQuantityDto } from './dto/UpdateFlavorQuantityDto.dto';
import { AddFlavorDto } from './dto/add-flavor.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);
  
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Roles('user')
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
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @Delete(':id/admin')
  @Roles('admin')
  async delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
  
  @Delete(':id/admin/flavor/:flavorName')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiOperation({ summary: 'Admin: Delete a specific flavor from a product' })
@ApiResponse({ status: 200, description: 'Flavor deleted successfully' })
@ApiResponse({ status: 404, description: 'Product or flavor not found' })
async deleteFlavorFromProduct(
  @Param('id') id: string,
  @Param('flavorName') flavorName: string,
) {
  this.logger.log(`Deleting flavor '${flavorName}' from product ${id}`);
  return this.productsService.deleteFlavorFromProduct(id, flavorName);
}

  @Patch(':id/flavors')
  @ApiOperation({ summary: 'Update the inventory quantity for a specific flavor' })
  @ApiResponse({ status: 200, description: 'Flavor quantity updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid flavor or quantity' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async updateFlavorQuantity(
    @Param('id') id: string,
    @Body() updateFlavorQuantityDto: UpdateFlavorQuantityDto,
  ) {
    const { flavor, quantity } = updateFlavorQuantityDto;
  
    this.logger.log(`Updating flavor quantity for product ${id}: ${flavor}, quantity: ${quantity}`);
    this.logger.log(`Flavor type: ${typeof flavor}, Flavor value: "${flavor}"`);
    
    try {
      // Ensure the product exists before trying to update flavor quantity
      const product = await this.productsService.findById(id);
      
      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }
      
      // Add detailed logging
      this.logger.log(`Product found with ID ${id}`);
      
      // Log flavor_quantity keys to check for exact matches
      if (product.flavor_quantity) {
        const keys = Object.keys(product.flavor_quantity);
        this.logger.log(`Flavor quantity keys: ${JSON.stringify(keys)}`);
        
        // Check each key with string representation and character codes
        keys.forEach(key => {
          this.logger.log(`Key: "${key}", Length: ${key.length}, Char codes: ${[...key].map(c => c.charCodeAt(0))}`);
        });
        
        // Check the flavor we're looking for with string representation and character codes
        this.logger.log(`Looking for flavor: "${flavor}", Length: ${flavor.length}, Char codes: ${[...flavor].map(c => c.charCodeAt(0))}`);
        
        // Direct property access - log the value
        const directValue = product.flavor_quantity[flavor];
        this.logger.log(`Direct property access value: ${directValue}`);
        
        // Check 'in' operator
        const hasProperty = flavor in product.flavor_quantity;
        this.logger.log(`'${flavor}' in flavor_quantity: ${hasProperty}`);
      }
      
      // Try to use the flavor directly - simplest approach
      if (product.flavor_quantity && product.flavor_quantity[flavor] !== undefined) {
        this.logger.log(`Found flavor directly: ${flavor}`);
        
        if (product.flavor_quantity[flavor] < quantity) {
          throw new BadRequestException(
            `Not enough inventory for flavor '${flavor}'. Available: ${product.flavor_quantity[flavor]}, Requested: ${quantity}`
          );
        }
        
        const result = await this.productsService.updateFlavorQuantity(id, flavor, quantity);
        this.logger.log(`Successfully updated flavor quantity for product ${id}`);
        return result;
      }
      
      this.logger.log(`Could not find flavor directly, will attempt case-insensitive matching`);
      throw new BadRequestException(`Debug error - flavor quantity issues for '${flavor}'`);
      
    } catch (error) {
      this.logger.error(`Failed to update flavor quantity: ${error.message}`, error.stack);
      throw error;
    }
  }
  
  @Patch(':id/admin/flavors')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiOperation({ summary: 'Admin: Directly update a flavor quantity without validation' })
@ApiResponse({ status: 200, description: 'Flavor quantity updated by admin successfully' })
@ApiResponse({ status: 404, description: 'Product not found' })
@Patch(':id/admin/flavors')
async updateFlavorQuantityAdmin(
  @Param('id') id: string, // Accept as string first
  @Body() updateFlavorQuantityDto: UpdateFlavorQuantityDto,
) {
  const numericId = parseInt(id, 10); // ✅ Convert to number
  if (isNaN(numericId)) {
    throw new BadRequestException('Invalid product ID');
  }

  const { flavor, quantity } = updateFlavorQuantityDto;
  return this.productsService.updateFlavorQuantityAdmin(id, flavor, quantity);
}

@Post(':id/admin/flavor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiOperation({ summary: 'Admin: Add a new flavor to a product' })
@ApiResponse({ status: 200, description: 'Flavor added successfully' })
@ApiResponse({ status: 404, description: 'Product not found' })
async addFlavorToProduct(
  @Param('id') id: string,
  @Body() addFlavorDto: AddFlavorDto,
) {
  this.logger.log(`Adding flavor '${addFlavorDto.flavorName}' to product ${id}`);
  return this.productsService.addFlavorToProduct(id, addFlavorDto);
}

}