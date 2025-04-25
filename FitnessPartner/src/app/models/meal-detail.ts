import { FoodItem } from './food-item';
export interface MealDetail {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  items: FoodItem[];
}
