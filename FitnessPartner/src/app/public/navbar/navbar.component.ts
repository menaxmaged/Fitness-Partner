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
  templateUrl: './navbar.component.html',
})
export class NavBarComponent implements OnDestroy {
  cart: any[] = [];
  favoritesCount: number = 0;
  private favoritesSub: Subscription = new Subscription();

  constructor(
    public authService: AuthService,
    private favoritesService: FavoritesService,
    private myCart: CartService,
    private router: Router
  ) {
    this.myCart.cart$.subscribe((cart) => (this.cart = cart));
    this.cart = this.myCart.getCart();

    if (this.authService.isAuthenticated()) {
      const userId = this.authService.getCurrentUserId();
      if (userId) {
        this.favoritesService.initialize();
        this.favoritesSub = this.favoritesService.favorites$.subscribe(
          (favorites) => {
            this.favoritesCount = favorites.length;
            console.log('Navbar favorites count updated:', this.favoritesCount);
          }
        );
      }
    }
  }

  ngOnDestroy() {
    if (this.favoritesSub) {
      this.favoritesSub.unsubscribe();
    }
  }

  OnLogout() {
    this.authService.logout();
    this.favoritesService.clearUserData();
    this.router.navigate(['/login']);
  }
}
