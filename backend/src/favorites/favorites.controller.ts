// src/favorites/favorites.controller.ts
import { Controller, Get, Post, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getFavorites(@Req() req) {
    return this.favoritesService.getFavorites(req.user.email); // <-- email
  }
  
  @Post(':productId')
  addFavorite(@Param('productId') productId: string, @Req() req) {
    return this.favoritesService.addFavorite(req.user.email, productId); // <-- email
  }
  
  @Delete(':productId')
  removeFavorite(@Param('productId') productId: string, @Req() req) {
    return this.favoritesService.removeFavorite(req.user.email, productId); // <-- email
  }
}
