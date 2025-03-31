import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { FilterWrongOddsComponent } from './filter-wrong-odds.component';
import { ValidationService } from '../services/validation.service';
import { CalculateOddsService } from '../services/calculate-odds.service';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterWrongOddsModel } from '../models/filter-wrong-odds.model';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { TEXT } from '../../../../../utility/constants/text';
import moment from 'moment-timezone';

class Helper {
  static readonly fakeFilterWrongOddsModel = {
    filterFromTransTime: moment().format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
    filterToTransTime: moment().add(1, 'hour').format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
    spread: '0.5',
    allowanceRate: '1',
    correctOddsHomeOver: '1.5',
    correctOddsAwayUnder: '2.5'
  } as FilterWrongOddsModel;
}

describe('FilterWrongOddsComponent', () => {
  let component: FilterWrongOddsComponent;
  let fixture: ComponentFixture<FilterWrongOddsComponent>;
  let validationService: ValidationService;
  let calculateOddsService: CalculateOddsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService, CalculateOddsService, StaticService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterWrongOddsComponent);
    validationService = fixture.debugElement.injector.get(ValidationService);
    calculateOddsService = fixture.debugElement.injector.get(CalculateOddsService);
    component = fixture.componentInstance;
    component.filterWrongOddsModel = Helper.fakeFilterWrongOddsModel;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit changeFilterEvent when changeFilter is called', () => {
    // Arrange
    component.changeFilterEvent = {
      emit: jest.fn()
    } as any;

    // Act
    component.changeFilter();

    // Assert
    expect(component.changeFilterEvent.emit).toHaveBeenCalled();
  });

  it('should return duration time when times are valid', () => {
    // Arrange
    component.fromTimeComponent = {
      isTimeValid: jest.fn().mockReturnValue(true)
    } as any;
    component.toTimeComponent = {
      isTimeValid: jest.fn().mockReturnValue(true)
    } as any;
    StaticService.getDurations = jest.fn().mockReturnValue('1 hour');

    // Act
    const result = component.getDurationTime();

    // Assert
    expect(result).toBe('1 hour');
  });

  it('should return "-" when times are invalid', () => {
    // Arrange
    component.fromTimeComponent = {
      isTimeValid: jest.fn().mockReturnValue(false)
    } as any;
    component.toTimeComponent = {
      isTimeValid: jest.fn().mockReturnValue(false)
    } as any;

    // Act
    const result = component.getDurationTime();

    // Assert
    expect(result).toBe('-');
  });

  it('should validate single decimal format', () => {
    // Arrange
    StaticService.isCorrectFormatSingleDecimal = jest.fn().mockReturnValue(true);

    // Act
    const result = component.isCorrectFormatSingleDecimal('1.5', 'test-class');

    // Assert
    expect(StaticService.isCorrectFormatSingleDecimal).toHaveBeenCalledWith('1.5', 'test-class', component.tooltip, TEXT.INVALID_INPUT);
    expect(result).toBeTruthy();
  });

  it('should return true for empty value in single decimal validation', () => {
    // Act
    const result = component.isCorrectFormatSingleDecimal('', 'test-class');

    // Assert
    expect(result).toBeTruthy();
  });

  it('should check if sub type is OU or 1st OU', () => {
    // Arrange
    validationService.isSubTypeOuOr1stOu = jest.fn().mockReturnValue(true);

    // Act
    const result = component.isSubTypeOuOr1stOu();

    // Assert
    expect(validationService.isSubTypeOuOr1stOu).toHaveBeenCalledWith(component.subIssueTypeId);
    expect(result).toBeTruthy();
  });

  it('should validate filter when both date time and filter are valid', () => {
    // Arrange
    component.fromTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(true)
    } as any;
    component.toTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(true)
    } as any;
    validationService.isFromTimeSameOrBeforeToTime = jest.fn().mockReturnValue(true);
    validationService.isValidFilterWrongOdds = jest.fn().mockReturnValue(true);

    // Act
    const result = component.isValid();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should validate correct odds', () => {
    // Arrange
    validationService.isValidFilterCorrectOdds = jest.fn().mockReturnValue(true);

    // Act
    const result = component.isValidFilterCorrectOdds();

    // Assert
    expect(validationService.isValidFilterCorrectOdds).toHaveBeenCalledWith(
      component.filterWrongOddsModel.correctOddsHomeOver,
      component.filterWrongOddsModel.spread,
      component.tooltip
    );
    expect(result).toBeTruthy();
  });

  it('should update correct odds away under when filter is valid', () => {
    // Arrange
    validationService.isValidFilterCorrectOdds = jest.fn().mockReturnValue(true);
    calculateOddsService.updateCorrectOddsAwayUnder = jest.fn();

    // Act
    component.changeCorrectOdds();

    // Assert
    expect(calculateOddsService.updateCorrectOddsAwayUnder).toHaveBeenCalledWith(component.filterWrongOddsModel);
  });

  it('should clear correct odds away under when filter is invalid', () => {
    // Arrange
    validationService.isValidFilterCorrectOdds = jest.fn().mockReturnValue(false);

    // Act
    component.changeCorrectOdds();

    // Assert
    expect(component.filterWrongOddsModel.correctOddsAwayUnder).toBe('');
  });

  it('should validate spread', () => {
    // Arrange
    validationService.isValidSpread = jest.fn().mockReturnValue(true);

    // Act
    const result = component.isValidSpread();

    // Assert
    expect(validationService.isValidSpread).toHaveBeenCalledWith(component.filterWrongOddsModel.spread, component.tooltip);
    expect(result).toBeTruthy();
  });

  it('should update allowance rate and correct odds when spread is valid', () => {
    // Arrange
    validationService.isValidSpread = jest.fn().mockReturnValue(true);
    calculateOddsService.updateAllowanceRate = jest.fn();
    calculateOddsService.updateCorrectOddsAwayUnder = jest.fn();

    // Act
    component.changeSpread();

    // Assert
    expect(calculateOddsService.updateAllowanceRate).toHaveBeenCalledWith(component.filterWrongOddsModel);
    expect(calculateOddsService.updateCorrectOddsAwayUnder).toHaveBeenCalledWith(component.filterWrongOddsModel);
  });
});
