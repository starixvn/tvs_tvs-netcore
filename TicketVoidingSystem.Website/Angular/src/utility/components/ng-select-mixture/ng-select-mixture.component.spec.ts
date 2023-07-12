import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgSelectMixtureComponent } from './ng-select-mixture.component';

describe('NgSelectMixtureComponent', () => {
  let component: NgSelectMixtureComponent;
  let fixture: ComponentFixture<NgSelectMixtureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgSelectMixtureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgSelectMixtureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
