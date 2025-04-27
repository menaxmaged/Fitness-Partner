    import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, BadRequestException } from '@nestjs/common';
    import { CartService } from './cart.service';
    import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
    @Controller('cart')
    @UseGuards(JwtAuthGuard)
    export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get()
    async getCart(@Request() req) {
      const cart = await this.cartService.getCart(req.user.userId);
      console.log('Loaded cart from DB:', cart);  // Log the full cart
      return cart.items;
    }

    @Post('/add')
async addToCart(@Request() req, @Body() productData: any) {
    console.log('User ID:', req.user.userId);
    console.log('Product data received:', productData);
    
    // Check if we have the required fields
    if (!productData.productId) {
        console.error('Missing productId in request');
        throw new BadRequestException('productId is required');
    }
    
    // Add to cart
    const cart = await this.cartService.addToCart(req.user.userId, productData);
    return cart.items;
}

    @Post('/remove-one')
    async removeOneFromCart(@Request() req, @Body() body: { productId: string, selectedFlavor: string }) {
        // Pass the productId and selectedFlavor to correctly identify the item to remove
        const cart = await this.cartService.removeOneFromCart(req.user.userId, body.productId, body.selectedFlavor);
        return cart.items;
    }

    @Delete('/:productId')
    async deleteFromCart(
    @Request() req,
    @Param('productId') productId: string,
    @Body() body: { selectedFlavor: string }
    ) {
    // Ensure selectedFlavor is included in the body to identify the correct product in the cart
    if (!body.selectedFlavor) {
        throw new BadRequestException('selectedFlavor is required');
    }

    const cart = await this.cartService.deleteFromCart(req.user.userId, productId, body.selectedFlavor);
    return cart.items;
    }


    @Delete()
    async clearCart(@Request() req) {
        await this.cartService.clearCart(req.user.userId);
        return [];
    }

    @Post('/sync')
    async syncCart(@Request() req, @Body() body: { items: any[] }) {
        // Sync the cart and handle both productId and selectedFlavor for each item
        const cart = await this.cartService.syncCart(req.user.userId, body.items);
        return cart.items;
    }
    }
