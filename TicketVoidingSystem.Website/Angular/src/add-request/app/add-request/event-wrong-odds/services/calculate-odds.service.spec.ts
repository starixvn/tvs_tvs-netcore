import { TestBed } from '@angular/core/testing';

import { CalculateOddsService } from './calculate-odds.service';

describe('CalculateOddsService', () => {
  let service: CalculateOddsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculateOddsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
