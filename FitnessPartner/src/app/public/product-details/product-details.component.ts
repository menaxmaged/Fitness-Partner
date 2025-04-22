// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
// import { ProductServicesService } from '../../services/product-services.service';
// import { ITrainerProducts } from '../../models/i-trainer-products';
// import { CommonModule } from '@angular/common';
// import { CartService } from '../../services/cart.service';
// @Component({
//   selector: 'app-product-details',
//   imports: [CommonModule, RouterModule],
//   templateUrl: './product-details.component.html',
//   styles: ``,
// })
// export class ProductDetailsComponent implements OnInit {
//   product!: ITrainerProducts;
//   isFavorite: boolean = false;
//   constructor(
//     private route: ActivatedRoute,
//     private productService: ProductServicesService,
//     private cartService: CartService
//   ) {}
//   ngOnInit(): void {
//     const productId = Number(this.route.snapshot.paramMap.get('id'));
//     this.productService
//       .getProductById(productId)
//       .subscribe((data: ITrainerProducts) => {
//         this.product = data;
//       });
//   }
//   addToCart(product: any) {
//     this.cartService.addToCart(product);
//   }
//   toggleFavorite(product: any) {
//     this.isFavorite = !this.isFavorite;
    
//     if (this.isFavorite) {
//       let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
//       const alreadyExists = favorites.some((p: any) => p.id === product.id);
//       if (!alreadyExists) {
//         favorites.push(product);
//         localStorage.setItem('favorites', JSON.stringify(favorites));
//       }
//     } else {
//       let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
//       favorites = favorites.filter((p: any) => p.id !== product.id);
//       localStorage.setItem('favorites', JSON.stringify(favorites));
//     }
//   }
// }

// toggleFavorite(product: any) {
//   this.isFavorite = !this.isFavorite;
//   if (this.isFavorite) {
//     let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
//     const alreadyExists = favorites.find((p: any) => p.id === product.id);
//     if (!alreadyExists) {
//       favorites.push(product);
//       localStorage.setItem('favorites', JSON.stringify(favorites));
//     }
//   } else {
//     let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
//     favorites = favorites.filter((p: any) => p.id !== product.id);
//     localStorage.setItem('favorites', JSON.stringify(favorites));
//   }
// }


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { ProductServicesService } from '../../services/product-services.service';
import { ITrainerProducts } from '../../models/i-trainer-products';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { FavoritesService } from '../../services/favorites.service'; // Add this import

@Component({
  selector: 'app-product-details',
  standalone: true, // Add this if you're using Angular 17+
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.component.html',
  styles: ``
})
export class ProductDetailsComponent implements OnInit {
  product!: ITrainerProducts;
  isFavorite: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductServicesService,
    private cartService: CartService,
    private favoritesService: FavoritesService // Inject the service
  ) {}

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.productService
      .getProductById(productId)
      .subscribe((data: ITrainerProducts) => {
        this.product = data;
        // Check if product is favorite when data loads
        this.isFavorite = this.favoritesService.isFavorite(this.product.id);
      });
  }

  addToCart(product: ITrainerProducts) {
    this.cartService.addToCart(product);
  }

  toggleFavorite(product: ITrainerProducts) {
    // Use the service instead of direct localStorage manipulation
    this.favoritesService.toggleFavorite(product);
    // Update local state to reflect the change
    this.isFavorite = this.favoritesService.isFavorite(product.id);
  }
}