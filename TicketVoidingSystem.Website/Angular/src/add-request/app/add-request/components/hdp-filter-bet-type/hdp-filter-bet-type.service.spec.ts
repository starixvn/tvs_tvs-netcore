import { TestBed } from '@angular/core/testing';

import { HdpFilterBetTypeService } from './hdp-filter-bet-type.service';

describe('HdpFilterBetTypeService', () => {
  let service: HdpFilterBetTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HdpFilterBetTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
