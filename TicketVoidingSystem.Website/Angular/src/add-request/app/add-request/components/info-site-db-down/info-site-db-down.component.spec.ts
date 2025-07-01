import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSiteDBDownComponent } from './info-site-db-down.component';

describe('InfoSiteDBDownComponent', () => {
  let component: InfoSiteDBDownComponent;
  let fixture: ComponentFixture<InfoSiteDBDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoSiteDBDownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoSiteDBDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
