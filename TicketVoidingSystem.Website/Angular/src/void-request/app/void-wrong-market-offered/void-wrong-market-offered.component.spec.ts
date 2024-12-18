import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidWrongMarketOfferedComponent } from './void-wrong-market-offered.component';

describe('VoidWrongMarketOfferedComponent', () => {
  let component: VoidWrongMarketOfferedComponent;
  let fixture: ComponentFixture<VoidWrongMarketOfferedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoidWrongMarketOfferedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoidWrongMarketOfferedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
