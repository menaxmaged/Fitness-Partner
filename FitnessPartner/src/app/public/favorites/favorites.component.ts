import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { FavoritesService } from '../../services/favorites.service';
import { ProductServicesService } from '../../services/product-services.service';
import { IProducts } from '../../models/i-products';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  imports: [CommonModule, RouterModule, TranslateModule],
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
    private productServices: ProductServicesService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    // Make sure favorites service is initialized
    this.favoritesService.initialize();

    this.favSub = this.favoritesService.favorites$.subscribe((favoriteIds) => {
      console.log(
        'FavoritesComponent received updated favorites:',
        favoriteIds
      );
      this.favoritesIds = favoriteIds; // Save locally
      this.loadFavoriteItems();
    });
  }

  private loadFavoriteItems(): void {
    if (this.favoritesIds.length > 0) {
      const requests = this.favoritesIds.map((id) =>
        this.productServices.getProductById(id)
      );
      forkJoin(requests).subscribe({
        next: (products) => {
          this.favoriteItems = products;
          console.log('Loaded favorite products:', this.favoriteItems);
        },
        error: (err) => {
          console.error('Error loading favorite products', err);
          this.favoriteItems = [];
        },
      });
    } else {
      this.favoriteItems = [];
    }
  }

  removeFromFavorites(item: IProducts): void {
    const element = document.getElementById(`favorite-item-${item.id}`);
    if (element) {
      element.classList.add('removing');
    }

    this.favoritesService.removeFromFavorites(item.id).subscribe({
      next: (updatedFavorites) => {
        console.log(
          'Favorite removed successfully, updated list:',
          updatedFavorites
        );
        // After fade-out effect completes, remove from array
        setTimeout(() => {
          this.favoriteItems = this.favoriteItems.filter(
            (fav) => fav.id !== item.id
          );
        }, 500); // Match the duration of the fade-out
      },
      error: (error) => {
        console.error('Failed to remove favorite:', error);
        // Remove the 'removing' class if there was an error
        if (element) {
          element.classList.remove('removing');
        }
      },
    });
  }

  clearAllFavorites(): void {
    this.favoritesService.clearFavorites().subscribe({
      next: () => {
        console.log('All favorites cleared');
        this.favoriteItems = [];
      },
      error: (err) => console.error('Failed to clear favorites:', err),
    });
  }

  ngOnDestroy(): void {
    if (this.favSub) {
      this.favSub.unsubscribe();
    }
  }
}
