import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartItemsComponent } from '../cart/cart-items/cart-items.component';
import { CartService } from '../../services/cart.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterModule, CartItemsComponent, CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styles: ``
})
export class NavBarComponent implements OnInit {
  cart: any[] = [];
  favoritesCount: number = 0;

  constructor(
    private favoritesService: FavoritesService,
    private myCart: CartService, 
    private router: Router
  ) {}

  ngOnInit() {
    this.myCart.cart$.subscribe((cart) => {
      this.cart = cart;
    });

    this.favoritesService.favorites$.subscribe(favorites => {
      this.favoritesCount = favorites.length;
      console.log("Favorites updated", this.favoritesCount);
    });

    this.cart = this.myCart.getCart();
    this.favoritesCount = this.favoritesService.getFavoritesCount();
  }

  OnLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
  }
}
