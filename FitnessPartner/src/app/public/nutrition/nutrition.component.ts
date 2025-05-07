import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import { BodyFatCalculatorComponent } from '../body-fat-calculator/body-fat-calculator.component';
import { Nutrient } from '../../models/nutrient.model';
import { CommonModule } from '@angular/common';
import { FoodNutritionComponent } from '../food-nutrition/food-nutrition.component';
import { MealComparisonComponent } from '../meal-comparison/meal-comparison.component';
import { MealsPlannerComponent } from '../meals-planner/meals-planner.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DietFormComponent } from "../../diet-form/diet-form.component";

@Component({
  selector: 'app-nutrition',
  imports: [
    TranslateModule,
    // BodyFatCalculatorComponent,
    CommonModule,
    MealComparisonComponent,
    FoodNutritionComponent,
    MealsPlannerComponent,
    RouterModule,
    DietFormComponent
],
  templateUrl: './nutrition.component.html',
  styleUrl: './nutrition.component.css',
})
export class NutritionComponent implements OnInit {
  nutrients: Nutrient[] = [
    {
      id: 1,
      title: 'Carbohydrates',
      description:
        'The type of carbohydrate you eat is more important than the amount',
      image: '/assets/carbohydrates.jpg',
    },
    {
      id: 2,
      title: 'Protein',
      description:
        'Protein is essential macronutrient, but not all food sources are created equal',
      image: '/assets/proteins.jpg',
    },
    {
      id: 3,
      title: 'Fats and Cholesterol',
      description:
        'When it comes to dietary fat, what matters most is the type of fat you eat',
      image: '/assets/fatsAndCholesterol.jpg',
    },
  ];

  constructor(
    private router: Router,
    private activRoute: ActivatedRoute,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit() {
    this.activRoute.fragment.subscribe((fragment) => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  goToDetails(nutrient: Nutrient) {
    this.router.navigate(['/nutrient', nutrient.id]);
  }
}
