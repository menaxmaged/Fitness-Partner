import { Component, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartItemsComponent } from '../cart/cart-items/cart-items.component';
import { CartService } from '../../services/cart.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CartItemsComponent, CommonModule, RouterLink],
  templateUrl: './navbar.component.html'
})
export class NavBarComponent implements OnDestroy {
  cart: any[] = [];
  favoritesCount: number = 0;
  private favoritesSub: Subscription;

  constructor(
    public authService: AuthService,
    private favoritesService: FavoritesService,
    private myCart: CartService,
    private router: Router
  ) {
    this.myCart.cart$.subscribe(cart => this.cart = cart);
    this.cart = this.myCart.getCart();
    
    this.favoritesSub = this.favoritesService.favorites$.subscribe(favorites => {
      this.favoritesCount = favorites.length;
      console.log('Navbar favorites count updated:', this.favoritesCount);
    });
  }

  ngOnDestroy() {
    this.favoritesSub.unsubscribe();
  }

  OnLogout() {
    this.authService.logout();
    this.favoritesService.clearUserData();
    this.router.navigate(['/login']);
  }
}