import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDto } from './dto/product.dto';
import { Product, ProductDocument } from './schema/product.schema';

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
}
