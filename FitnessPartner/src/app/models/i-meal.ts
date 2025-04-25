import {INutrition } from './i-nutrition';
export interface IMeal {
  id: number;
  title: string;
  description: string;
  nutrition: INutrition;
  images: string[];
}
