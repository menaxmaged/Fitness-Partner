
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
// import { ProductServicesService } from '../../services/product-services.service';
// import { ITrainerProducts } from '../../models/i-trainer-products';
// import { CommonModule } from '@angular/common';
// import { CartService } from '../../services/cart.service';
// import { FavoritesService } from '../../services/favorites.service'; // Add this import

// @Component({
//   selector: 'app-product-details',
//   standalone: true, // Add this if you're using Angular 17+
//   imports: [CommonModule, RouterModule],
//   templateUrl: './product-details.component.html',
//   styles: ``
// })
// export class ProductDetailsComponent implements OnInit {
//   product!: ITrainerProducts;
//   isFavorite: boolean = false;

//   constructor(
//     private route: ActivatedRoute,
//     private productService: ProductServicesService,
//     private cartService: CartService,
//     private favoritesService: FavoritesService // Inject the service
//   ) {}

//   ngOnInit(): void {
//     const productId = Number(this.route.snapshot.paramMap.get('id'));
//     this.productService
//       .getProductById(productId)
//       .subscribe((data: ITrainerProducts) => {
//         this.product = data;
//         // Check if product is favorite when data loads
//         this.isFavorite = this.favoritesService.isFavorite(this.product.id);
//       });
//   }

//   addToCart(product: ITrainerProducts) {
//     this.cartService.addToCart(product);
//   }

//   toggleFavorite(product: ITrainerProducts) {
//     // Use the service instead of direct localStorage manipulation
//     this.favoritesService.toggleFavorite(product);
//     // Update local state to reflect the change
//     this.isFavorite = this.favoritesService.isFavorite(product.id);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductServicesService } from '../../services/product-services.service';
import { IProducts } from '../../models/i-products';  // Import the IProducts interface
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { FavoritesService } from '../../services/favorites.service'; // Add this import

@Component({
  selector: 'app-product-details',
  standalone: true, // Add this if you're using Angular 17+
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'] // Assuming you have a separate CSS file for styling
})
export class ProductDetailsComponent implements OnInit {
  product!: IProducts;                     // Product object based on IProducts interface
  similarProducts: IProducts[] = [];        // Similar products based on IProducts interface
  isFavorite: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductServicesService,
    private cartService: CartService,
    private favoritesService: FavoritesService // Inject the service
  ) {}

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));

    // Get product details by ID
    this.productService.getProductById(productId).subscribe((data: IProducts) => {
      this.product = data;
      // Check if product is favorite when data loads
      this.isFavorite = this.favoritesService.isFavorite(this.product.id);

      // Fetch similar products based on category
      this.getSimilarProducts(this.product.category);
    });
  }

  // Fetch similar products based on the category
  getSimilarProducts(category: string): void {
    this.productService.getProductsByCategory(category).subscribe((products: IProducts[]) => {
      // Filter out the current product from the similar products
      this.similarProducts = products.filter(p => p.id !== this.product.id);
    });
  }

  addToCart(product: IProducts): void {
    this.cartService.addToCart(product);
  }

  toggleFavorite(product: IProducts): void {
    this.favoritesService.toggleFavorite(product);
    this.isFavorite = this.favoritesService.isFavorite(product.id);
  }
}
