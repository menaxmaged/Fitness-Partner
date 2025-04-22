import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-favorites',
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];

  ngOnInit() {
    this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  }

  removeFavorite(productId: number) {
    this.favorites = this.favorites.filter(p => p.id !== productId);
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }
}
