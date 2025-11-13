import { TestBed } from '@angular/core/testing';

import { AddRemarkService } from './add-remark.service';

describe('AddRemarkService', () => {
  let service: AddRemarkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddRemarkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
