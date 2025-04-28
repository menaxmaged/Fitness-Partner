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
      this.updateFavoriteStatus(); // Use the new method
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
  
    // Remove the direct isFavorite toggle
    if (this.favoritesService.isFavorite(this.product.id)) {
      this.favoritesService.removeFromFavorites(this.product.id)
        .subscribe(() => {
          this.isFavorite = false;
        });
    } else {
      this.favoritesService.addToFavorites(this.product)
        .subscribe(() => {
          this.isFavorite = true;
        });
    }
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
  private updateFavoriteStatus(): void {
    this.isFavorite = this.favoritesService.isFavorite(this.product.id);
  }
}