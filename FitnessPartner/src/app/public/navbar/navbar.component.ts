// import { Component, OnDestroy } from '@angular/core';
// import { Router, RouterLink, RouterModule } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { CartItemsComponent } from '../cart/cart-items/cart-items.component';
// import { CartService } from '../../services/cart.service';
// import { FavoritesService } from '../../services/favorites.service';
// import { AuthService } from '../../services/auth.service';
// import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-nav-bar',
//   standalone: true,
//   imports: [RouterModule, CartItemsComponent, CommonModule, RouterLink],
//   templateUrl: './navbar.component.html',
// })
// export class NavBarComponent implements OnDestroy {
//   cart: any[] = [];
//   favoritesCount: number = 0;
//   private favoritesSub: Subscription;

//   constructor(
//     public authService: AuthService,
//     private favoritesService: FavoritesService,
//     private myCart: CartService,
//     private router: Router
//   ) {
//     this.myCart.cart$.subscribe((cart) => (this.cart = cart));
//     this.cart = this.myCart.getCart();

//     const token = localStorage.getItem('token');
//     let userId = null;

//     if (token) {
//       try {
//         // Split token and handle URL-safe base64 encoding
//         const [header, payload, signature] = token.split('.');

//         // Base64 URL-safe decoding with padding
//         const decodedPayload = JSON.parse(
//           atob(
//             payload
//               .replace(/-/g, '+')
//               .replace(/_/g, '/')
//               .padEnd(payload.length + (4 - (payload.length % 4)) % 4, '=')
//           )
//         );

//         userId = decodedPayload.userId;
//       } catch (error) {
//         console.error('Error decoding token:', error);
//         // Handle invalid token (optional: clear invalid token)
//         localStorage.removeItem('token');
//       }
//     }

//     if (userId) {
//       this.favoritesService.initializeForUser(userId);
//       this.favoritesSub = this.favoritesService.favorites$.subscribe(
//         (favorites) => {
//           this.favoritesCount = favorites.length;
//           console.log('Navbar favorites count updated:', this.favoritesCount);
//         }
//       );
//     } else {
//       // Handle case where user isn't logged in
//       this.favoritesSub = new Subscription();
//     }
//   }

//   ngOnDestroy() {
//     this.favoritesSub.unsubscribe();
//   }

//   OnLogout() {
//     this.authService.logout();
//     this.favoritesService.clearUserData();
//     this.router.navigate(['/login']);
//   }
// }

import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartItemsComponent } from '../cart/cart-items/cart-items.component';
import { CartService } from '../../services/cart.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CartItemsComponent, CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavBarComponent implements OnInit, OnDestroy {
  cart: any[] = [];
  cartTotal: number = 0;
  favoritesCount: number = 0;
  private favoritesSub: Subscription = new Subscription();
  private cartSub: Subscription = new Subscription();
  private totalSub: Subscription = new Subscription();
  constructor(
    public authService: AuthService,
    private favoritesService: FavoritesService,
    private myCart: CartService,
    private router: Router,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    // Set default language
    this.translate.setDefaultLang('en');

    this.myCart.cart$.subscribe((cart) => (this.cart = cart));
    this.cart = this.myCart.getCart();
  }

  ngOnInit(): void {
    // Initialize cart subscription
    this.cartSub = this.myCart.cart$.subscribe((cart) => {
      this.cart = cart;
      // Manually update the favorites count when cart changes
      if (this.authService.isAuthenticated()) {
        this.favoritesCount = this.favoritesService.getFavoritesCount();
      }
      this.cdr.detectChanges();
    });

    // Subscribe to favorites updates
    this.favoritesSub = this.favoritesService.favorites$.subscribe(
      (favorites) => {
        this.favoritesCount = favorites.length;
        console.log('Navbar favorites count updated:', this.favoritesCount);
        // Force change detection to update UI
        this.cdr.detectChanges();
      }
    );

    // If the cart service has a total$ observable, subscribe to it
    if ('total$' in this.myCart) {
      this.totalSub = (this.myCart as any).total$.subscribe((total: number) => {
        this.cartTotal = total;
        this.cdr.detectChanges();
      });
    }
  }

  ngOnDestroy() {
    if (this.favoritesSub) {
      this.favoritesSub.unsubscribe();
    }
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
    if (this.totalSub) {
      this.totalSub.unsubscribe();
    }
  }

  OnLogout() {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      this.authService.logout();
      this.favoritesService.clearUserData();
      this.router.navigate(['/login']);
    }
  }

  // Method to manually refresh favorites count
  refreshFavoritesCount(): void {
    if (this.authService.isAuthenticated()) {
      this.favoritesCount = this.favoritesService.getFavoritesCount();
      this.cdr.detectChanges();
    }
  }
  // switch language
  changeLang(lang: string) {
    this.translate.use(lang);
  }
}
