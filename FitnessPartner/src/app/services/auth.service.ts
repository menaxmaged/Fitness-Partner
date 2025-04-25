// ////////////////// TESTING BACKEND BELOW //////////////////////// ORIGINAL CODE ABOVE //// DO NOT DELETE ///////
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(
    !!localStorage.getItem('token') || !!localStorage.getItem('access_token')
  );
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient, private router: Router) {
    // Check token validity on service initialization
    this.checkTokenValidity();
  }

  private checkTokenValidity() {
    const token = this.getToken();
    if (token) {
      // You can add token validation logic here if needed
      this.isLoggedInSubject.next(true);
    } else {
      this.isLoggedInSubject.next(false);
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        // Only store credentials if login was successful (not requiring verification)
        if (response.access_token && !response.requiresVerification) {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('userId', response.user.id);
          this.isLoggedInSubject.next(true);
        }
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  setCurrentUserId(userId: string): void {
    localStorage.setItem('userId', userId);
    this.isLoggedInSubject.next(true);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((response: any) => {
        if (response.access_token) {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('userId', response.user.id);
          this.isLoggedInSubject.next(true);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('userId');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  getCurrentUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getToken(): string | null {
    return (
      localStorage.getItem('token') || localStorage.getItem('access_token')
    );
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  // Method to check if user is authenticated, can be used in route guards
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
