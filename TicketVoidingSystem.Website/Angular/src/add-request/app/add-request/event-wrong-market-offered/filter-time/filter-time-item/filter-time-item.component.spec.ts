import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTimeItemComponent } from './filter-time-item.component';

describe('FilterTimeItemComponent', () => {
  let component: FilterTimeItemComponent;
  let fixture: ComponentFixture<FilterTimeItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterTimeItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterTimeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
