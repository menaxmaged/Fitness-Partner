import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodNutritionComponent } from './food-nutrition.component';

describe('FoodNutritionComponent', () => {
  let component: FoodNutritionComponent;
  let fixture: ComponentFixture<FoodNutritionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodNutritionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodNutritionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
