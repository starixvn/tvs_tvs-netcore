import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterVoidComponent } from './after-void.component';

describe('AfterVoidComponent', () => {
  let component: AfterVoidComponent;
  let fixture: ComponentFixture<AfterVoidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfterVoidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AfterVoidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
