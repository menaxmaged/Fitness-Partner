import { Injectable } from '@angular/core';
import { ITrainer } from '../models/i-trainer';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TrainersDataService {
  private apiUrl = 'http://localhost:3000/trainers';

  constructor(
    private http: HttpClient,
    private router: Router // Add Router injection
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`
    });
  }

  getAllTrainers(): Observable<ITrainer[]> {
    return this.http.get<ITrainer[]>(this.apiUrl, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Error loading trainers:', error);
        return throwError(() => error);
      })
    );
  }

  getTrainerById(id: number): Observable<ITrainer> {
    return this.http.get<ITrainer>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  deleteTrainer(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  addTrainer(trainerData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, trainerData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        if (error.status === 401) {
          alert('Session expired. Please login again.');
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}