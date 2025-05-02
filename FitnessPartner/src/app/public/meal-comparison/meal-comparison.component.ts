// meal-comparison.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface MealPlan {
  type: string;
  calorieRange: string;
  carbs: number;
  protein: number;
  fat: number;
  imageUrl: string;
}

@Component({
  selector: 'app-meal-comparison',
  imports: [CommonModule, TranslateModule],
  templateUrl: './meal-comparison.component.html',
  styleUrls: ['./meal-comparison.component.css'],
})
export class MealComparisonComponent {
  mealPlans: MealPlan[] = [
    {
      type: 'LITE',
      calorieRange: '1200-1400',
      carbs: 30,
      protein: 30,
      fat: 18,
      imageUrl: 'assets/liteMeal.jpeg',
    },
    {
      type: 'ACTIVE',
      calorieRange: '1500-1700',
      carbs: 38,
      protein: 38,
      fat: 22,
      imageUrl: 'assets/activeMeal.webp',
    },
    {
      type: 'INTENSE',
      calorieRange: '1800-2000',
      carbs: 45,
      protein: 45,
      fat: 27,
      imageUrl: 'assets/intenseMeal.jpg',
    },
  ];
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
  }
}
