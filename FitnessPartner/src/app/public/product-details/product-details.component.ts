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
import { LoadingSpinnerComponent } from "../../shared/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, RouterModule, FormsModule, LoadingSpinnerComponent],
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
  isFlavorOutOfStock = false;
  showPopUpMessage = false;
  showLoginMessage = false;
  private routeSub!: Subscription;
  imgPath = "/assets/products-imgs/";

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
      this.updateFlavorStockStatus();
      this.updateFavoriteStatus();
      window.scrollTo(0, 0);
      this.loadSimilar(prod.category);
    });
  }

  onFlavorChange(): void {
    console.log('Flavor changed to:', this.selectedFlavor);
    this.updateCurrentImage();
    this.updateFlavorStockStatus();
  }

  updateFlavorStockStatus(): void {
    const quantity = this.product.flavor_quantity?.[this.selectedFlavor] ?? 0;
    this.isFlavorOutOfStock = quantity === 0;
    if (this.isFlavorOutOfStock) {
      console.warn('Selected flavor is out of stock');
    }
    if (this.isFlavorOutOfStock) {
      this.quantity = 1;
    }
  }

  updateCurrentImage(): void {
    if (!this.product || !this.product.product_images) {
      this.currentImage = this.product?.image || '';
      return;
    }

    const img = this.product.product_images[this.selectedFlavor];
    this.currentImage = img || this.product.image;
  }

  loadSimilar(category: string) {
    this.productService.getProductsByCategory(category).subscribe({
      next: list => this.similarProducts = list
        .filter(p => p.id !== this.product.id)
        .slice(0, 4),
      error: err => console.error(err)
    });
  }

  addToCart(prod: IProducts): void {
    const flavor = this.selectedFlavor || '';
    const discountedPrice = this.getDiscountedPrice(prod.price, this.discountPercentage);
  
    this.cartService.addToCart({
      productId: prod.id,
      name: prod.name,
      image: this.currentImage,
      price: discountedPrice,
      selectedFlavor: this.selectedFlavor,
      quantity: this.quantity
    }).subscribe({
      next: updatedCart => {
        this.showPopUpMessage = true;
        setTimeout(() => this.showPopUpMessage = false, 800);
      },
      error: err => console.error('Cart update failed', err)
    });
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  toggleFavorite(prod: IProducts): void {
    this.favoritesService.toggleFavorite(prod).subscribe(() => {
      this.updateFavoriteStatus();
    });
  }

  private updateFavoriteStatus(): void {
    if (this.product) {
      this.isFavorite = this.favoritesService.isFavorite(this.product.id);
    }
  }

  getDiscountedPrice(price: number, discount: number): number {
    return Math.round(price - (price * (discount / 100)));
  }
}
