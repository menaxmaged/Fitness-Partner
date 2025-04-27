import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductServicesService } from '../../services/product-services.service';
import { FavoritesService } from '../../services/favorites.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { IProducts } from '../../models/i-products'; // Import the interface

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: IProducts[] = [];
  filteredProducts: IProducts[] = [];
  selectedProduct: IProducts | null = null;
  quantity: number = 1;
  selectedFlavor: string = '';  // To store selected flavor
  isLoggedIn: boolean = false;
  userId: string | null = null;
  favoriteItems: any[] = [];
  isLoading: boolean = true;
  showPopUpMessage: boolean = false;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 9;
  itemsPerPageOptions: number[] = [9, 12, 18, 24];

  // Filters
  categories: string[] = [];
  brands: string[] = [];
  selectedCategory: string = '';
  selectedBrand: string = '';
  priceRange: { min: number; max: number } = { min: 0, max: 1000 };

  // Sorting
  sortOptions = [
    { value: 'default', label: 'Default sorting' },
    { value: 'price-asc', label: 'Sort by price: low to high' },
    { value: 'price-desc', label: 'Sort by price: high to low' },
    { value: 'name-asc', label: 'Sort by name' },
  ];
  selectedSort: string = 'default';

  private favoritesSub?: Subscription;

  constructor(
    private productService: ProductServicesService,
    public favoritesService: FavoritesService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeUser();
    this.loadProducts();
    this.setupQueryParams();
  }

  private initializeUser(): void {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;

    if (this.isLoggedIn && token) {
      try {
        this.userId = atob(token);
        this.favoritesService.initializeForUser(this.userId);
        this.favoritesSub = this.favoritesService.favorites$.subscribe(
          (favorites) => {
            this.favoriteItems = favorites;
          }
        );
      } catch (error) {
        console.error('Token decoding failed:', error);
        localStorage.removeItem('token');
        this.isLoggedIn = false;
        this.userId = null;
      }
    }
  }

  private loadProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (data: IProducts[]) => this.handleProductsLoaded(data),
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

  // Flavor selection method
  onFlavorSelect(selected: string): void {
    if (selected && selected !== 'Choose an option') {
      this.selectedFlavor = selected;
    }
  }
  

  // Pagination Methods
  changeItemsPerPage(count: number): void {
    this.itemsPerPage = count;
    this.currentPage = 1;
    this.applyFilters();
  }

  pageChanged(page: number): void {
    this.currentPage = page;
  }

  get paginatedProducts(): IProducts[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  // Filter Methods
  applyFilters(): void {
    let filtered = [...this.products];

    // Apply Category Filter
    if (this.selectedCategory) {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }

    // Apply Brand Filter
    if (this.selectedBrand) {
      filtered = filtered.filter(
        (p) => p.brand.toLowerCase() === this.selectedBrand.toLowerCase()
      );
    }

    // Apply Price Range Filter
    filtered = filtered.filter(
      (p) => p.price >= this.priceRange.min && p.price <= this.priceRange.max
    );

    // Apply Sorting
    filtered = this.sortProducts(filtered);

    // Update filtered products
    this.filteredProducts = filtered;
    this.currentPage = 1; // Reset to first page when filters change
  }

  resetFilters(): void {
    this.selectedCategory = '';
    this.selectedBrand = '';
    this.priceRange = { min: 0, max: Math.max(...this.products.map((p) => p.price)) };
    this.selectedSort = 'default';
    this.applyFilters();
  }

  // Sorting Methods
  sortProducts(products: IProducts[]): IProducts[] {
    switch (this.selectedSort) {
      case 'price-asc':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...products].sort((a, b) => b.price - a.price);
      case 'name-asc':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return products;
    }
  }

  // Cart Methods
  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // addToCart(product: IProducts, available_flavors: string[]): void {
  //   // If no selectedFlavor, use the first available flavor
  //   if (!this.selectedFlavor && available_flavors && available_flavors.length > 0) {
  //     this.selectedFlavor = available_flavors[0];
  //   }
  
  //   const productToAdd = {
  //     ...product,
  //     selectedFlavor: this.selectedFlavor,
  //     quantity: this.quantity
  //   };
  
  //   this.cartService.addToCart(productToAdd, available_flavors);
  
  //   console.log('Adding to cart from ProductsComponent:', {
  //     productId: product.id,
  //     name: product.name,
  //     price: product.price,
  //     selectedFlavor: this.selectedFlavor,
  //     quantity: this.quantity
  //   });
  
  //   // Show confirmation popup
  //   this.showPopUpMessage = true;
  //   setTimeout(() => {
  //     this.showPopUpMessage = false;
  //   }, 800);
  // }
  
  
  
  
  
  // Wishlist Methods
  
  
  addToCart(product: IProducts, available_flavors: string[]): void {
    // If no selectedFlavor, use the first available flavor
    const flavor = this.selectedFlavor || 
                  (available_flavors && available_flavors.length > 0 ? available_flavors[0] : '');
  
    const productToAdd = {
      id: product.id,  // This is important - cart service needs this as productId
      name: product.name,
      image: product.image,
      price: product.price,
      selectedFlavor: flavor,
      quantity: this.quantity
    };
  
    console.log('Adding to cart from ProductsComponent:', productToAdd);
    this.cartService.addToCart(productToAdd, available_flavors);
  
    // Show confirmation popup
    this.showPopUpMessage = true;
    setTimeout(() => {
      this.showPopUpMessage = false;
    }, 800);
  }
  
  isInFavorites(productId: string): boolean {
    return this.favoriteItems.some((item) => item.id === productId);
  }

  toggleFavorite(product: IProducts, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.isLoggedIn) {
      alert('Please log in to add items to your favorites');
      return;
    }

    if (this.isInFavorites(String(product.id))) {
      this.favoritesService.removeFromFavorites(product.id);
    } else {
      this.favoritesService.addToFavorites(product);
    }
  }

  // Quick View Methods
  openQuickView(product: IProducts, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.selectedProduct = product;
    this.quantity = 1;
    
    // Auto-select the first available flavor
    if (this.selectedProduct.available_flavors && this.selectedProduct.available_flavors.length > 0) {
      this.selectedFlavor = this.selectedProduct.available_flavors[0];
    } else {
      this.selectedFlavor = ''; // No flavor options
    }
  
    document.body.style.overflow = 'hidden';
  }
  

  closeQuickView(): void {
    this.selectedProduct = null;
    document.body.style.overflow = '';
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString();
  }

  ngOnDestroy(): void {
    if (this.favoritesSub) {
      this.favoritesSub.unsubscribe();
    }
  }
}
