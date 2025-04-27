import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from './schemas/cart-item.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
  ) {}

  // Get a user's cart, create if doesn't exist
  async getCart(userId: string): Promise<Cart> {
    let cart = await this.cartModel.findOne({ userId }).exec();
    
    if (!cart) {
      cart = new this.cartModel({
        userId,
        items: [],
      });
      await cart.save();
    }
    
    return cart;
  }

  // Add item to cart - FIXED to use productId consistently
  async addToCart(userId: string, productData: any): Promise<Cart> {
    const cart = await this.getCart(userId);
    
    // Get the product ID using either productId or id property
    const productId = productData.productId || productData.id;
    
    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId === productId && item.selectedFlavor === productData.selectedFlavor
    );
    
    if (existingItemIndex > -1) {
      // Update quantity of existing item
      cart.items[existingItemIndex].quantity += productData.quantity || 1;
      cart.items[existingItemIndex].total = 
        cart.items[existingItemIndex].price * cart.items[existingItemIndex].quantity;
    } else {
      // Add new item - NOW USES productId CORRECTLY
      cart.items.push({
        productId: productId, // Use the normalized productId
        name: productData.name,
        image: productData.image,
        price: productData.price,
        selectedFlavor: productData.selectedFlavor || '',
        quantity: productData.quantity || 1,
        total: productData.price * (productData.quantity || 1),
      });
    }
    
    await cart.save();
    return cart;
  }

  // Remove one item from cart
  async removeOneFromCart(userId: string, productId: string, selectedFlavor: string): Promise<Cart> {
    const cart = await this.getCart(userId);
    
    const itemIndex = cart.items.findIndex(item => item.productId === productId && item.selectedFlavor === selectedFlavor);
    
    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }
    
    if (cart.items[itemIndex].quantity > 1) {
      // Decrease quantity
      cart.items[itemIndex].quantity -= 1;
      cart.items[itemIndex].total = 
        cart.items[itemIndex].price * cart.items[itemIndex].quantity;
    } else {
      // Remove item if quantity would be 0
      cart.items.splice(itemIndex, 1);
    }
    
    await cart.save();
    return cart;
  }

  // Delete item from cart
  async deleteFromCart(userId: string, productId: string, selectedFlavor: string = ''): Promise<Cart> {
    const cart = await this.getCart(userId);
    
    const itemIndex = cart.items.findIndex(item => 
      item.productId === productId && item.selectedFlavor === selectedFlavor
    );
    
    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }
    
    // Remove the item entirely
    cart.items.splice(itemIndex, 1);
    
    await cart.save();
    return cart;
  }
  
  // Clear cart
  async clearCart(userId: string): Promise<void> {
    const cart = await this.getCart(userId);
    cart.items = [];
    await cart.save();
  }

  // Sync local cart with server - ALSO FIXED
  async syncCart(userId: string, items: any[]): Promise<Cart> {
    let cart = await this.getCart(userId);
    
    if (items && items.length > 0) {
      // Process each item from the local cart
      for (const item of items) {
        // Get the product ID using either productId or id property
        const productId = item.productId || item.id;
        
        const existingItemIndex = cart.items.findIndex(
          cartItem => cartItem.productId === productId && cartItem.selectedFlavor === item.selectedFlavor
        );
        
        if (existingItemIndex > -1) {
          // Update existing item
          cart.items[existingItemIndex].quantity += item.quantity || 1;
          cart.items[existingItemIndex].total = 
            cart.items[existingItemIndex].price * cart.items[existingItemIndex].quantity;
        } else {
          // Add new item - NOW USES productId CORRECTLY
          cart.items.push({
            productId: productId, // Use the normalized productId
            name: item.name,
            image: item.image,
            price: item.price,
            selectedFlavor: item.selectedFlavor || '',
            quantity: item.quantity || 1,
            total: item.price * (item.quantity || 1),
          });
        }
      }
      
      await cart.save();
    }
    
    return cart;
  }
}