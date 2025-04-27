// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import { ProductServicesService } from '../../services/product-services.service';
// import { IProducts } from '../../models/i-products';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms'; 
// import { CartService } from '../../services/cart.service';
// import { FavoritesService } from '../../services/favorites.service';
// import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-product-details',
//   standalone: true,
//   imports: [CommonModule, RouterModule, FormsModule],
//   templateUrl: './product-details.component.html',
//   styleUrls: ['./product-details.component.css']
// })
// export class ProductDetailsComponent implements OnInit, OnDestroy {
//   product!: IProducts;
//   similarProducts: IProducts[] = [];
//   isFavorite: boolean = false;
//   quantity: number = 1;
//   selectedFlavor: string = '';
//   currentImage: string = '';
//   discountPercentage: number = 0;
//   private routeSub!: Subscription;
  
//   Object = Object;

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private productService: ProductServicesService,
//     private cartService: CartService,
//     private favoritesService: FavoritesService
//   ) {}

//   ngOnInit(): void {
//     // Subscribe to route parameter changes
//     this.routeSub = this.route.paramMap.subscribe(params => {
//       const productId = params.get('id');
//       if (productId) {
//         this.loadProductDetails(Number(productId));
//       }
//     });
//   }

//   ngOnDestroy(): void {
//     // Clean up the subscription
//     if (this.routeSub) {
//       this.routeSub.unsubscribe();
//     }
//   }

//   loadProductDetails(productId: number): void {
//     this.productService.getProductById(productId).subscribe((data: IProducts) => {
//       this.product = data;
      
//       // Reset component state for new product
//       this.quantity = 1;
//       this.currentImage = this.product.image;
      
//       if (this.product.available_flavors && this.product.available_flavors.length > 0) {
//         this.selectedFlavor = this.product.available_flavors[0];
//         this.onFlavorChange();
//       }
      
//       this.isFavorite = this.favoritesService.isFavorite(this.product.id);
      
//       // You can calculate discount here if needed
//       this.discountPercentage = 0;
      
//       // Scroll to top when loading a new product
//       window.scrollTo(0, 0);
      
//       // Fetch similar products based on category
//       this.getSimilarProducts(this.product.category);
//     });
//   }

//   // Keep your existing methods
//   getSimilarProducts(category: string): void {
//     this.productService.getProductsByCategory(category).subscribe((products: IProducts[]) => {
//       // Filter out the current product from the similar products
//       this.similarProducts = products.filter(p => p.id !== this.product.id);
//     });
//   }

//   onFlavorChange(): void {
//     if (this.selectedFlavor && this.product.product_images[this.selectedFlavor]) {
//       this.currentImage = this.product.product_images[this.selectedFlavor];
//     } else {
//       this.currentImage = this.product.image;
//     }
//   }

//   clearFlavor(): void {
//     this.selectedFlavor = '';
//     this.currentImage = this.product.image;
//   }

//   increaseQuantity(): void {
//     this.quantity++;
//   }

//   decreaseQuantity(): void {
//     if (this.quantity > 1) {
//       this.quantity--;
//     }
//   }

//   addToCart(product: IProducts): void {
//     const productToAdd = {
//       ...product,
//       selectedFlavor: this.selectedFlavor,
//       quantity: this.quantity
//     };
//     for(let i=0;i<this.quantity;i++){
//       this.cartService.addToCart(productToAdd);
//     }
//   }

//   changeImage(imageUrl: string): void {
//     this.currentImage = imageUrl;
//   }

//   toggleFavorite(product: IProducts): void {
//     this.favoritesService.toggleFavorite(product);
//     this.isFavorite = this.favoritesService.isFavorite(product.id);
//   }

//   // Optional: Add this method if you want to use programmatic navigation
//   navigateToProduct(id: number): void {
//     // This is an alternative to routerLink if needed
//     this.router.navigate(['/products', id]);
//   }
// }
// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import { ProductServicesService } from '../../services/product-services.service';
// import { IProducts } from '../../models/i-products';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms'; 
// import { CartService } from '../../services/cart.service';
// import { FavoritesService } from '../../services/favorites.service';
// import { Subscription, catchError, of } from 'rxjs';
// import { AuthService } from '../../services/auth.service';  // <-- Import AuthService

// @Component({
//   selector: 'app-product-details',
//   standalone: true,
//   imports: [CommonModule, RouterModule, FormsModule],
//   templateUrl: './product-details.component.html',
//   styleUrls: ['./product-details.component.css']
// })
// export class ProductDetailsComponent implements OnInit, OnDestroy {
//   product!: IProducts;
//   similarProducts: IProducts[] = [];
//   isFavorite: boolean = false;
//   quantity: number = 1;
//   selectedFlavor: string = '';
//   currentImage: string = '';
//   discountPercentage: number = 0;
//   isLoading: boolean = true;
//   private routeSub!: Subscription;
//   showPopUpMessage: boolean = false;
//   showLoginMessage: boolean = false;  // <-- Add this to track login message visibility
//   Object = Object;

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private productService: ProductServicesService,
//     private cartService: CartService,
//     private favoritesService: FavoritesService,
//     private authService: AuthService  // <-- Inject AuthService
//   ) {}

//   ngOnInit(): void {
//     this.routeSub = this.route.paramMap.subscribe(params => {
//       const productId = params.get('id');
//       if (productId) {
//         this.loadProductDetails(productId);
//       }
//     });
//   }

//   ngOnDestroy(): void {
//     if (this.routeSub) {
//       this.routeSub.unsubscribe();
//     }
//   }

