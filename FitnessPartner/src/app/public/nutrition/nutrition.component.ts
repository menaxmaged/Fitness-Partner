import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BodyFatCalculatorComponent } from '../body-fat-calculator/body-fat-calculator.component';
import { Nutrient } from '../../models/nutrient.model';
import { CommonModule } from '@angular/common';
import { MealComparisonComponent } from '../meal-comparison/meal-comparison.component';
@Component({
  selector: 'app-nutrition',
  imports: [BodyFatCalculatorComponent, CommonModule, MealComparisonComponent],
  templateUrl: './nutrition.component.html',
  styles: ``,
})
export class NutritionComponent {
  nutrients: Nutrient[] = [
    {
      id: 1,
      title: 'Carbohydrates',
      description:
        'The type of carbohydrate you eat is more important than the amount.',
      image: '/assets/carbohydrates.jpg',
    },
    {
      id: 2,
      title: 'Protein',
      description:
        'Protein is essential macronutrient, but not all food sources are created equal.',
      image: '/assets/proteins.jpg',
    },
    {
      id: 3,
      title: 'Fats and Cholesterol',
      description:
        'When it comes to dietary fat, what matters most is the type of fat you eat.',
      image: '/assets/fatsAndCholesterol.jpg',
    },
  ];

  constructor(private router: Router) {}

  goToDetails(nutrient: Nutrient) {
    this.router.navigate(['/nutrient', nutrient.id]);
  }
}
