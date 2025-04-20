import { TestBed } from '@angular/core/testing';

import { TrainersDataService } from './trainers-data.service';

describe('TrainersDataService', () => {
  let service: TrainersDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainersDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
