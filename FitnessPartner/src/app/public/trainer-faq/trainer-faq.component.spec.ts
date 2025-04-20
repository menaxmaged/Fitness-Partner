import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerFAQComponent } from './trainer-faq.component';

describe('TrainerFAQComponent', () => {
  let component: TrainerFAQComponent;
  let fixture: ComponentFixture<TrainerFAQComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainerFAQComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainerFAQComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
