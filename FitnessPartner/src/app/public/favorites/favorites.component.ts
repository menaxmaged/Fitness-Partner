import { Component, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../services/favorites.service';
import { UsersService } from '../../services/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favorites-items',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnDestroy {
  favoriteItems: any[] = [];
  private favoritesSub: Subscription;

  constructor(
    private myFavorites: FavoritesService,
    private usersService: UsersService
  ) {
    const token = localStorage.getItem('token');
    const userId = token ? atob(token) : null;
    
    if (userId) {
      this.myFavorites.initializeForUser(userId);
    }

    this.favoritesSub = this.myFavorites.favorites$.subscribe(favorites => {
      this.favoriteItems = favorites;
      console.log('Favorites component updated:', favorites);
    });
  }

  removeFromFavorites(product: any) {
    this.myFavorites.removeFromFavorites(product.id);
  }

  clearAllFavorites() {
    this.myFavorites.clearFavorites();
  }

  ngOnDestroy() {
    this.favoritesSub.unsubscribe();
  }
}