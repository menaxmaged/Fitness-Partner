import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../shared/utils/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Helper method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  editUserData(userId: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}`, userData, {
      headers: this.getAuthHeaders(),
    });
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, {
      headers: this.getAuthHeaders(),
    });
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  addANewUser(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

  updateUser(id: string, userData: any): Observable<any> {
    const headers =
      userData instanceof FormData
        ? new HttpHeaders({
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          })
        : new HttpHeaders({
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          });

    return this.http.put(`${this.apiUrl}/users/${id}`, userData, { headers });
  }

  getUserPassword(userId: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/users/${userId}/password`);
  }

  updatePassword(
    userId: string,
    passwordData: { currentPassword: string; newPassword: string }
  ): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(
      `${this.apiUrl}/users/${userId}/password`,
      passwordData,
      { headers }
    );
  }

  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/verify-otp`, {
      email,
      otp,
    });
  }

  resendOtp(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/resend-otp`, { email });
  }

  addOrder(userId: string, order: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/users/${userId}/orders`,
      order,
      { headers: this.getAuthHeaders() }
    );
  }
}
