import { TestBed } from '@angular/core/testing';

import { VoidPageService } from './void-page.service';

describe('VoidPageService', () => {
  let service: VoidPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoidPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
