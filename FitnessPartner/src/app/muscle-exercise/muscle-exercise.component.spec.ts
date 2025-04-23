import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuscleExerciseComponent } from './muscle-exercise.component';

describe('MuscleExerciseComponent', () => {
  let component: MuscleExerciseComponent;
  let fixture: ComponentFixture<MuscleExerciseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MuscleExerciseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MuscleExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
