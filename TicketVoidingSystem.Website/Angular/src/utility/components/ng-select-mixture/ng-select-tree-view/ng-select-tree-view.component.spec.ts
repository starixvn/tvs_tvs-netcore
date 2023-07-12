import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgSelectTreeViewComponent } from './ng-select-tree-view.component';

describe('NgSelectTreeViewComponent', () => {
  let component: NgSelectTreeViewComponent;
  let fixture: ComponentFixture<NgSelectTreeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgSelectTreeViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgSelectTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
