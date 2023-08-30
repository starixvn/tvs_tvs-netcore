import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidRedCardComponent } from './void-red-card.component';

describe('VoidRedCardComponent', () => {
  let component: VoidRedCardComponent;
  let fixture: ComponentFixture<VoidRedCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoidRedCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoidRedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
