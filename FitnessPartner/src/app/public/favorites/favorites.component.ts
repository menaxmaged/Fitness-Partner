import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-favorites-items',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './favorites.component.html',
  styleUrl:'./favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  favoriteItems: any[] = [];
  
  constructor(private myFavorites: FavoritesService) {}
  
  ngOnInit() {
    this.myFavorites.favorites$.subscribe((favorites) => {
      this.favoriteItems = favorites;
    });
    
    this.favoriteItems = this.myFavorites.getFavorites();
  }
  
  addToFavorites(product: any) {
    this.myFavorites.addToFavorites(product);
  }
  
  removeFromFavorites(product: any) {
    this.myFavorites.removeFromFavorites(product.id);
    console.log('Item removed from favorites:', product.name);
  }
  
  clearAllFavorites() {
    this.myFavorites.clearFavorites();
    console.log('All favorites cleared');
  }
}
//   ngOnDestroy() {
//     if (this.subscription) {
//       this.subscription.unsubscribe();
//     }
//   }

//   removeFavorite(productId: number) {
//     this.favoritesService.removeFromFavorites(productId);
//   }
// }