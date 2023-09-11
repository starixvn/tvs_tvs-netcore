import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterNotParticipateItemComponent } from './filter-not-participate-item.component';

describe('FilterNotParticipateItemComponent', () => {
  let component: FilterNotParticipateItemComponent;
  let fixture: ComponentFixture<FilterNotParticipateItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterNotParticipateItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterNotParticipateItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
