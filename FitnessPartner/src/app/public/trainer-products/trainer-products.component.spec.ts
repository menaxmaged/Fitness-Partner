import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerProductsComponent } from './trainer-products.component';

describe('TrainerProductsComponent', () => {
  let component: TrainerProductsComponent;
  let fixture: ComponentFixture<TrainerProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainerProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainerProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
