import { TestBed } from '@angular/core/testing';

import { MultipleSelectionService } from './multiple-selection.service';

describe('MultipleSelectionService', () => {
  let service: MultipleSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultipleSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
