import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainLogInfoComponent } from './main-log-info.component';

describe('MainLogInfoComponent', () => {
  let component: MainLogInfoComponent;
  let fixture: ComponentFixture<MainLogInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLogInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainLogInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
