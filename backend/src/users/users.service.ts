import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/auth/mail/mail.service';
import { Product,ProductDocument } from 'src/products/schema/product.schema';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly mailService: MailService,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>, // Inject Product model
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findOne({ id }).exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByEmailAndUpdate(
    email: string,
    updateData: any,
  ): Promise<User | null> {
    return this.userModel
      .findOneAndUpdate({ email }, { $set: updateData }, { new: true })
      .exec();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel({
      ...createUserDto,
      // role: createUserDto.role || 'user',
      id: uuidv4(),
      orders: [],
    });
    return newUser.save();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findOneAndUpdate({ id }, updateUserDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return updatedUser;
  }

  async delete(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findOneAndDelete({ id }).exec();

    if (!deletedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return deletedUser;
  }

  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.userModel.findOne({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return { message: 'Password updated successfully' };
  }
  // async addOrder(userId: string, order: any): Promise<User> {
  //   const updatedUser = await this.userModel.findOneAndUpdate(
  //     { id: userId },
  //     { $push: { orders: order } },
  //     { new: true }
  //   ).exec();
  
  //   if (!updatedUser) {
  //     throw new NotFoundException(`User with ID "${userId}" not found`);
  //   }
  
  //   return updatedUser;
  // }
  // users.service.ts (NestJS)
async addOrder(userId: string, order: any): Promise<User> {
  const updatedUser = await this.userModel.findOneAndUpdate(
    { id: userId },
    { $push: { orders: order } },
    { new: true }
  ).exec();

  if (!updatedUser) {
    throw new NotFoundException(`User with ID "${userId}" not found`);
  }

  // Send order confirmation email
  await this.mailService.sendOrderConfirmationEmail(
    updatedUser.email, 
    {
      ...order,
      products: await this.enrichOrderProducts(order.products) // Add product names
    }
  );

  return updatedUser;
}

private async enrichOrderProducts(products: any[]): Promise<any[]> {
  return Promise.all(products.map(async (product) => {
    const productDetails = await this.productModel.findOne({ id: product.productId });
    return {
      ...product,
      name: productDetails?.name || 'Unknown Product',
      price: productDetails?.price || 0
    };
  }));
}

async updateRoleByAdmin(id: string, newRole: string): Promise<User> {
  const updatedUser = await this.userModel.findOneAndUpdate(
    { id },
    { $set: { role: newRole } },
    { new: true }
  ).exec();

  if (!updatedUser) {
    throw new NotFoundException(`User with ID "${id}" not found`);
  }

  return updatedUser;
}

async updateByAdmin(id: string, updateUserDto: UpdateUserDto): Promise<User> {
  // Admin can update any fields including restricted ones
  const updatedUser = await this.userModel.findOneAndUpdate(
    { id },
    updateUserDto,
    { new: true }
  ).exec();

  if (!updatedUser) {
    throw new NotFoundException(`User with ID "${id}" not found`);
  }

  return updatedUser;
}
}
