import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from './schemas/cart-item.schema';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { SyncCartDto } from './dto/sync-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
  ) {}

  async getCart(userId: string,): Promise<Cart> {
    let cart = await this.cartModel.findOne({ userId }).exec();
    
    if (!cart) {
      cart = new this.cartModel({ userId, items: [] });
      await cart.save();
    }
    
    return cart;
  }

  async addToCart(userId: string, productData: AddToCartDto): Promise<Cart> {
    const cart = await this.getCart(userId);
    const productId = productData.productId;

    const existingItemIndex = cart.items.findIndex(
      item => item.productId === productId && 
             item.selectedFlavor === (productData.selectedFlavor || '')
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += productData.quantity || 1;
      cart.items[existingItemIndex].total = 
        cart.items[existingItemIndex].price * cart.items[existingItemIndex].quantity;
    } else {
      cart.items.push({
        productId,
        name: productData.name,
        image: productData.image || '',
        price: productData.price,
        selectedFlavor: productData.selectedFlavor || '',
        quantity: productData.quantity || 1,
        total: productData.price * (productData.quantity || 1),
      });
    }

    cart.markModified('items');
    try {
      await cart.save();
      console.log('Cart saved successfully');
    } catch (error) {
      console.error('Cart save error:', error.message);
      throw new Error('Failed to save cart: ' + error.message);
    }
    return cart;
  }

  async removeOneFromCart(
    userId: string,
    productId: string,
    selectedFlavor: string
  ): Promise<Cart> {
    const cart = await this.getCart(userId);
    const itemIndex = cart.items.findIndex(
      item => item.productId === productId && 
             item.selectedFlavor === selectedFlavor
    );

    if (itemIndex === -1) throw new NotFoundException('Item not found');

    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
      cart.items[itemIndex].total = 
        cart.items[itemIndex].price * cart.items[itemIndex].quantity;
    } else {
      cart.items.splice(itemIndex, 1);
    }

    cart.markModified('items');
    try {
      await cart.save();
    } catch (error) {
      console.error('Save error:', error.message);
      throw error;
    }
    return cart;
  }

  async deleteFromCart(
    userId: string,
    productId: string,
    selectedFlavor: string = ''
  ): Promise<Cart> {
    const cart = await this.getCart(userId);
    const itemIndex = cart.items.findIndex(
      item => item.productId === productId && 
             item.selectedFlavor === selectedFlavor
    );

    if (itemIndex === -1) throw new NotFoundException('Item not found');
    
    cart.items.splice(itemIndex, 1);
    cart.markModified('items');
    try {
      await cart.save();
    } catch (error) {
      console.error('Save error:', error.message);
      throw error;
    }
    return cart;
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.getCart(userId);
    cart.items = [];
    cart.markModified('items');
    try {
      await cart.save();
    } catch (error) {
      console.error('Save error:', error.message);
      throw error;
    }
  }

  async syncCart(userId: string, items: SyncCartDto[]): Promise<Cart> {
    const cart = await this.getCart(userId);
    
    if (items?.length) {
      for (const item of items) {
        const existingItemIndex = cart.items.findIndex(
          ci => ci.productId === item.productId && 
                ci.selectedFlavor === (item.selectedFlavor || '')
        );

        if (existingItemIndex > -1) {
          cart.items[existingItemIndex].quantity += item.quantity || 1;
          cart.items[existingItemIndex].total = 
            cart.items[existingItemIndex].price * cart.items[existingItemIndex].quantity;
        } else {
          cart.items.push({
            productId: item.productId,
            name: item.name,
            image: item.image || '',
            price: item.price,
            selectedFlavor: item.selectedFlavor || '',
            quantity: item.quantity || 1,
            total: item.price * (item.quantity || 1),
          });
        }
      }
      cart.markModified('items');
      try {
        await cart.save();
      } catch (error) {
        console.error('Sync save error:', error.message);
        throw error;
      }
    }
    return cart;
  }
}