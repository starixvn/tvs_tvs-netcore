import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterWrongOddsSportsBookComponent } from './filter-wrong-odds-sports-book.component';

describe('FilterWrongOddsSportsBookComponent', () => {
  let component: FilterWrongOddsSportsBookComponent;
  let fixture: ComponentFixture<FilterWrongOddsSportsBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterWrongOddsSportsBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterWrongOddsSportsBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
