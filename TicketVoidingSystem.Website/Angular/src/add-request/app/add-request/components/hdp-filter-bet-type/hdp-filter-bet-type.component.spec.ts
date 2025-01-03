import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HdpFilterBetTypeComponent } from './hdp-filter-bet-type.component';

describe('HdpFilterBetTypeComponent', () => {
  let component: HdpFilterBetTypeComponent;
  let fixture: ComponentFixture<HdpFilterBetTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HdpFilterBetTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HdpFilterBetTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
