// src/app/services/favorites.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private apiUrl = 'http://localhost:3000/favorites';
  private favoritesSubject = new BehaviorSubject<any[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /** Get headers with Authorization token */
  private getHeaders() {
    const token = this.authService.getToken(); // Get the token from AuthService
    console.log(this.authService.getToken());

    return token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders();
      
  }

  /** Fetch the user's favorites from the backend */
  initialize(): void {
    this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() }).subscribe({
      next: (list) => this.favoritesSubject.next(list),
      error: (err) => {
        console.error('Failed to load favorites:', err);
        this.favoritesSubject.next([]);
      },
    });
  }

  /** Clear in-memory favorites (e.g. on logout) */
  clearUserData(): void {
    this.favoritesSubject.next([]);
  }

  /** Remove all favorites via backend */
  clearFavorites(): void {
    this.http
      .delete(this.apiUrl, { headers: this.getHeaders() })
      .subscribe({
        next: () => this.favoritesSubject.next([]),
        error: (err) => console.error('Failed to clear favorites:', err),
      });
  }

  /** Add a product to favorites */
  addToFavorites(product: any): void {
    this.http
      .post(`${this.apiUrl}/${product.id}`, null, { headers: this.getHeaders() })
      .subscribe({
        next: () => {
          const current = this.favoritesSubject.value;
          if (!current.some((i) => i.id === product.id)) {
            this.favoritesSubject.next([...current, product]);
          }
        },
        error: (err) => console.error('Failed to add to favorites:', err),
      });
  }

  /** Remove a product from favorites */
  removeFromFavorites(productId: number | string): void {
    this.http
      .delete(`${this.apiUrl}/${productId}`, { headers: this.getHeaders() })
      .subscribe({
        next: () => {
          const current = this.favoritesSubject.value;
          this.favoritesSubject.next(
            current.filter((i) => i.id !== productId)
          );
        },
        error: (err) => console.error('Failed to remove favorite:', err),
      });
  }

  /** Check if a product is in favorites */
  isFavorite(productId: number | string): boolean {
    return this.favoritesSubject.value.some((i) => i.id === productId);
  }

  /** Toggle favorite state */
  toggleFavorite(product: any): void {
    this.isFavorite(product.id)
      ? this.removeFromFavorites(product.id)
      : this.addToFavorites(product);
  }
}
