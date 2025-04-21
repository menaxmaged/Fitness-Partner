import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyFatCalculatorComponent } from './body-fat-calculator.component';

describe('BodyFatCalculatorComponent', () => {
  let component: BodyFatCalculatorComponent;
  let fixture: ComponentFixture<BodyFatCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodyFatCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodyFatCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
