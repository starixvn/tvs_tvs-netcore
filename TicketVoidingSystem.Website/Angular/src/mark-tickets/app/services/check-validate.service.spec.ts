import { TestBed } from '@angular/core/testing';

import { CheckValidateService } from './check-validate.service';

describe('CheckValidateService', () => {
  let service: CheckValidateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckValidateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
