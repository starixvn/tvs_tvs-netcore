import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckingPermissionComponent } from './checking-permission.component';

describe('CheckingPermissionComponent', () => {
  let component: CheckingPermissionComponent;
  let fixture: ComponentFixture<CheckingPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckingPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckingPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
