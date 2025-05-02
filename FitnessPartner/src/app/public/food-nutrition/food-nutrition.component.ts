import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  FoodNutritionService,
  FoodItem,
} from '../../services/food-nutrition.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-food-nutrition',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './food-nutrition.component.html',
  styleUrl: './food-nutrition.component.css',
})
export class FoodNutritionComponent implements OnInit {
  foodList: FoodItem[] = [];
  searchTerm: string = '';

  constructor(
    private nutritionService: FoodNutritionService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.nutritionService.getAllFoods().subscribe((data) => {
      this.foodList = data;
    });
  }

  filteredFoods(): FoodItem[] {
    if (!this.searchTerm.trim()) return this.foodList;
    return this.foodList.filter((item) =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
