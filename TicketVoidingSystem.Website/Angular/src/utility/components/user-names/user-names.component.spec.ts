import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UsernamesComponent } from './user-names.component';

describe('UserNamesComponent', () => {
  let component: UsernamesComponent;
  let fixture: ComponentFixture<UsernamesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UsernamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsernamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
