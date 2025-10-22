import { TestBed } from '@angular/core/testing';

import { FilterWrongOuService } from './filter-wrong-ou.service';

describe('FilterWrongOuService', () => {
  let service: FilterWrongOuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterWrongOuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
