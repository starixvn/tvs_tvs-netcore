import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { FilterWrongOuComponent } from './filter-wrong-ou.component';
import { ValidationService } from '../services/validation.service';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import moment from 'moment-timezone';
import { FilterWrongOuModel } from '../models/filter-wrong-ou.model';
import { FilterModel } from '../../filter/filter.model';
import { FilterBetType } from '../../event-wrong-hdp/models/filter-with-hdp.model';
import { StaticService } from '../../../../../utility/services/static.service';
import { TEXT } from '../../../../../utility/constants/text';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { HdpFilterBetTypeService } from '../../components/hdp-filter-bet-type/hdp-filter-bet-type.service';

class Helper {
  static getFakeFilterWrongOuModel(): FilterWrongOuModel {
    const model = new FilterWrongOuModel();
    model.filterFromTransTime = moment().format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    model.filterToTransTime = moment().format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    model.liveIndicator = 0;
    model.actualMarket = '1.5';
    model.wrongMarket = '2.5';
    model.filterBetType = new FilterBetType('', '', '1');
    return model;
  }

  static getFakeFilterModel(): FilterModel {
    return {
      issueTypeId: '1',
      subIssueTypeId: '1',
      action: '1',
      isTest: true,
      isVoided: false,
      isChangeSubTypeManual: true,
      isAbnormal: false
    } as FilterModel;
  }
}

describe('FilterWrongOuComponent', () => {
  let component: FilterWrongOuComponent;
  let fixture: ComponentFixture<FilterWrongOuComponent>;
  let validationService: ValidationService;
  let staticService: StaticService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService,
        StaticService,
        HdpFilterBetTypeService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterWrongOuComponent);
    validationService = fixture.debugElement.injector.get(ValidationService);
    staticService = fixture.debugElement.injector.get(StaticService);
    component = fixture.componentInstance;

    // Set default input values
    component.filterWrongOuModel = Helper.getFakeFilterWrongOuModel();
    component.filter = Helper.getFakeFilterModel();
    component.isDisabled = false;
    component.isEdit = false;
    component.isMainMatch = true;
    component.matchId = 123;
    component.sportTypeId = 1;

    // Mock tooltip
    component.tooltip = {
      display: jest.fn(),
      element: {
        nativeElement: {
          getElementsByClassName: () => [{
            scrollIntoView: jest.fn(),
            getBoundingClientRect: () => ({ top: 0, left: 0, width: 100, height: 100 })
          }]
        }
      }
    } as unknown as Tooltip;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit change filter event', () => {
    // Arrange
    jest.spyOn(component.changeFilterEvent, 'emit');

    // Act
    component.changeFilter();

    // Assert
    expect(component.changeFilterEvent.emit).toHaveBeenCalled();
  });

  it('should return duration time when time is valid', () => {
    // Arrange
    component.fromTimeComponent = {
      isTimeValid: jest.fn().mockReturnValue(true)
    } as unknown as DateFullTimeNewComponent;
    component.toTimeComponent = {
      isTimeValid: jest.fn().mockReturnValue(true)
    } as unknown as DateFullTimeNewComponent;
    jest.spyOn(StaticService, 'getDurations').mockReturnValue('1:00');

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
    jest.spyOn(validationService, 'isFromTimeSameOrBeforeToTime').mockReturnValue(true);
    jest.spyOn(validationService, 'isValidHdp').mockReturnValue(true);

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
    jest.spyOn(validationService, 'isFromTimeSameOrBeforeToTime').mockReturnValue(true);
    jest.spyOn(validationService, 'isValidHdp').mockReturnValue(true);

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
    jest.spyOn(validationService, 'isFromTimeSameOrBeforeToTime').mockReturnValue(false);
    jest.spyOn(validationService, 'isValidHdp').mockReturnValue(true);

    // Act
    const result = component.isValid();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should return false when HDP validation fails', () => {
    // Arrange
    component.fromTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(true)
    } as unknown as DateFullTimeNewComponent;
    component.toTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(true)
    } as unknown as DateFullTimeNewComponent;
    jest.spyOn(validationService, 'isFromTimeSameOrBeforeToTime').mockReturnValue(true);
    jest.spyOn(validationService, 'isValidHdp').mockReturnValue(false);

    // Act
    const result = component.isValid();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should return false when live indicator is not set', () => {
    // Arrange
    component.filterWrongOuModel.liveIndicator = null;
    component.fromTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(true)
    } as unknown as DateFullTimeNewComponent;
    component.toTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(true)
    } as unknown as DateFullTimeNewComponent;
    jest.spyOn(validationService, 'isFromTimeSameOrBeforeToTime').mockReturnValue(true);
    jest.spyOn(validationService, 'isValidHdp').mockReturnValue(true);

    // Act
    const result = component.isValid();

    // Assert
    expect(result).toBeFalsy();
    expect(component.tooltip.display).toHaveBeenCalledWith('radio-liveindicator', TEXT.REQUIRED_FIELD);
  });

  it('should emit search event', () => {
    // Arrange
    jest.spyOn(component.searchTicketEvent, 'emit');

    // Act
    component.emitSearchEvent();

    // Assert
    expect(component.searchTicketEvent.emit).toHaveBeenCalled();
  });

  it('should emit refresh event', () => {
    // Arrange
    jest.spyOn(component.refreshEvent, 'emit');

    // Act
    component.emitRefreshEvent();

    // Assert
    expect(component.refreshEvent.emit).toHaveBeenCalled();
  });

  it('should validate HDP format', () => {
    // Arrange
    const validHdp = '1.5';
    const invalidHdp = '1.5.5';
    jest.spyOn(StaticService, 'isCorrectFormatMultipleDecimal').mockReturnValue(true);

    // Act & Assert
    expect(component.isCorrectFormatHdp(validHdp, 'hdp-input')).toBeTruthy();
    expect(StaticService.isCorrectFormatMultipleDecimal).toHaveBeenCalledWith(validHdp, 'hdp-input', component.tooltip, TEXT.INVALID_OU);
  });

  it('should set default filter times when not set', () => {
    // Arrange
    component.filterWrongOuModel.filterFromTransTime = null;
    component.filterWrongOuModel.filterToTransTime = null;

    // Act
    component.changeFilterBy();

    // Assert
    expect(component.filterWrongOuModel.filterFromTransTime).toBeDefined();
    expect(component.filterWrongOuModel.filterToTransTime).toBeDefined();
  });
});
