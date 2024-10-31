import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterOtherIssuesComponent } from './filter-other-issues.component';

describe('FilterOtherIssuesComponent', () => {
  let component: FilterOtherIssuesComponent;
  let fixture: ComponentFixture<FilterOtherIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterOtherIssuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterOtherIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
