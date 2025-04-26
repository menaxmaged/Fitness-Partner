import { MealDetail } from './meal-detail';
export interface IMealPlan {
  id: number;
  target: string;
  plan: {
    breakfast: MealDetail;
    lunch: MealDetail;
    dinner: MealDetail;
    snack: MealDetail;
  };
}
