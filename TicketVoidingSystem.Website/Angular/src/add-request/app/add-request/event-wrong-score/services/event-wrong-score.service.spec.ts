import { TestBed } from '@angular/core/testing';

import { EventWrongScoreService } from './event-wrong-score.service';

describe('EventWrongScoreService', () => {
  let service: EventWrongScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventWrongScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
