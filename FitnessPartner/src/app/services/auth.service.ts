////////////////// TESTING BACKEND BELOW //////////////////////// ORIGINAL CODE ABOVE //// DO NOT DELETE ///////
// auth.service.ts in Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(
    !!localStorage.getItem('token')
  );
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        // Only store credentials if login was successful (not requiring verification)
        if (response.access_token && !response.requiresVerification) {
          localStorage.setItem('token', response.access_token);
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
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('userId', response.user.id);
        this.isLoggedInSubject.next(true);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.isLoggedInSubject.next(false);
  }

  getCurrentUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
