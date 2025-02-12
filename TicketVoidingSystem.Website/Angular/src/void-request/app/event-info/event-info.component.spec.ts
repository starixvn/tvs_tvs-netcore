
import { EventInfoComponent } from './event-info.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('EventInfoComponent', () => {
    let component: EventInfoComponent;
    let fixture: ComponentFixture<EventInfoComponent>;
    beforeEach(async () => {
      fixture = TestBed.createComponent(EventInfoComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
});
