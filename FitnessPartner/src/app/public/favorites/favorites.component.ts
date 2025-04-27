// import { Component, OnDestroy } from '@angular/core';
// import { RouterModule } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { FavoritesService } from '../../services/favorites.service';
// import { UsersService } from '../../services/users.service';
// import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-favorites-items',
//   standalone: true,
//   imports: [RouterModule, CommonModule],
//   templateUrl: './favorites.component.html',
//   styleUrl: './favorites.component.css'
// })
// export class FavoritesComponent implements OnDestroy {
//   favoriteItems: any[] = [];
//   private favoritesSub: Subscription;
//   loading: boolean = true;  // To track loading state

//   constructor(
//     private myFavorites: FavoritesService,
//     private usersService: UsersService
//   ) {
//     const token = localStorage.getItem('token');
//     const userId = token ? atob(token) : null;
    
//     if (userId) {
//       this.myFavorites.initializeForUser(userId);
//     }

//     this.favoritesSub = this.myFavorites.favorites$.subscribe(favorites => {
//       this.favoriteItems = favorites;
//       this.loading = false;  // Set loading to false when data is fetched
//       console.log('Favorites component updated:', favorites);
//     });
//   }

//   removeFromFavorites(product: any) {
//     this.myFavorites.removeFromFavorites(product.id);
//   }

//   clearAllFavorites() {
//     this.myFavorites.clearFavorites();
//   }

//   ngOnDestroy() {
//     this.favoritesSub.unsubscribe();
//   }
// }
// src/app/components/favorites/favorites.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FavoritesService } from '../../services/favorites.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  imports:[CommonModule],
  selector: 'app-favorites-items',
  standalone: true,
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favoriteItems: any[] = [];
  private favSub!: Subscription;
  loading: boolean = true;
  constructor(private favoritesService: FavoritesService) {}

  ngOnInit() {
    this.favSub = this.favoritesService.favorites$.subscribe(list => {
      this.loading = false;
      this.favoriteItems = list;
    });
  }

  removeFromFavorites(item: any) {
    this.favoritesService.removeFromFavorites(item.id);
  }

  clearAllFavorites() {
    this.favoritesService.clearFavorites();
  }

  ngOnDestroy() {
    this.favSub.unsubscribe();
  }
}


