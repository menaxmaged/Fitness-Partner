import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FavoritesService } from '../services/favorites.service';

@Component({
  selector: 'app-profile',
  imports: [RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  constructor(
    private favoritesService: FavoritesService,
    private router: Router
  ) {}
  logout() {
    localStorage.removeItem('token');
    this.favoritesService.clearUserData();
    this.router.navigate(['/login']);
  }
}
