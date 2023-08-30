import { TestBed } from '@angular/core/testing';

import { EventRedCardService } from './event-red-card.service';

describe('RelatedEventsService', () => {
  let service: EventRedCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventRedCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
