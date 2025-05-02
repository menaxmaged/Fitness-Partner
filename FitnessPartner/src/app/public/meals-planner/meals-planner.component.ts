import { Component, OnInit } from '@angular/core';
import { IMealPlan } from '../../models/i-meal-plan';
import { MealPlannerService } from '../../services/meal-planner.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

@Component({
  selector: 'app-meals-planner',
  imports: [TranslateModule, CommonModule, FormsModule],
  templateUrl: './meals-planner.component.html',
  styleUrl: './meals-planner.component.css',
})
export class MealsPlannerComponent implements OnInit {
  goals: string[] = [
    'Weight Loss',
    'Muscle Gain',
    'High Protein',
    'Balanced Diet',
    'Low Carb',
    'Vegetarian',
    'Keto',
    'Diabetic Friendly',
    'Heart Healthy',
    'Gluten Free',
  ];
  selectedGoal = '';
  plan?: IMealPlan;

  mealKeys: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

  constructor(
    private service: MealPlannerService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {}

  onGoalChange(): void {
    if (!this.selectedGoal) {
      this.plan = undefined;
      return;
    }
    this.service
      .getByTarget(this.selectedGoal)
      .subscribe((p) => (this.plan = p));
  }
}
