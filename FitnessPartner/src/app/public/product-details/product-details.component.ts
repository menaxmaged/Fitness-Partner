import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductServicesService } from '../../services/product-services.service';
import { IProducts } from '../../models/i-products';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { CartService } from '../../services/cart.service';
import { FavoritesService } from '../../services/favorites.service';
import { Subscription } from 'rxjs';

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
    // Subscribe to route parameter changes
    this.routeSub = this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.loadProductDetails(Number(productId));
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up the subscription
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  loadProductDetails(productId: number): void {
    this.productService.getProductById(productId).subscribe((data: IProducts) => {
      this.product = data;
      
      // Reset component state for new product
      this.quantity = 1;
      this.currentImage = this.product.image;
      
      if (this.product.available_flavors && this.product.available_flavors.length > 0) {
        this.selectedFlavor = this.product.available_flavors[0];
        this.onFlavorChange();
      }
      
      this.isFavorite = this.favoritesService.isFavorite(this.product.id);
      
      // You can calculate discount here if needed
      this.discountPercentage = 0;
      
      // Scroll to top when loading a new product
      window.scrollTo(0, 0);
      
      // Fetch similar products based on category
      this.getSimilarProducts(this.product.category);
    });
  }

  // Keep your existing methods
  getSimilarProducts(category: string): void {
    this.productService.getProductsByCategory(category).subscribe((products: IProducts[]) => {
      // Filter out the current product from the similar products
      this.similarProducts = products.filter(p => p.id !== this.product.id);
    });
  }

  onFlavorChange(): void {
    if (this.selectedFlavor && this.product.product_images[this.selectedFlavor]) {
      this.currentImage = this.product.product_images[this.selectedFlavor];
    } else {
      this.currentImage = this.product.image;
    }
  }

  clearFlavor(): void {
    this.selectedFlavor = '';
    this.currentImage = this.product.image;
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(product: IProducts): void {
    const productToAdd = {
      ...product,
      selectedFlavor: this.selectedFlavor,
      quantity: this.quantity
    };
    
    this.cartService.addToCart(productToAdd);
  }

  changeImage(imageUrl: string): void {
    this.currentImage = imageUrl;
  }

  toggleFavorite(product: IProducts): void {
    this.favoritesService.toggleFavorite(product);
    this.isFavorite = this.favoritesService.isFavorite(product.id);
  }

  // Optional: Add this method if you want to use programmatic navigation
  navigateToProduct(id: number): void {
    // This is an alternative to routerLink if needed
    this.router.navigate(['/products', id]);
  }
}