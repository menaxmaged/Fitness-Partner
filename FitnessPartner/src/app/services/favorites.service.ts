import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private favoritesKeyPrefix = 'favorites_';
  private currentUserId: string | null = null;
  private favoritesSubject = new BehaviorSubject<any[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  constructor() {}

  private getStorageKey(): string {
    return this.currentUserId ? `${this.favoritesKeyPrefix}${this.currentUserId}` : '';
  }

  private getFavoritesFromStorage(): any[] {
    const key = this.getStorageKey();
    const storedFavorites = key ? localStorage.getItem(key) : null;
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  }

  private updateFavorites(favorites: any[]): void {
    const key = this.getStorageKey();
    if (key) {
      localStorage.setItem(key, JSON.stringify(favorites));
      this.favoritesSubject.next(favorites);
    }
  }

  initializeForUser(userId: string): void {
    this.currentUserId = userId;
    const favorites = this.getFavoritesFromStorage();
    this.favoritesSubject.next(favorites);
  }

  clearUserData(): void {
    this.currentUserId = null;
    this.favoritesSubject.next([]);
  }

  getFavorites(): any[] {
    return [...this.favoritesSubject.value]; 
  }

  getFavoritesCount(): number {
    return this.favoritesSubject.value.length;
  }

  clearFavorites(): void {
    this.updateFavorites([]);
  }

  addToFavorites(product: any): void {
    if (!this.currentUserId) return;
    
    const current = this.getFavorites();
    if (!current.some(item => item.id === product.id)) {
      this.updateFavorites([...current, product]);
    }
  }

  removeFromFavorites(productId: number): void {
    if (!this.currentUserId) return;
    
    const current = this.getFavorites();
    this.updateFavorites(current.filter(item => item.id !== productId));
  }

  isFavorite(productId: number): boolean {
    return this.getFavorites().some(item => item.id === productId);
  }

  toggleFavorite(product: any): void {
    this.isFavorite(product.id) 
      ? this.removeFromFavorites(product.id)
      : this.addToFavorites(product);
  }
}