import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterNotParticipateComponent } from './filter-not-participate.component';

describe('FilterNotParticipateComponent', () => {
  let component: FilterNotParticipateComponent;
  let fixture: ComponentFixture<FilterNotParticipateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterNotParticipateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterNotParticipateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
