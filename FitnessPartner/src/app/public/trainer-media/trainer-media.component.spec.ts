import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerMediaComponent } from './trainer-media.component';

describe('TrainerMediaComponent', () => {
  let component: TrainerMediaComponent;
  let fixture: ComponentFixture<TrainerMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainerMediaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainerMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
