import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseeAffectedListComponent } from './licensee-affected-list.component';

describe('LicenseeAffectedListComponent', () => {
  let component: LicenseeAffectedListComponent;
  let fixture: ComponentFixture<LicenseeAffectedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicenseeAffectedListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseeAffectedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
