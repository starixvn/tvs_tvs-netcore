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
import { TvDetectionService } from '../../../../../manage-request/app/request-list/services/tv-detection.service';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';

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

  describe('getTvDetectionClass', () => {
    it('should return correct class for different TV detection values', () => {
      // Test case 1: No detection
      component.tvDetectionValue = 0;
      expect(component.getTvDetectionClass()).toBe(TvDetectionService.getTvDetectionClass(0));

      // Test case 2: Low detection
      component.tvDetectionValue = 1;
      expect(component.getTvDetectionClass()).toBe(TvDetectionService.getTvDetectionClass(1));

      // Test case 3: Medium detection
      component.tvDetectionValue = 2;
      expect(component.getTvDetectionClass()).toBe(TvDetectionService.getTvDetectionClass(2));

      // Test case 4: High detection
      component.tvDetectionValue = 3;
      expect(component.getTvDetectionClass()).toBe(TvDetectionService.getTvDetectionClass(3));
    });
  });

  describe('changeFilter', () => {
    it('should emit change filter event and update allowance times', () => {
      // Arrange
      component.allowanceTimeComponent = {
        aaTime: '1',
        paTime: '2',
        saTime: '3',
        isDisabled: false,
        changeModel: jest.fn(),
        tooltip: new Tooltip(),
        element: null,
        isValidAllowanceTime: jest.fn(),
        validateWithTooltip: jest.fn()
      } as unknown as AllowanceTimeComponent;

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

    it('should handle string values for allowance times', () => {
      // Arrange
      component.allowanceTimeComponent = {
        aaTime: '10',
        paTime: '20',
        saTime: '30',
        isDisabled: false,
        changeModel: jest.fn(),
        tooltip: new Tooltip(),
        element: null,
        isValidAllowanceTime: jest.fn(),
        validateWithTooltip: jest.fn()
      } as unknown as AllowanceTimeComponent;

      // Act
      component.changeFilter();

      // Assert
      expect(component.filterWrongScoreModel.aaTime).toBe(10);
      expect(component.filterWrongScoreModel.paTime).toBe(20);
      expect(component.filterWrongScoreModel.saTime).toBe(30);
    });
  });

  describe('getDurationTime', () => {
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
      expect(wrongScoreService.getDurationTime).toHaveBeenCalledWith(
        component.filterWrongScoreModel.fromDateTime,
        component.filterWrongScoreModel.toDateTime
      );
    });

    it('should return "-" when from time is invalid', () => {
      // Arrange
      component.fromTimeComponent = {
        isTimeValid: jest.fn().mockReturnValue(false)
      } as unknown as DateFullTimeNewComponent;
      component.toTimeComponent = {
        isTimeValid: jest.fn().mockReturnValue(true)
      } as unknown as DateFullTimeNewComponent;

      // Act
      const result = component.getDurationTime();

      // Assert
      expect(result).toBe('-');
    });

    it('should return "-" when to time is invalid', () => {
      // Arrange
      component.fromTimeComponent = {
        isTimeValid: jest.fn().mockReturnValue(true)
      } as unknown as DateFullTimeNewComponent;
      component.toTimeComponent = {
        isTimeValid: jest.fn().mockReturnValue(false)
      } as unknown as DateFullTimeNewComponent;

      // Act
      const result = component.getDurationTime();

      // Assert
      expect(result).toBe('-');
    });
  });

  describe('isValid', () => {
    beforeEach(() => {
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
    });

    it('should return true when all validations pass', () => {
      // Act
      const result = component.isValid();

      // Assert
      expect(result).toBeTruthy();
      expect(component.fromTimeComponent.validateWithTooltip).toHaveBeenCalled();
      expect(component.toTimeComponent.validateWithTooltip).toHaveBeenCalled();
      expect(validationService.isFromTimeSameOrBeforeToTime).toHaveBeenCalledWith(
        component.filterWrongScoreModel.fromDateTime,
        component.filterWrongScoreModel.toDateTime,
        component.tooltip
      );
      expect(component.allowanceTimeComponent.isValidAllowanceTime).toHaveBeenCalled();
    });

    it('should return false when from time validation fails', () => {
      // Arrange
      component.fromTimeComponent.validateWithTooltip = jest.fn().mockReturnValue(false);

      // Act
      const result = component.isValid();

      // Assert
      expect(result).toBeFalsy();
      expect(component.fromTimeComponent.validateWithTooltip).toHaveBeenCalled();
      expect(component.toTimeComponent.validateWithTooltip).not.toHaveBeenCalled();
    });

    it('should return false when to time validation fails', () => {
      // Arrange
      component.toTimeComponent.validateWithTooltip = jest.fn().mockReturnValue(false);

      // Act
      const result = component.isValid();

      // Assert
      expect(result).toBeFalsy();
      expect(component.fromTimeComponent.validateWithTooltip).toHaveBeenCalled();
      expect(component.toTimeComponent.validateWithTooltip).toHaveBeenCalled();
      expect(validationService.isFromTimeSameOrBeforeToTime).not.toHaveBeenCalled();
    });

    it('should return false when from time is after to time', () => {
      // Arrange
      validationService.isFromTimeSameOrBeforeToTime = jest.fn().mockReturnValue(false);

      // Act
      const result = component.isValid();

      // Assert
      expect(result).toBeFalsy();
      expect(validationService.isFromTimeSameOrBeforeToTime).toHaveBeenCalled();
      expect(component.allowanceTimeComponent.isValidAllowanceTime).not.toHaveBeenCalled();
    });

    it('should return false when allowance time validation fails', () => {
      // Arrange
      component.allowanceTimeComponent.isValidAllowanceTime = jest.fn().mockReturnValue(false);

      // Act
      const result = component.isValid();

      // Assert
      expect(result).toBeFalsy();
      expect(component.allowanceTimeComponent.isValidAllowanceTime).toHaveBeenCalled();
    });
  });
});