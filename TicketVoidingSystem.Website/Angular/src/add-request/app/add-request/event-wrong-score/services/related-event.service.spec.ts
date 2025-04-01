import { TestBed } from '@angular/core/testing';

import { RelatedEventService } from './related-event.service';

describe('RelatedEventService', () => {
  let service: RelatedEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelatedEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
