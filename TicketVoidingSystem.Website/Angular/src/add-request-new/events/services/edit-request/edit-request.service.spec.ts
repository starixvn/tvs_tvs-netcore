import { TestBed } from '@angular/core/testing';

import { EditRequestServiceTsService } from './edit-request.service';

describe('EditRequestServiceTsService', () => {
  let service: EditRequestServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditRequestServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
