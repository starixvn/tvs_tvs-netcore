import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { DatePickerComponent } from './date-picker.component';
import { NgbDate, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';

class Helper {
  static readonly fakeDate: NgbDate = new NgbDate(2024, 3, 15);
  static readonly fakeMaxDate: NgbDate = new NgbDate(2024, 12, 31);
  static readonly fakeMinDate: NgbDate = new NgbDate(2024, 1, 1);
}

describe('DatePickerComponent', () => {
  let component: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DatePickerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Assert
    expect(component.index).toBeNull();
    expect(component.disabled).toBeUndefined();
    expect(component.maxDate).toBeUndefined();
    expect(component.minDate).toBeUndefined();
    expect(component.readonly).toBeTruthy();
    expect(component.showInput).toBeTruthy();
    expect(component.allowedHideDate).toBeFalsy();
  });

  it('should handle writeValue correctly', () => {
    // Arrange
    const testDate = Helper.fakeDate;

    // Act
    component.writeValue(testDate);

    // Assert
    expect(component.date).toEqual(testDate);
  });

  it('should handle registerOnChange correctly', () => {
    // Arrange
    const mockFn = jest.fn();
    const testDate = Helper.fakeDate;

    // Act
    component.registerOnChange(mockFn);
    component.date = testDate;

    // Assert
    expect(mockFn).toHaveBeenCalledWith(testDate);
  });

  it('should handle registerOnTouched correctly', () => {
    // Arrange
    const mockFn = jest.fn();

    // Act
    component.registerOnTouched(mockFn);
    component.onBlur();

    // Assert
    expect(mockFn).toHaveBeenCalled();
  });

  it('should handle setDisabledState correctly', () => {
    // Arrange
    const disabledState = true;

    // Act
    component.setDisabledState(disabledState);

    // Assert
    expect(component.disabled).toBe(disabledState);
  });

  it('should toggle date picker when allowedHideDate is false', () => {
    // Arrange
    component.allowedHideDate = false;
    component.datePicker = {
      toggle: jest.fn()
    } as unknown as NgbInputDatepicker;

    // Act
    component.onClickIconCalendar();

    // Assert
    expect(component.datePicker.toggle).toHaveBeenCalled();
  });

  it('should toggle showInput when allowedHideDate is true', () => {
    // Arrange
    component.allowedHideDate = true;
    component.showInput = true;

    // Act
    component.onClickIconCalendar();

    // Assert
    expect(component.showInput).toBeFalsy();
  });

  it('should handle date changes correctly', () => {
    // Arrange
    const mockOnChange = jest.fn();
    const testDate = Helper.fakeDate;
    component.registerOnChange(mockOnChange);

    // Act
    component.date = testDate;

    // Assert
    expect(component.date).toEqual(testDate);
    expect(mockOnChange).toHaveBeenCalledWith(testDate);
  });

  it('should not trigger onChange when date value is the same', () => {
    // Arrange
    const mockOnChange = jest.fn();
    const testDate = Helper.fakeDate;
    component.registerOnChange(mockOnChange);
    component.date = testDate;

    // Act
    component.date = testDate;

    // Assert
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });
});
