import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private favoritesKey = 'favorites';
  private favoriteItems: any[] = this.getFavoritesFromStorage();
  private favoritesSubject = new BehaviorSubject<any[]>(this.favoriteItems);
  favorites$ = this.favoritesSubject.asObservable();

  constructor() {}

  private getFavoritesFromStorage(): any[] {
    const storedFavorites = localStorage.getItem(this.favoritesKey);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  }

  private saveFavoritesToStorage(favorites: any[]): void {
    localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
  }

  getFavorites(): any[] {
    return this.favoriteItems;
  }

  getFavoritesCount(): number {
    return this.favoriteItems.length;
  }

  clearFavorites(): void {
    this.favoriteItems = [];
    this.saveFavoritesToStorage(this.favoriteItems);
    this.favoritesSubject.next([...this.favoriteItems]);
  }

  addToFavorites(product: any): void {
    const isFavorite = this.favoriteItems.some(item => item.id === product.id);

    if (!isFavorite) {
      this.favoriteItems.push({ ...product });
      this.saveFavoritesToStorage(this.favoriteItems);
      this.favoritesSubject.next([...this.favoriteItems]);
    }
  }

  removeFromFavorites(productId: number): void {
    this.favoriteItems = this.favoriteItems.filter(item => item.id !== productId);
    this.saveFavoritesToStorage(this.favoriteItems);
    this.favoritesSubject.next([...this.favoriteItems]);
  }

  isFavorite(productId: number): boolean {
    return this.favoriteItems.some(item => item.id === productId);
  }

  toggleFavorite(product: any): void {
    if (this.isFavorite(product.id)) {
      this.removeFromFavorites(product.id);
    } else {
      this.addToFavorites(product);
    }
  }
}