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
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductServicesService } from '../../services/product-services.service';
import { IProducts } from '../../models/i-products';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { CartService } from '../../services/cart.service';
import { FavoritesService } from '../../services/favorites.service';
import { Subscription, catchError, of } from 'rxjs';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product!: IProducts;
  similarProducts: IProducts[] = [];
  isFavorite: boolean = false;
  quantity: number = 1;
  selectedFlavor: string = '';
  currentImage: string = '';
  discountPercentage: number = 0;
  isLoading: boolean = true;
  private routeSub!: Subscription;
  
  Object = Object;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductServicesService,
    private cartService: CartService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.loadProductDetails(productId);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  loadProductDetails(productId: string): void {
    this.isLoading = true;
    
    // Reset state for new product
    this.currentImage = '';
    this.selectedFlavor = '';
    this.quantity = 1;
  
    this.productService.getProductById(productId).pipe(
      catchError((error) => {
        console.error('Error loading product:', error);
        this.router.navigate(['/not-found']);
        return of(null);
      })
    ).subscribe((product: IProducts | null) => {
      this.isLoading = false;
      if (!product) return;
  
      this.product = product;
      
      // Debug log
      console.log('Product loaded:', {
        name: this.product?.name,
        image: this.product?.image,
        flavors: this.product?.available_flavors,
        images: this.product?.product_images?.[this.selectedFlavor]
      });
  
      // Set initial flavor and image if flavors are available
      if (this.product.available_flavors && this.product.available_flavors.length > 0) {
        // this.selectedFlavor = this.product.available_flavors[0];
        this.selectedFlavor = "Chocolate";
        // Use the selected flavor's image
        this.updateCurrentImage();
      } else {
        // If no flavors available, use the default image
        this.currentImage = this.product.image;
      }
  
      // Set favorites
      this.isFavorite = this.favoritesService.isFavorite(this.product.id);
  
      // Calculate discount
      this.discountPercentage = product.discount || 0;
      
      // Reset scroll position
      window.scrollTo(0, 0);
      
      // Load similar products
      this.getSimilarProducts(this.product.category);
    });
  }

  // New method to update current image based on selected flavor
  // updateCurrentImage(): void {
  //   if (!this.selectedFlavor || !this.product) {
  //     this.currentImage = this.product?.image || '';
  //     return;
  //   }

  //   // Check if product_images exists and has the selected flavor
  //   if (this.product.product_images && this.product.product_images[this.selectedFlavor]) {
  //     this.currentImage = this.product.product_images[this.selectedFlavor];
  //     console.log(`Updated image to ${this.selectedFlavor} flavor:`, this.currentImage);
  //   } else {
  //     // Fallback to the default image if no specific flavor image is found
  //     this.currentImage = this.product.image;
  //     console.log('No flavor image found, using default:', this.currentImage);
  //   }
  // }
  updateCurrentImage(): void {
    if (!this.selectedFlavor || !this.product || !this.product.product_images) {
      // If no flavor is selected, use the first available flavor's image
      if (this.product?.available_flavors?.length > 0) {
        const defaultFlavor = this.product.available_flavors[0];
        this.currentImage = this.product.product_images[defaultFlavor] || '';
      } else {
        this.currentImage = '';
      }
      return;
    }
  
    // Set image based on selected flavor
    this.currentImage = this.product.product_images[this.selectedFlavor] || '';
    console.log(`Updated image to ${this.selectedFlavor} flavor:`, this.currentImage);
  }
  

  onFlavorChange(): void {
    console.log(`Flavor changed to: ${this.selectedFlavor}`);
    this.updateCurrentImage();
  }

  getSimilarProducts(category: string): void {
    this.productService.getProductsByCategory(category).subscribe({
      next: (products: IProducts[]) => {
        this.similarProducts = products.filter(p => 
          p.id !== this.product.id && 
          p.category === this.product.category
        ).slice(0, 4); // Limit to 4 products
      },
      error: (err) => console.error('Error loading similar products:', err)
    });
  }

  handleImageError(product: IProducts): void {
    console.warn('Failed to load image for product:', product.id);
    product.image = '/assets/fallback-image.jpg'; 
  }

  handleFlavorImageError(flavor: string): void {
    console.warn(`Failed to load thumbnail image for flavor: ${flavor}`);
    // We don't modify the product_images object directly as it might be needed elsewhere
  }

  toggleFavorite(product: IProducts): void {
    this.favoritesService.toggleFavorite(product.id);
    this.isFavorite = this.favoritesService.isFavorite(product.id);
  }

  navigateToProduct(id: string): void {
    this.router.navigate(['/products', id]);
  }

  resetProductState(): void {
    this.product = null!; 
    this.similarProducts = [];
    this.currentImage = '';
    this.selectedFlavor = '';
  }

  addToCart(product: IProducts): void {
    const productToAdd = {
      ...product,
      selectedFlavor: this.selectedFlavor,
      quantity: this.quantity
    };
    for(let i=0; i<this.quantity; i++) {
      this.cartService.addToCart(productToAdd);
    }
  }

  clearFlavor(): void {
    this.selectedFlavor = '';
    this.currentImage = this.product.image;
  }
  
  changeImage(imageUrl: string): void {
    this.currentImage = imageUrl;
  }
  
  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}