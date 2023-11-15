import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailNotParticipateComponent } from './detail-not-participate.component';

describe('LogInfoDetailComponent', () => {
  let component: DetailNotParticipateComponent;
  let fixture: ComponentFixture<DetailNotParticipateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailNotParticipateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailNotParticipateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
