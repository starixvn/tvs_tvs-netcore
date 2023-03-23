import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DateFullTimeComponent } from './date-full-time.component';
import { ToolTipModule } from '../../tooltip/tooltip.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Tooltip } from '../../tooltip/tooltip.model';

describe('DateFullTimeComponent', () => {
  let component: DateFullTimeComponent;
  let fixture: ComponentFixture<DateFullTimeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DateFullTimeComponent ],
      imports: [
        ToolTipModule,
        FormsModule,
        NgbModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateFullTimeComponent);
    component = fixture.componentInstance;
  });

  it('ngOnInit', () => {
    // Arrange
    component.model.hour = undefined;
    // Action and Assert
    component.ngOnInit();
    expect(component.model).toBeDefined();
  });

  it('event paste when valid date string', () => {
    // Arrange
    component.ngOnInit();
    spyOn(component.model, 'renderTime');
    spyOn(component, 'validate').and.callThrough();
    const testCases = [
      { date: '11:50:12.222', ignoredMeridiem: true},
      { date: '11:50:12.222 AM', ignoredMeridiem: false}
    ]
    // Action and Assert
    for (const item of testCases) {
      const pasteData = new DataTransfer();
      pasteData.setData('text', item.date);
      const pasteEvent = new ClipboardEvent('paste', {
        clipboardData: pasteData
      } as any);
      component.eventPaste(pasteEvent);
      expect(component.model.renderTime).toHaveBeenCalledWith(item.date, item.ignoredMeridiem);
    }
  });

  it('event paste when invalid date string', () => {
    // Arrange
    component.ngOnInit();
    const dateString = '11:50:12.222 222 AM';
    const pasteData = new DataTransfer();
      pasteData.setData('text', dateString);
      const pasteEvent = new ClipboardEvent('paste', {
        clipboardData: pasteData
      } as any);
    component.tooltip = new Tooltip();
    spyOn(component.tooltip, 'display');
    // Action and Assert
    component.eventPaste(pasteEvent);
    expect(component.tooltip.display).toHaveBeenCalledWith('time', 'Invalid Datetime format. The correct format is "HH:mm:ss.SSS AM/PM"');
  });

  it('Validate', () => {
    // Arrange
    component.ngOnInit();
    component.tooltip = new Tooltip();
    spyOn(component.tooltip, 'display');
    const testCases = [
      { isValidHour: false, isValidMinAndSecond: false, isValidMillisecond: false, isValidMeridiem: false },
      { isValidHour: true, isValidMinAndSecond: false, isValidMillisecond: false, isValidMeridiem: false },
      { isValidHour: true, isValidMinAndSecond: true, isValidMillisecond: false, isValidMeridiem: false },
      { isValidHour: true, isValidMinAndSecond: true, isValidMillisecond: true, isValidMeridiem: false },
      { isValidHour: true, isValidMinAndSecond: true, isValidMillisecond: true, isValidMeridiem: true }
    ];
    // Action and Assert
    testCases.forEach(item => {
      component.isValidHour = jasmine.createSpy().and.returnValue(item.isValidHour);
      component.isValidMinAndSecond = jasmine.createSpy().and.returnValue(item.isValidMinAndSecond);
      component.isValidMillisecond = jasmine.createSpy().and.returnValue(item.isValidMillisecond);
      component.isValidMeridiem = jasmine.createSpy().and.returnValue(item.isValidMeridiem);
      component.validate();
      expect(component.tooltip.display).toHaveBeenCalledWith('time', 'Invalid Datetime format. The correct format is "HH:mm:ss.SSS AM/PM"');
    });
  });

  it('Is valid hour', () => {
    // Arrange
    component.ngOnInit();
    // Action and Assert
    const actualResult = component.isValidHour();
    expect(actualResult).toBe(true);
  });

  it('Is valid min and second', () => {
    // Arrange
    const testCases = [
      { value: '10', expectedResult: true },
      { value: '70', expectedResult: false },
    ];
    let actualResult = true;
    // Action and Assert
    testCases.forEach(item => {
      actualResult = component.isValidMinAndSecond(item.value);
      expect(actualResult).toBe(item.expectedResult);
    })
  });

  it('Is valid milli second', () => {
    // Arrange
    component.ngOnInit();
    // Action and Assert
    const actualResult = component.isValidMillisecond();
    expect(actualResult).toBe(true);
  });

  it('Is valid meridiem', () => {
    // Arrange
    component.ngOnInit();
    // Action and Assert
    const actualResult = component.isValidMeridiem();
    expect(actualResult).toBe(true);
  });

  it('Is number', () => {
    // Arrange
    const testCases = [
      { value: '10', expectedResult: true },
      { value: 'aaa', expectedResult: false },
    ];
    let actualResult = true;
    // Action and Assert
    testCases.forEach(item => {
      actualResult = component.isNumber(item.value);
      expect(actualResult).toBe(item.expectedResult);
    })
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
