import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { FavoritesService } from '../../services/favorites.service';
import { ProductServicesService } from '../../services/product-services.service';
import { IProducts } from '../../models/i-products';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  imports: [CommonModule, RouterModule],
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favoriteItems: IProducts[] = [];
  private favSub!: Subscription;
  private favoritesIds: (number | string)[] = [];

  constructor(
    private favoritesService: FavoritesService,
    private productServices: ProductServicesService
  ) {}

  ngOnInit(): void {
    this.favSub = this.favoritesService.favorites$.subscribe((favoriteIds) => {
      this.favoritesIds = favoriteIds; // Save locally
      this.loadFavoriteItems();
    });
  }

  private loadFavoriteItems(): void {
    if (this.favoritesIds.length > 0) {
      const requests = this.favoritesIds.map(id => this.productServices.getProductById(id));
      forkJoin(requests).subscribe({
        next: (products) => {
          this.favoriteItems = products;
        },
        error: (err) => {
          console.error('Error loading favorite products', err);
          this.favoriteItems = [];
        }
      });
    } else {
      this.favoriteItems = [];
    }
  }

  removeFromFavorites(item: IProducts): void {
    // Add a 'removing' class for the fade-out effect
    const element = document.getElementById(`favorite-item-${item.id}`);
    if (element) {
      element.classList.add('removing');
    }
  
    // Perform the HTTP request to remove the favorite
    this.favoritesService.removeFromFavorites(item.id).subscribe({
      next: (updatedFavorites) => {
        // After fade-out effect completes, remove from array
        setTimeout(() => {
          this.favoriteItems = this.favoriteItems.filter(fav => fav.id !== item.id);
        }, 500); // Match the duration of the fade-out
      },
      error: (error) => {
        console.error('Failed to remove favorite:', error);
      }
    });
  }
  
  clearAllFavorites(): void {
    this.favoritesService.clearFavorites();
    this.favoriteItems = [];
  }

  ngOnDestroy(): void {
    if (this.favSub) {
      this.favSub.unsubscribe();
    }
  }
}
