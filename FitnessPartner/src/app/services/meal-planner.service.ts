import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { IMealPlan } from './../models/i-meal-plan';

@Injectable({
  providedIn: 'root',
})
export class MealPlannerService {
  private jsonUrl = 'http://localhost:3000/meal_plans';
  constructor(private http: HttpClient) {}

  getAll(): Observable<IMealPlan[]> {
    return this.http.get<IMealPlan[]>(this.jsonUrl);
  }

  getByTarget(goal: string): Observable<IMealPlan | undefined> {
    return this.getAll().pipe(
      map(plans =>
        plans.find(p => p.target.toLowerCase() === goal.toLowerCase())
      )
    );
  }
}