//   loadProductDetails(productId: string): void {
//     this.isLoading = true;
//     this.productService.getProductById(productId).pipe(
//       catchError((error) => {
//         console.error('Error loading product:', error);
//         this.router.navigate(['/not-found']);
//         return of(null);
//       })
//     ).subscribe((product: IProducts | null) => {
//       this.isLoading = false;
//       if (!product) return;

//       this.product = product;
//       this.discountPercentage = product.discount || 0;

//       if (this.product.available_flavors && this.product.available_flavors.length > 0) {
//         this.selectedFlavor = this.product.available_flavors[0];
//         this.updateCurrentImage();
//       } else {
//         this.currentImage = this.product.image;
//       }

//       this.isFavorite = this.favoritesService.isFavorite(this.product.id);
//       window.scrollTo(0, 0);
//       this.getSimilarProducts(this.product.category);
//     });
//   }

//   updateCurrentImage(): void {
//     if (!this.selectedFlavor || !this.product || !this.product.product_images) {
//       this.currentImage = this.product?.image || '';
//       return;
//     }
//     this.currentImage = this.product.product_images[this.selectedFlavor] || '';
//   }

//   onFlavorChange(): void {
//     this.updateCurrentImage();
//   }

//   getSimilarProducts(category: string): void {
//     this.productService.getProductsByCategory(category).subscribe({
//       next: (products: IProducts[]) => {
//         this.similarProducts = products.filter(p => 
//           p.id !== this.product.id && 
//           p.category === this.product.category
//         ).slice(0, 4);
//       },
//       error: (err) => console.error('Error loading similar products:', err)
//     });
//   }

//   addToCart(product: IProducts): void {
//     const productToAdd = {
//       id: product.id,
//       productId: product.id,
//       name: product.name,
//       image: product.image,
//       price: product.price,
//       selectedFlavor: this.selectedFlavor,
//       quantity: this.quantity
//     };
    
//     console.log('Adding to cart from product details:', productToAdd);
    
//     this.cartService.addToCart(productToAdd, product.available_flavors);
//     this.showPopUpMessage = true;
//     setTimeout(() => {
//       this.showPopUpMessage = false;
//     }, 800);
//   }

//   increaseQuantity(): void {
//     this.quantity++;
//   }

//   decreaseQuantity(): void {
//     if (this.quantity > 1) {
//       this.quantity--;
//     }
//   }

//   toggleFavorite(): void {
//     if (!this.authService.isLoggedIn()) {
//       this.showLoginMessage = true;  // <-- Show login message if not logged in
//       setTimeout(() => {
//         this.showLoginMessage = false;
//       }, 3000);
//       return;
//     }
//     if (this.isFavorite) {
//       this.favoritesService.removeFromFavorites(this.product.id);
//     } else {
//       this.favoritesService.addToFavorites(this.product);
//     }
//     this.isFavorite = !this.isFavorite;
//   }
// }
// src/app/components/product-details/product-details.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductServicesService } from '../../services/product-services.service';
import { IProducts } from '../../models/i-products';
import { CartService } from '../../services/cart.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { Subscription, catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, RouterModule, FormsModule],
  standalone: true,
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product!: IProducts;
  similarProducts: IProducts[] = [];
  isFavorite = false;
  quantity = 1;
  selectedFlavor = '';
  currentImage = '';
  discountPercentage = 0;
  isLoading = true;
  private routeSub!: Subscription;
  showPopUpMessage = false;
  showLoginMessage = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductServicesService,
    private cartService: CartService,
    private favoritesService: FavoritesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) this.loadProductDetails(id);
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  loadProductDetails(id: string): void {
    this.isLoading = true;
    this.productService.getProductById(id).pipe(
      catchError(err => {
        console.error(err);
        this.router.navigate(['/not-found']);
        return of(null);
      })
    ).subscribe(prod => {
      this.isLoading = false;
      if (!prod) return;
      this.product = prod;
      this.discountPercentage = prod.discount || 0;
      this.selectedFlavor = prod.available_flavors?.[0] || '';
      this.updateCurrentImage();
      this.isFavorite = this.favoritesService.isFavorite(prod.id);
      window.scrollTo(0,0);
      this.loadSimilar(prod.category);
    });
  }

  updateCurrentImage(): void {
    if (this.selectedFlavor && this.product.product_images)
      this.currentImage = this.product.product_images[this.selectedFlavor] || this.product.image;
    else
      this.currentImage = this.product.image;
  }

  loadSimilar(category: string) {
    this.productService.getProductsByCategory(category).subscribe({
      next: list => this.similarProducts = list.filter(p => p.id!==this.product.id).slice(0,4),
      error: err => console.error(err)
    });
  }

  addToCart(prod: IProducts): void {
    const flavor = this.selectedFlavor || '';
    this.cartService.addToCart({ 
      id: prod.id, productId: prod.id, name: prod.name,
      image: prod.image, price: prod.price,
      selectedFlavor: flavor, quantity: this.quantity 
    }, prod.available_flavors);
    this.showPopUpMessage = true;
    setTimeout(()=> this.showPopUpMessage = false, 800);
  }

  toggleFavorite(): void {
    if (!this.authService.isLoggedIn()) {
      this.showLoginMessage = true;
      setTimeout(() => this.showLoginMessage = false, 3000);
      return;
    }
    this.favoritesService.toggleFavorite(this.product);
    this.isFavorite = !this.isFavorite;
  }
    increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  onFlavorChange(): void {
    this.updateCurrentImage();
  }
}
