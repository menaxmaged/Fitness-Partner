import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FavoritesService } from '../services/favorites.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-profile',
  imports: [RouterModule, TranslateModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  constructor(
    private favoritesService: FavoritesService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
  }
  logout() {
    localStorage.removeItem('token');
    this.favoritesService.clearUserData();
    this.router.navigate(['/login']);
  }
}
