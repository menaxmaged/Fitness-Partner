import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async getFavorites(userEmail: string) {
    const user = await this.userModel.findOne({ email: userEmail });
    return user?.favorites || [];
  }

  async addFavorite(userEmail: string, productId: string) {
    return this.userModel.findOneAndUpdate(
      { email: userEmail }, // Query by email
      { $addToSet: { favorites: productId } },
      { new: true }
    );
  }

  async removeFavorite(userEmail: string, productId: string) {
    return this.userModel.findOneAndUpdate(
      { email: userEmail }, // Query by email
      { $pull: { favorites: productId } },
      { new: true }
    );
  }

  async clearFavorites(userEmail: string) {
    return this.userModel.findOneAndUpdate(
      { email: userEmail },
      { $set: { favorites: [] } }, // Set favorites to an empty array
      { new: true }
    );
  }
}