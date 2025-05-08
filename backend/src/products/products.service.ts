import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDto } from './dto/product.dto';
import { Product, ProductDocument } from './schema/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AddFlavorDto } from './dto/add-flavor.dto';


@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll(category?: string): Promise<ProductDto[]> {
    const filter = category ? { category } : {};
    // Use lean() to return plain JavaScript objects
    const products = await this.productModel.find(filter).lean().exec();
    return products.map(prod => this.toProductDto(prod as ProductDocument));
  }

  async findOne(id: string): Promise<ProductDto> {
    // Use lean() to get plain object without Mongoose document overhead
    const product = await this.productModel.findOne({ id }).lean().exec();
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return this.toProductDto(product as ProductDocument);
  }

  private toProductDto(product: ProductDocument): ProductDto {
    // Ensure product_images is a plain object
    const dtoPayload = {
      ...product,
      product_images: product.product_images ?? {},
    };
    return plainToInstance(ProductDto, dtoPayload, {
      excludeExtraneousValues: true,
    });
  }

  async create(dto: CreateProductDto): Promise<ProductDto> {
    // Find the highest ID in the database
    const highestProduct = await this.productModel.findOne()
      .sort({ id: -1 }) // Sort by ID in descending order
      .limit(1)
      .exec();
  
    const newId = highestProduct ? Number(highestProduct.id) + 1 : 1;
  
    // Double-check if the ID already exists
    const exists = await this.productModel.findOne({ id: newId.toString() });
    if (exists) {
      // If the ID exists, try to find the next available ID
      let nextId = newId + 1;
      let nextExists = true;
      
      while (nextExists) {
        const checkExists = await this.productModel.findOne({ id: nextId.toString() });
        if (!checkExists) {
          nextExists = false;
        } else {
          nextId++;
        }
      }
      
      // Initialize flavor_quantity object for each available flavor
      const flavor_quantity = {};
      if (dto.available_flavors && dto.available_flavors.length > 0) {
        dto.available_flavors.forEach(flavor => {
          // Use provided quantity if available, otherwise default to 0
          flavor_quantity[flavor] = dto.flavor_quantity?.[flavor] || 0;
        });
      }
      
      // Create the product with the next available ID
      const product = new this.productModel({
        ...dto,
        id: nextId.toString(),
        flavor_quantity: flavor_quantity,
        inStock: dto.inStock !== undefined ? dto.inStock : true // Default to true if not provided
      });
      
      const saved = await product.save();
      return this.toProductDto(saved);
    }
  
    // Initialize flavor_quantity object for each available flavor
    const flavor_quantity = {};
    if (dto.available_flavors && dto.available_flavors.length > 0) {
      dto.available_flavors.forEach(flavor => {
        // Use provided quantity if available, otherwise default to 0
        flavor_quantity[flavor] = dto.flavor_quantity?.[flavor] || 0;
      });
    }
    
    // Create the product with the new ID
    const product = new this.productModel({
      ...dto,
      id: newId.toString(),
      flavor_quantity: flavor_quantity,
      inStock: dto.inStock !== undefined ? dto.inStock : true // Default to true if not provided
    });
  
    const saved = await product.save();
    return this.toProductDto(saved);
  }


  async update(id: string, dto: UpdateProductDto): Promise<ProductDto> {
    const updated = await this.productModel
      .findOneAndUpdate({ id }, dto, { new: true })
      .exec();
  
    if (!updated) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  
    return this.toProductDto(updated);
  }
  
  async delete(id: string): Promise<{ message: string }> {
    this.logger.log(`Attempting to delete product with ID: ${id}`);
    
    const deleted = await this.productModel.findOneAndDelete({ id }).exec();
    
    if (!deleted) {
      this.logger.error(`Product with ID ${id} not found`);
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  
    this.logger.log(`Product deleted: ${JSON.stringify(deleted)}`);
    return { message: 'Product deleted successfully' };
  }

  async updateFlavorQuantity(id: string, flavor: string, quantity: number): Promise<Product> {
    this.logger.debug(`Updating flavor quantity for product ${id}, flavor: ${flavor}, quantity: ${quantity}`);
    
    const product = await this.productModel.findOne({ id });
  
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  
    // Ensure flavor_quantity is initialized as a Map
    if (!product.flavor_quantity) {
      product.flavor_quantity = {};
      this.logger.warn(`Product ${id} had no flavor_quantity object, creating one`);
    }
  
    // Use Map methods to check flavor existence
    if (!(product.flavor_quantity instanceof Map)) {
      throw new BadRequestException(`Flavor quantity is not properly initialized for product ${id}`);
    }
    if (!product.flavor_quantity.has(flavor)) {
      throw new BadRequestException(`Flavor '${flavor}' does not exist for this product`);
    }
  
    const currentQuantity = product.flavor_quantity.get(flavor);
  
    // Check quantity availability
    if (currentQuantity < quantity) {
      throw new BadRequestException(
        `Not enough inventory for flavor '${flavor}'. Available: ${currentQuantity}, Requested: ${quantity}`
      );
    }
  
    // Update quantity using Map.set()
    product.flavor_quantity.set(flavor, currentQuantity - quantity);
    
    this.logger.debug(`New quantity for product ${id}, flavor ${flavor}: ${product.flavor_quantity.get(flavor)}`);
    
    await product.save();
    return product;
  }
  async findById(id: string): Promise<Product> {
    // Use lean() to ensure we get a plain JavaScript object with all fields
    const product = await this.productModel.findOne({ id }).lean().exec();
    
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    
    this.logger.debug(`Product found by ID ${id}: ${JSON.stringify(product)}`);
    this.logger.debug(`Available flavors: ${JSON.stringify(product.available_flavors)}`);
    this.logger.debug(`Flavor quantities: ${JSON.stringify(product.flavor_quantity)}`);
    
    return product;
  }
// products.service.ts
async updateFlavorQuantityAdmin(id: string, flavor: string, quantity: number): Promise<Product> {
  this.logger.debug(`Updating flavor quantity for product ${id}, flavor: ${flavor}, quantity: ${quantity}`);
    
    const product = await this.productModel.findOne({ id });
  
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  
    // Ensure flavor_quantity is initialized as a Map
    if (!product.flavor_quantity) {
      product.flavor_quantity = {};
      this.logger.warn(`Product ${id} had no flavor_quantity object, creating one`);
    }
  
    // Use Map methods to check flavor existence
    if (!(product.flavor_quantity instanceof Map)) {
      throw new BadRequestException(`Flavor quantity is not properly initialized for product ${id}`);
    }
    if (!product.flavor_quantity.has(flavor)) {
      throw new BadRequestException(`Flavor '${flavor}' does not exist for this product`);
    }
  
    const currentQuantity = product.flavor_quantity.get(flavor);
  
    // Update quantity using Map.set()
    product.flavor_quantity.set(flavor, quantity);
    
    this.logger.debug(`New quantity for product ${id}, flavor ${flavor}: ${product.flavor_quantity.get(flavor)}`);
    
    await product.save();
    return product;
}
async deleteFlavorFromProduct(id: string, flavorName: string): Promise<{ message: string }> {
  this.logger.debug(`Deleting flavor '${flavorName}' from product ${id}`);
  
  const product = await this.productModel.findOne({ id });
  
  if (!product) {
    throw new NotFoundException(`Product with id ${id} not found`);
  }
  
  // Check if the flavor exists
  if (!product.available_flavors || !product.available_flavors.includes(flavorName)) {
    throw new NotFoundException(`Flavor '${flavorName}' not found in product ${id}`);
  }
  
  // Remove the flavor from available_flavors array
  product.available_flavors = product.available_flavors.filter(f => f !== flavorName);
  
  // Remove the flavor from flavor_quantity object
  if (product.flavor_quantity && flavorName in product.flavor_quantity) {
    // Create a new object without the specified flavor
    const updatedFlavorQuantity = { ...product.flavor_quantity };
    delete updatedFlavorQuantity[flavorName];
    product.flavor_quantity = updatedFlavorQuantity;
  }
  
  await product.save();
  
  return { message: `Flavor '${flavorName}' deleted successfully from product ${id}` };
}


// In products.service.ts, add this method
async addFlavorToProduct(id: string, dto: AddFlavorDto): Promise<Product> {
  this.logger.debug(`Adding flavor '${dto.flavorName}' to product ${id}`);

  const product = await this.productModel.findOne({ id });

  if (!product) {
    throw new NotFoundException(`Product with id ${id} not found`);
  }

  // Check for existing flavor
  if (product.available_flavors?.includes(dto.flavorName)) {
    throw new ConflictException(`Flavor '${dto.flavorName}' already exists`);
  }

  // Initialize structures if needed
  product.available_flavors ??= [];
  product.flavor_quantity ??= {};
  product.product_images ??= {};

  // Update fields
  product.available_flavors.push(dto.flavorName);
  product.flavor_quantity[dto.flavorName] = dto.quantity;
  product.product_images[dto.flavorName] = dto.imageUrl;

  // Force Mongoose to detect changes
  product.markModified('flavor_quantity');
  product.markModified('product_images');

  await product.save();

  this.logger.log(`Flavor '${dto.flavorName}' added successfully to product ${id}`);
  return product;
}



}