import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TvDetectionComponent } from './tv-detection.component';

describe('TvDetectionComponent', () => {
  let component: TvDetectionComponent;
  let fixture: ComponentFixture<TvDetectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TvDetectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TvDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
