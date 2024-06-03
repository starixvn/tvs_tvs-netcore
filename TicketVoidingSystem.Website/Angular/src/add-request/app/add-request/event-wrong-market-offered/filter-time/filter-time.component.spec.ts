import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTimeComponent } from './filter-time.component';

describe('FilterTimeComponent', () => {
  let component: FilterTimeComponent;
  let fixture: ComponentFixture<FilterTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
