// src/app/components/products/products.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ProductServicesService } from '../../services/product-services.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { IProducts } from '../../models/i-products';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LoadingSpinnerComponent,
    TranslateModule,
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: IProducts[] = [];
  filteredProducts: IProducts[] = [];
  selectedProduct: IProducts | null = null;
  quantity = 1;
  selectedFlavor = '';
  isLoggedIn = false;
  isLoading = true;
  showPopUpMessage = false;
  // Pagination
  currentPage = 1;
  itemsPerPage = 9;
  itemsPerPageOptions = [9, 12, 18, 24];

  // Filters
  categories: string[] = [];
  brands: string[] = [];
  selectedCategory = '';
  selectedBrand = '';
  priceRange: { min: number; max: number } = { min: 0, max: 1000 };

  // Sorting
  sortOptions = [
    { value: 'default', label: 'Default sorting' },
    { value: 'price-asc', label: 'Sort by price: low to high' },
    { value: 'price-desc', label: 'Sort by price: high to low' },
    { value: 'name-asc', label: 'Sort by name' },
  ];
  selectedSort = 'default';

  private favoritesSub?: Subscription;

  constructor(
    private productService: ProductServicesService,
    public favoritesService: FavoritesService,
    private authService: AuthService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    // 1) Determine login state and load favorites if logged in
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.favoritesService.initialize();
    }

    // 2) Load products and apply filters/pagination
    this.loadProducts();
    this.setupQueryParams();
  }

  ngOnDestroy(): void {
    this.favoritesSub?.unsubscribe();
  }

  private loadProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (data) => this.handleProductsLoaded(data),
      error: (err) => this.handleLoadError(err),
      complete: () => (this.isLoading = false),
    });
  }

  private handleProductsLoaded(data: IProducts[]): void {
    this.products = data.map((product) => ({
      ...product,
      showFlavors: false,
      isNew: Math.random() > 0.5,
      isHot: Math.random() > 0.7,
      discount: Math.random() > 0.5 ? 10 : 0,
    }));
    this.filteredProducts = [...this.products];
    this.categories = [...new Set(this.products.map((p) => p.category))];
    this.brands = [...new Set(this.products.map((p) => p.brand))];
    this.priceRange.max = Math.max(...this.products.map((p) => p.price));
    this.applyFilters();
  }

  private handleLoadError(err: any): void {
    console.error('Error loading products:', err);
    this.isLoading = false;
    this.router.navigate(['/error']);
  }

  private setupQueryParams(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        this.selectedCategory = params['category'];
        this.applyFilters();
      }
    });
  }

  // Flavor selection
  onFlavorSelect(flavor: string): void {
    if (flavor && flavor !== 'Choose an option') {
      this.selectedFlavor = flavor;
    }
  }

  // Pagination
  changeItemsPerPage(count: number): void {
    this.itemsPerPage = count;
    this.currentPage = 1;
    this.applyFilters();
  }
  pageChanged(page: number): void {
    this.currentPage = page;
  }
  get paginatedProducts(): IProducts[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(start, start + this.itemsPerPage);
  }
  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  // Filters & Sorting
  applyFilters(): void {
    let filtered = [...this.products];
    if (this.selectedCategory) {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }
    if (this.selectedBrand) {
      filtered = filtered.filter(
        (p) => p.brand.toLowerCase() === this.selectedBrand.toLowerCase()
      );
    }
    filtered = filtered.filter(
      (p) => p.price >= this.priceRange.min && p.price <= this.priceRange.max
    );
    filtered = this.sortProducts(filtered);
    this.filteredProducts = filtered;
    this.currentPage = 1;
  }
  resetFilters(): void {
    this.selectedCategory = '';
    this.selectedBrand = '';
    this.priceRange = {
      min: 0,
      max: Math.max(...this.products.map((p) => p.price)),
    };
    this.selectedSort = 'default';
    this.applyFilters();
  }
  private sortProducts(list: IProducts[]): IProducts[] {
    switch (this.selectedSort) {
      case 'price-asc':
        return [...list].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...list].sort((a, b) => b.price - a.price);
      case 'name-asc':
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list;
    }
  }

  // Cart
  addToCart(product: any, available_flavors: string[]): void {
    const flavor =
      this.selectedFlavor ||
      (available_flavors?.length ? available_flavors[0] : 'Unflavored');

    this.cartService
      .addToCart({
        productId: product.productId || product._id || product.id,
        name: product.name,
        image: product.image,
        price: Number(product.price),
        selectedFlavor: flavor,
        quantity: this.quantity,
      })
      .subscribe({
        next: () => {
          this.showPopUpMessage = true;
          setTimeout(() => (this.showPopUpMessage = false), 800);
        },
        error: (err) => {
          console.error('Failed to add to cart', err);
        },
      });
  }

  increaseQuantity(): void {
    this.quantity++;
  }
  decreaseQuantity(): void {
    if (this.quantity > 1) this.quantity--;
  }

  // Favorites
  isInFavorites(id: any): boolean {
    return this.favoritesService.isFavorite(id);
  }
  toggleFavorite(product: IProducts, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.isLoggedIn) {
      alert('Please log in to add items to your favorites');
      return;
    }
    this.favoritesService.toggleFavorite(product).subscribe();
  }

  // Quick View
  openQuickView(product: IProducts, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.selectedProduct = product;
    this.quantity = 1;
    this.selectedFlavor = product.available_flavors?.[0] ?? '';
    document.body.style.overflow = 'hidden';
  }
  closeQuickView(): void {
    this.selectedProduct = null;
    document.body.style.overflow = '';
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString();
  }
}
