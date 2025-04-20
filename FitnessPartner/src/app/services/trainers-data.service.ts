import { Injectable } from '@angular/core';
import { ITrainer } from '../models/i-trainer';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrainersDataService {
  private apiUrl = 'http://localhost:3000/trainers';
  constructor(private http: HttpClient) {}
  getAllTrainers(): Observable<ITrainer[]> {
    return this.http.get<ITrainer[]>(this.apiUrl);
  }
  getTrainerById(id: number) {
    return this.http.get<ITrainer>(`http://localhost:3000/trainers/${id}`);
  }
}
