import { TestBed } from '@angular/core/testing';

import { SubmitVoidService } from './submit-void.service';

describe('SubmitVoidService', () => {
  let service: SubmitVoidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubmitVoidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
