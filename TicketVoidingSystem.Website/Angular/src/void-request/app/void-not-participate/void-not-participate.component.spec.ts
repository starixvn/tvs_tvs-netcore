import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidNotParticipateComponent } from './void-not-participate.component';

describe('VoidNotParticipateComponent', () => {
  let component: VoidNotParticipateComponent;
  let fixture: ComponentFixture<VoidNotParticipateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoidNotParticipateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoidNotParticipateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
