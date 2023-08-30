import { TestBed } from '@angular/core/testing';

import { TicketsServiceService } from './tickets.service';

describe('TicketsServiceService', () => {
  let service: TicketsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
