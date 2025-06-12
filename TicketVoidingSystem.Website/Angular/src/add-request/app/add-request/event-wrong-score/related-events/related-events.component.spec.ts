import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedEventsComponent } from './related-events.component';

describe('RelatedEventsComponent', () => {
  let component: RelatedEventsComponent;
  let fixture: ComponentFixture<RelatedEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatedEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatedEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
