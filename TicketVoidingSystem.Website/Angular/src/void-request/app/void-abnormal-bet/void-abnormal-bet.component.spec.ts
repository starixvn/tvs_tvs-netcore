import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidAbnormalBetComponent } from './void-abnormal-bet.component';

describe('VoidAbnormalBetComponent', () => {
  let component: VoidAbnormalBetComponent;
  let fixture: ComponentFixture<VoidAbnormalBetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoidAbnormalBetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoidAbnormalBetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
