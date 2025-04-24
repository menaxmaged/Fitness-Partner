import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FoodItem {
  id: number;
  name: string;
  image: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}
@Injectable({
  providedIn: 'root',
})
export class FoodNutritionService {
  private dataUrl = 'http://localhost:3000/foods';

  constructor(private http: HttpClient) {}

  getAllFoods(): Observable<FoodItem[]> {
    return this.http.get<FoodItem[]>(this.dataUrl);
  }

  getFoodById(id: number): Observable<FoodItem | undefined> {
    return new Observable((observer) => {
      this.getAllFoods().subscribe((foods) => {
        const food = foods.find((f) => f.id === id);
        observer.next(food);
        observer.complete();
      });
    });
  }
}
