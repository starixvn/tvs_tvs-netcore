import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageAreaComponent } from './message-area.component';

describe('MessageAreaComponent', () => {
  let component: MessageAreaComponent;
  let fixture: ComponentFixture<MessageAreaComponent>;
  
  beforeEach(() => {
    fixture = TestBed.createComponent(MessageAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
