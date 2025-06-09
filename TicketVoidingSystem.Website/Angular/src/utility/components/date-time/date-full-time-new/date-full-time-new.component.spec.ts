import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { DateFullTimeNewComponent } from './date-full-time-new.component';
import { DateTimeFormat } from '../../../../utility/constants/config';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

class Helper {
  static readonly fakeDateTime = '2024/03/20 10:30:00';
  static readonly fakeTimeZone = 'America/Caracas';
  static readonly fakeTimeFormat = DateTimeFormat.TIME_FORMAT;
  static readonly fakeNgbDate = new NgbDate(2024, 3, 20);
}

describe('DateFullTimeNewComponent', () => {
  let component: DateFullTimeNewComponent;
  let fixture: ComponentFixture<DateFullTimeNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DateFullTimeNewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Arrange & Act
    component.ngOnInit();

    // Assert
    expect(component.timeZone).toBe('America/Caracas');
    expect(component.dateTimeFormat).toBe(`YYYY/MM/DD ${DateTimeFormat.TIME_FORMAT}`);
    expect(component.isShowInputDate).toBeTruthy();
    expect(component.isPasteTimeEvent).toBeFalsy();
  });

  it('should update data when dateTime changes', () => {
    // Arrange
    const mockDateTime = Helper.fakeDateTime;
    component['_dateTime'] = mockDateTime;

    // Act
    component.updateData();

    // Assert
    expect(component.date).toEqual(Helper.fakeNgbDate);
    expect(component.time).toBe('10:30:00.000 AM');
  });

  it('should handle time format conversion correctly', () => {
    // Arrange
    component.time = '10:30:00';
    component.date = Helper.fakeNgbDate;
    const mockOnChange = jest.fn();
    component.registerOnChange(mockOnChange);

    // Act
    component.onChangeModel();

    // Assert
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should validate time format correctly', () => {
    // Arrange
    component.time = '10:30:00.000 AM';
    component.timeFormat = Helper.fakeTimeFormat;

    // Act
    const result = component.isTimeValid();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should handle invalid time format', () => {
    // Arrange
    component.time = 'invalid-time';
    component.timeFormat = Helper.fakeTimeFormat;

    // Act
    const result = component.isTimeValid();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should handle paste time event correctly', () => {
    // Arrange
    const validTime = '10:30:00';
    component.isPasteTimeEvent = true;

    // Act
    component.onChangeTime(validTime);

    // Assert
    expect(component.isPasteTimeEvent).toBeFalsy();
  });

  it('should handle disabled state correctly', () => {
    // Arrange
    component.isDisabled = false;

    // Act
    component.setDisabledState(true);

    // Assert
    expect(component.isDisabled).toBeTruthy();
  });

  it('should handle writeValue correctly', () => {
    // Arrange
    const mockDateTime = Helper.fakeDateTime;

    // Act
    component.writeValue(mockDateTime);

    // Assert
    expect(component['_dateTime']).toBe(mockDateTime);
  });

  it('should handle registerOnChange correctly', () => {
    // Arrange
    const mockOnChange = jest.fn();

    // Act
    component.registerOnChange(mockOnChange);

    // Assert
    expect(component['_onChange']).toBe(mockOnChange);
  });

  it('should handle registerOnTouched correctly', () => {
    // Arrange
    const mockOnTouched = jest.fn();

    // Act
    component.registerOnTouched(mockOnTouched);

    // Assert
    expect(component['_onTouched']).toBe(mockOnTouched);
  });

  it('should handle onBlur correctly', () => {
    // Arrange
    const mockOnTouched = jest.fn();
    component.registerOnTouched(mockOnTouched);

    // Act
    component.onBlur();

    // Assert
    expect(mockOnTouched).toHaveBeenCalled();
  });

  it('should handle validateWithTooltip correctly', () => {
    // Arrange
    component.time = '10:30:00.000 AM';
    component.timeFormat = Helper.fakeTimeFormat;
    component.index = 1;
    component.isTimeValid = jest.fn().mockReturnValue(true);

    // Act
    const result = component.validateWithTooltip();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should handle getDateTime correctly', () => {
    // Arrange
    const mockDateTime = Helper.fakeDateTime;
    component['_dateTime'] = mockDateTime;

    // Act
    const result = component.getDateTime();

    // Assert
    expect(result).toBe(mockDateTime);
  });
}); 