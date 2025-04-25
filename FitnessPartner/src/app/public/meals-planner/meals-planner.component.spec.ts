import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealsPlannerComponent } from './meals-planner.component';

describe('MealsPlannerComponent', () => {
  let component: MealsPlannerComponent;
  let fixture: ComponentFixture<MealsPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealsPlannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealsPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
