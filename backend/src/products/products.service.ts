import { Injectable, NotFoundException } from '@nestjs/common';
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
    const query = category ? { category } : {};
    const products = await this.productModel.find(query).exec();
    return products.map(product => this.toProductDto(product));
  }

  async findOne(id: string): Promise<ProductDto> {
    const product = await this.productModel.findOne({ id }).exec();
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return this.toProductDto(product);
  }

  private toProductDto(product: ProductDocument): ProductDto {
    return {
      id: product._id.toString(),
      name: product.name,
      image: product.image,
      description: product.description,
      expiration_date: product.expiration_date,
      price: product.price,
      brand: product.brand,
      available_flavors: product.available_flavors,
      available_size: product.available_size,
      product_images: Object.fromEntries(product.product_images),
      category: product.category,
    };
  }
}