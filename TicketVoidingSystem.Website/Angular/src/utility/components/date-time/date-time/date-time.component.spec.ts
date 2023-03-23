import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DateTimeComponent } from './date-time.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('DateTimeComponent', () => {
  let component: DateTimeComponent;
  let fixture: ComponentFixture<DateTimeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DateTimeComponent ],
      imports: [
        FormsModule,
        NgbModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateTimeComponent);
    component = fixture.componentInstance;
  });

  it('ngOnInit', () => {
     // Arrange
     component.model.hour = undefined;
     // Action and Assert
     component.ngOnInit();
     expect(component.model).toBeDefined();
  });

  it('Update model', () => {
    // Arrange
    component.ngOnInit();
    spyOn(component.modelChange, 'emit');
    // Action and Assert
    component.updateModel();
    expect(component.modelChange.emit).toHaveBeenCalledWith(component.model);
  });
});
