import { TestBed } from '@angular/core/testing';

import { FoodNutritionService } from './food-nutrition.service';

describe('FoodNutritionService', () => {
  let service: FoodNutritionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoodNutritionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
