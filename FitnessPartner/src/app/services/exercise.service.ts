import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ExerciseService {
  private homeExercises = 'http://localhost:3200/home';
  private gymExercises = 'http://localhost:3200/gym';


  constructor(private http: HttpClient) {}

  getHomeExercises(type: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.homeExercises}?type=${type}`);
  }

  getGymExercises(type: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.gymExercises}?type=${type}`);
  }
}
