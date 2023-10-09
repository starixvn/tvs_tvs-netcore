import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateMessageComponent } from './template-message.component';

describe('TemplateMessageComponent', () => {
  let component: TemplateMessageComponent;
  let fixture: ComponentFixture<TemplateMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
