import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanningAutoVoidComponent } from './scanning-auto-void.component';

describe('ScanningAutoVoidComponent', () => {
  let component: ScanningAutoVoidComponent;
  let fixture: ComponentFixture<ScanningAutoVoidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanningAutoVoidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanningAutoVoidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
