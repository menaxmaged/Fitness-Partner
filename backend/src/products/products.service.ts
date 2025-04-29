import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDto } from './dto/product.dto';
import { Product, ProductDocument } from './schema/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductsService {
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


  // async create(dto: CreateProductDto): Promise<ProductDto> {
  //   const product = new this.productModel({
  //     ...dto,
  //     _id: uuidv4(), // generate unique product ID
  //   });
  //   const saved = await product.save();
  //   return this.toProductDto(saved);
  // }

  async create(dto: CreateProductDto): Promise<ProductDto> {
    const lastProduct = await this.productModel.findOne()
    .sort({ $natural: -1 })
    .limit(1)
    .exec();

    const newId = lastProduct ? Number(lastProduct.id) + 1 : 1;

    const exists = await this.productModel.findOne({ id: newId.toString() });
    if (exists) {
      throw new ConflictException(`Product with id "${newId}" already exists`);
    }

    const product = new this.productModel({
      ...dto,
      id: newId.toString(),
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
    const deleted = await this.productModel.findOneAndDelete({ id }).exec();
    if (!deleted) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  
    return { message: 'Product deleted successfully' };
  }
}
