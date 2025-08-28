import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { FilterWrongOddsSportsBookComponent } from './filter-wrong-odds-sports-book.component';
import { ValidationService } from '../services/validation.service';
import { StaticService } from '../../../../../../utility/services/static.service';
import { FilterWrongOddsSportsBookModel } from '../models/filter-wrong-odds-sports-book.model';
import { CheckAddPermissionService } from '../../../../../services/check-permission.service';

class Helper {
  static readonly fakeFilterModel: FilterWrongOddsSportsBookModel = {
    filterOddsType: '1',
    filterFromTransTime: '',
    filterToTransTime: '',
    filterOddsValue: '',
    filterOddsFrom: '',
    filterOddsTo: ''
  } as unknown as FilterWrongOddsSportsBookModel;
}

describe('FilterWrongOddsSportsBookComponent', () => {
  let component: FilterWrongOddsSportsBookComponent;
  let fixture: ComponentFixture<FilterWrongOddsSportsBookComponent>;
  let validationService: ValidationService;
  let staticService: StaticService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService,
        StaticService,
        CheckAddPermissionService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterWrongOddsSportsBookComponent);
    validationService = fixture.debugElement.injector.get(ValidationService);
    staticService = fixture.debugElement.injector.get(StaticService);
    component = fixture.componentInstance;
    component.filterWrongOddsSportsBookModel = Helper.fakeFilterModel;
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

  it('should validate odds filter by value', () => {
    // Arrange
    const validValue = '1.5';
    const invalidValue = '0';

    // Act & Assert
    expect(component.isValidOddsFilterByValue(validValue)).toBeTruthy();
    expect(component.isValidOddsFilterByValue(invalidValue)).toBeFalsy();
  });

  it('should validate odds filter by range', () => {
    // Arrange
    const validValue = '1.5';
    const invalidValue = '0';
    const elementClass = 'test-class';

    // Act & Assert
    expect(component.isValidOddsFilterByRange(validValue, elementClass)).toBeTruthy();
    expect(component.isValidOddsFilterByRange(invalidValue, elementClass)).toBeFalsy();
    expect(component.isValidOddsFilterByRange('', elementClass)).toBeTruthy();
  });

  it('should validate multiple decimal format', () => {
    // Arrange
    const validValue = '1.5,2.0,3.5';
    const invalidValue = '1.5,2.0,3.5,';
    const elementClass = 'test-class';

    jest.spyOn(StaticService, 'isCorrectFormatMultipleDecimal').mockImplementation((value) => {
      if (!value) return true;
      return value.split(',').every(num => /^\d+(\.\d+)?$/.test(num.trim()));
    });

    // Act & Assert
    expect(component.isCorrectFormatMultipleDecimal(validValue, elementClass)).toBeTruthy();
    expect(component.isCorrectFormatMultipleDecimal(invalidValue, elementClass)).toBeFalsy();
    expect(component.isCorrectFormatMultipleDecimal('', elementClass)).toBeTruthy();
  });

  it('should set filter odds type', () => {
    // Arrange
    const type = '2';

    // Act
    component.setFilterOddsType(type);

    // Assert
    expect(component.filterWrongOddsSportsBookModel.filterOddsType).toBe(type);
  });

  it('should check validity of date time and filter', () => {
    // Arrange
    component.fromTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(true)
    } as any;
    component.toTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(true)
    } as any;
    jest.spyOn(validationService, 'isFromTimeSameOrBeforeToTime').mockReturnValue(true);
    jest.spyOn(validationService, 'isValidFilterWrongOddsSportsBook').mockReturnValue(true);

    // Act & Assert
    expect(component.isValidity()).toBeTruthy();

    // Test with invalid date time
    component.fromTimeComponent.validateWithTooltip = jest.fn().mockReturnValue(false);
    expect(component.isValidity()).toBeFalsy();

    // Test with invalid filter
    component.fromTimeComponent.validateWithTooltip = jest.fn().mockReturnValue(true);
    jest.spyOn(validationService, 'isValidFilterWrongOddsSportsBook').mockReturnValue(false);
    expect(component.isValidity()).toBeFalsy();
  });

  it('should emit refresh event', () => {
    // Arrange
    component.refreshEvent = {
      emit: jest.fn()
    } as any;

    // Act
    component.emitRefreshEvent();

    // Assert
    expect(component.refreshEvent.emit).toHaveBeenCalled();
  });
});
