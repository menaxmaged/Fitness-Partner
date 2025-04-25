import { TestBed } from '@angular/core/testing';

import { MealPlannerService } from './meal-planner.service';

describe('MealPlannerService', () => {
  let service: MealPlannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MealPlannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
