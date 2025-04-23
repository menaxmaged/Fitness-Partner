import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductServicesService } from '../../services/product-services.service';
import { FavoritesService } from '../../services/favorites.service';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: any[] = [];
  filteredProducts: any[] = [];
  selectedProduct: any = null;
  quantity: number = 1;
  isLoggedIn: boolean = false;
  userId: string | null = null;
  favoriteItems: any[] = [];
  private favoritesSub?: Subscription;
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
  priceRange: { min: number, max: number } = { min: 0, max: 1000 };
  
  // Sorting
  sortOptions = [
    { value: 'default', label: 'Default sorting' },
    { value: 'price-asc', label: 'Sort by price: low to high' },
    { value: 'price-desc', label: 'Sort by price: high to low' },
    { value: 'name-asc', label: 'Sort by name' }
  ];
  selectedSort: string = 'default';

  constructor(
    private productService: ProductServicesService,
    public favoritesService: FavoritesService,
    private cartService: CartService
  ) {}
  
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
    
    if (this.isLoggedIn && token) {
      this.userId = atob(token);
      this.favoritesService.initializeForUser(this.userId);
      
      this.favoritesSub = this.favoritesService.favorites$.subscribe(favorites => {
        this.favoriteItems = favorites;
        console.log('Products component - Favorites updated:', favorites);
      });
    }

    this.productService.getAllProducts().subscribe((data: any[]) => {
      this.products = data.map(product => ({
        ...product,
        showFlavors: false,
        isNew: Math.random() > 0.5,
        isHot: Math.random() > 0.7,
        discount: Math.random() > 0.5 ? 10 : 0
      }));
      
     
      this.filteredProducts = [...this.products];
      
  
      this.categories = [...new Set(this.products.map(p => p.category))];
      this.brands = [...new Set(this.products.map(p => p.brand))];
      
      
      this.priceRange.max = Math.max(...this.products.map(p => p.price));
    });
  }


  changeItemsPerPage(count: number): void {
    this.itemsPerPage = count;
    this.currentPage = 1; 
    this.applyFilters();
  }

  pageChanged(page: number): void {
    this.currentPage = page;
  }

  get paginatedProducts(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  // Filter methods
  applyFilters(): void {
    let filtered = [...this.products];
    
    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }
    
    // Brand filter
    if (this.selectedBrand) {
      filtered = filtered.filter(p => p.brand === this.selectedBrand);
    }
    
    // Price range filter
    filtered = filtered.filter(p => p.price >= this.priceRange.min && p.price <= this.priceRange.max);
    
    // Apply sorting
    filtered = this.sortProducts(filtered);
    
    this.filteredProducts = filtered;
    this.currentPage = 1; // Reset to first page when filters change
  }

  resetFilters(): void {
    this.selectedCategory = '';
    this.selectedBrand = '';
    this.priceRange = { min: 0, max: Math.max(...this.products.map(p => p.price)) };
    this.selectedSort = 'default';
    this.applyFilters();
  }

  // Sorting methods
  sortProducts(products: any[]): any[] {
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
  // Existing methods...
  isInFavorites(productId: string): boolean {
    return this.favoriteItems.some(item => item.id === productId);
  }

  addToWishlist(product: any, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    console.log('Added to wishlist:', product);
  }

  toggleFavorite(product: any, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (!this.isLoggedIn) {
      alert('Please log in to add items to your favorites');
      return;
    }
    
    if (this.isInFavorites(product.id)) {
      this.favoritesService.removeFromFavorites(product.id);
    } else {
      this.favoritesService.addToFavorites(product);
    }
  }

  openQuickView(product: any, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.selectedProduct = product;
    this.quantity = 1;
    document.body.style.overflow = 'hidden';
  }

  closeQuickView(): void {
    this.selectedProduct = null;
    document.body.style.overflow = '';
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(product: any): void {
    for (let i = 0; i < this.quantity; i++) {
      this.cartService.addToCart(product);
    }
    this.showPopUpMessage = true;

    // Hide the pop-up message after 3 seconds
    setTimeout(() => {
      this.showPopUpMessage = false;
    }, 800);
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