import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { FilterWrongScoreComponent } from './filter-wrong-score.component';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { ValidationService } from '../services/validation.service';
import { WrongScoreService } from '../services/wrong-score.service';
import { AddRequestStore } from '../../add-request.store';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { AllowanceTimeComponent } from '../allowance-time/allowance-time.component';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import moment from 'moment-timezone';

class Helper {
  static getFakeFilterTimeWithAllowance(): FilterTimeWithAllowance {
    const model = new FilterTimeWithAllowance();
    model.fromDateTime = moment().format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    model.toDateTime = moment().format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    model.aaTime = 0;
    model.paTime = 0;
    model.saTime = 0;
    return model;
  }
}

describe('FilterWrongScoreComponent', () => {
  let component: FilterWrongScoreComponent;
  let fixture: ComponentFixture<FilterWrongScoreComponent>;
  let validationService: ValidationService;
  let wrongScoreService: WrongScoreService;
  let addRequestStore: AddRequestStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService,
        WrongScoreService,
        AddRequestStore
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterWrongScoreComponent);
    validationService = fixture.debugElement.injector.get(ValidationService);
    wrongScoreService = fixture.debugElement.injector.get(WrongScoreService);
    addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    component = fixture.componentInstance;

    // Set default input values
    component.filterWrongScoreModel = Helper.getFakeFilterTimeWithAllowance();
    component.isVoided = false;
    component.tvDetectionValue = 0;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get TV detection class', () => {
    // Act
    const result = component.getTvDetectionClass();

    // Assert
    expect(result).toBeDefined();
  });

  it('should emit change filter event and update allowance times', () => {
    // Arrange
    component.allowanceTimeComponent = {
      aaTime: 1,
      paTime: 2,
      saTime: 3
    } as AllowanceTimeComponent;

    jest.spyOn(component.changeFilterEvent, 'emit');
    jest.spyOn(addRequestStore, 'changeSavingRequestStatus');

    // Act
    component.changeFilter();

    // Assert
    expect(component.changeFilterEvent.emit).toHaveBeenCalled();
    expect(component.filterWrongScoreModel.aaTime).toBe(1);
    expect(component.filterWrongScoreModel.paTime).toBe(2);
    expect(component.filterWrongScoreModel.saTime).toBe(3);
    expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
  });

  it('should return duration time when time is valid', () => {
    // Arrange
    component.fromTimeComponent = {
      isTimeValid: jest.fn().mockReturnValue(true)
    } as unknown as DateFullTimeNewComponent;
    component.toTimeComponent = {
      isTimeValid: jest.fn().mockReturnValue(true)
    } as unknown as DateFullTimeNewComponent;
    jest.spyOn(wrongScoreService, 'getDurationTime').mockReturnValue('1:00');

    // Act
    const result = component.getDurationTime();

    // Assert
    expect(result).toBe('1:00');
  });

  it('should return "-" when time is invalid', () => {
    // Arrange
    component.fromTimeComponent = {
      isTimeValid: jest.fn().mockReturnValue(false)
    } as unknown as DateFullTimeNewComponent;
    component.toTimeComponent = {
      isTimeValid: jest.fn().mockReturnValue(false)
    } as unknown as DateFullTimeNewComponent;

    // Act
    const result = component.getDurationTime();

    // Assert
    expect(result).toBe('-');
  });

  it('should return true when all validations pass', () => {
    // Arrange
    component.fromTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(true)
    } as unknown as DateFullTimeNewComponent;
    component.toTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(true)
    } as unknown as DateFullTimeNewComponent;
    component.allowanceTimeComponent = {
      isValidAllowanceTime: jest.fn().mockReturnValue(true)
    } as unknown as AllowanceTimeComponent;
    jest.spyOn(validationService, 'isFromTimeSameOrBeforeToTime').mockReturnValue(true);

    // Act
    const result = component.isValid();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should return false when time validation fails', () => {
    // Arrange
    component.fromTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(false)
    } as unknown as DateFullTimeNewComponent;
    component.toTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(true)
    } as unknown as DateFullTimeNewComponent;
    component.allowanceTimeComponent = {
      isValidAllowanceTime: jest.fn().mockReturnValue(true)
    } as unknown as AllowanceTimeComponent;
    jest.spyOn(validationService, 'isFromTimeSameOrBeforeToTime').mockReturnValue(true);

    // Act
    const result = component.isValid();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should return false when from time is after to time', () => {
    // Arrange
    component.fromTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(true)
    } as unknown as DateFullTimeNewComponent;
    component.toTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(true)
    } as unknown as DateFullTimeNewComponent;
    component.allowanceTimeComponent = {
      isValidAllowanceTime: jest.fn().mockReturnValue(true)
    } as unknown as AllowanceTimeComponent;
    jest.spyOn(validationService, 'isFromTimeSameOrBeforeToTime').mockReturnValue(false);

    // Act
    const result = component.isValid();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should return false when allowance time validation fails', () => {
    // Arrange
    component.fromTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(true)
    } as unknown as DateFullTimeNewComponent;
    component.toTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(true)
    } as unknown as DateFullTimeNewComponent;
    component.allowanceTimeComponent = {
      isValidAllowanceTime: jest.fn().mockReturnValue(false)
    } as unknown as AllowanceTimeComponent;
    jest.spyOn(validationService, 'isFromTimeSameOrBeforeToTime').mockReturnValue(true);

    // Act
    const result = component.isValid();

    // Assert
    expect(result).toBeFalsy();
  });
});