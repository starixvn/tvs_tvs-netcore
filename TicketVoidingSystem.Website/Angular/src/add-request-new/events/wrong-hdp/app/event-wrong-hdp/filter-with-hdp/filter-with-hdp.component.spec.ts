import { ComponentFixture, TestBed } from '@angular/core/testing';
import moment from 'moment-timezone';
import { DateFullTimeNewComponent } from '../../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { DateTimeFormat, TeamFavorite } from '../../../../../../utility/constants/config';
import { TEXT } from '../../../../../../utility/constants/text';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { StaticService } from '../../../../../../utility/services/static.service';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { HdpFilterBetTypeService } from '../../../../../component/hdp-filter-bet-type/hdp-filter-bet-type.service';
import { FilterWithHdpModel } from '../models/filter-with-hdp.model';
import { ValidationService } from '../services/validation.service';
import { FilterWithHdpComponent } from './filter-with-hdp.component';

class Helper {
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isChangeSubTypeManual: true,
    isAbnormal: false
  } as FilterModel;

  static readonly fakeFilterWithHdpModel = new FilterWithHdpModel();
}

describe('FilterWithHdpComponent', () => {
  let component: FilterWithHdpComponent;
  let fixture: ComponentFixture<FilterWithHdpComponent>;
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

    fixture = TestBed.createComponent(FilterWithHdpComponent);
    validationService = fixture.debugElement.injector.get(ValidationService);
    staticService = fixture.debugElement.injector.get(StaticService);
    component = fixture.componentInstance;
    component.filterWithHdpModel = Helper.fakeFilterWithHdpModel;
    component.filter = Helper.fakeFilterModel;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Arrange
    component.isEdit = false;
    component.filterWithHdpModel.homeFavorite = '';
    component.filterWithHdpModel.awayFavorite = '';

    // Act
    component.ngOnInit();

    // Assert
    expect(component.teamFavorite).toBe(TeamFavorite.HOME);
  });

  it('should initialize with existing values when in edit mode', () => {
    // Arrange
    component.isEdit = true;
    component.filterWithHdpModel.homeFavorite = '1.5';
    component.filterWithHdpModel.awayFavorite = '';

    // Act
    component.ngOnInit();

    // Assert
    expect(component.teamFavorite).toBe(TeamFavorite.HOME);
  });

  it('should change filter by and set default times', () => {
    // Arrange
    component.filterWithHdpModel.filterFromTransTime = '';
    component.filterWithHdpModel.filterToTransTime = '';

    // Act
    component.changeFilterBy();

    // Assert
    expect(component.filterWithHdpModel.filterFromTransTime).toBeDefined();
    expect(component.filterWithHdpModel.filterToTransTime).toBeDefined();
  });

  it('should change team favorite to home', () => {
    // Arrange
    component.filterWithHdpModel.homeFavorite = '1.5';
    component.filterWithHdpModel.awayFavorite = '2.5';
    component.teamFavorite = TeamFavorite.AWAY;
    component.changeFilterEvent.emit = jest.fn();

    // Act
    component.changeTeamFavorite(TeamFavorite.HOME);

    // Assert
    expect(component.teamFavorite).toBe(TeamFavorite.HOME);
    expect(component.filterWithHdpModel.homeFavorite).toBe('2.5');
    expect(component.filterWithHdpModel.awayFavorite).toBe('');
    expect(component.changeFilterEvent.emit).toHaveBeenCalled();
  });

  it('should change team favorite to away', () => {
    // Arrange
    component.filterWithHdpModel.homeFavorite = '1.5';
    component.filterWithHdpModel.awayFavorite = '';
    component.teamFavorite = TeamFavorite.HOME;
    component.changeFilterEvent.emit = jest.fn();

    // Act
    component.changeTeamFavorite(TeamFavorite.AWAY);

    // Assert
    expect(component.teamFavorite).toBe(TeamFavorite.AWAY);
    expect(component.filterWithHdpModel.homeFavorite).toBe('');
    expect(component.filterWithHdpModel.awayFavorite).toBe('1.5');
    expect(component.changeFilterEvent.emit).toHaveBeenCalled();
  });

  it('should get duration time when times are valid', () => {
    // Arrange
    component.fromTimeComponent = {
      isTimeValid: jest.fn().mockReturnValue(true)
    } as unknown as DateFullTimeNewComponent;
    component.toTimeComponent = {
      isTimeValid: jest.fn().mockReturnValue(true)
    } as unknown as DateFullTimeNewComponent;
    component.filterWithHdpModel.filterFromTransTime = moment().format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    component.filterWithHdpModel.filterToTransTime = moment().add(1, 'hour').format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    jest.spyOn(StaticService, 'getDurations').mockReturnValue('1:00');

    // Act
    const result = component.getDurationTime();

    // Assert
    expect(result).toBe('1:00');
  });

  it('should return "-" when times are invalid', () => {
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

  it('should validate date time', () => {
    // Arrange
    component.fromTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(true)
    } as unknown as DateFullTimeNewComponent;
    component.toTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(true)
    } as unknown as DateFullTimeNewComponent;
    jest.spyOn(validationService, 'isFromTimeSameOrBeforeToTime').mockReturnValue(true);

    // Act
    const result = component['isValidDateTime']();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should validate HDP for wrong HDP sub type', () => {
    // Arrange
    component.filter.subIssueTypeId = '1'; // Wrong HDP sub type
    jest.spyOn(validationService, 'isSubTypeWrongHdpOrWrong1stHdp').mockReturnValue(true);
    jest.spyOn(validationService, 'isValidHdpWithSubTypeWrongHdpOrWrong1stHdp').mockReturnValue(true);

    // Act
    const result = component['isValidHdp']();

    // Assert
    expect(result).toBeTruthy();
    expect(validationService.isValidHdpWithSubTypeWrongHdpOrWrong1stHdp).toHaveBeenCalled();
  });

  it('should validate HDP for home/away virtual sub type', () => {
    // Arrange
    component.filter.subIssueTypeId = '2'; // Home/Away virtual sub type
    jest.spyOn(validationService, 'isSubTypeWrongHdpOrWrong1stHdp').mockReturnValue(false);
    jest.spyOn(validationService, 'isValidHdpWithSubTypeHomeAwayVirtualHedReverse').mockReturnValue(true);

    // Act
    const result = component['isValidHdp']();

    // Assert
    expect(result).toBeTruthy();
    expect(validationService.isValidHdpWithSubTypeHomeAwayVirtualHedReverse).toHaveBeenCalled();
  });

  it('should validate live indicator when value is set', () => {
    // Arrange
    component.filterWithHdpModel.liveIndicator = 1;

    // Act
    const result = component['isValidLiveIndicator']();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should validate live indicator when value is not set', () => {
    // Arrange
    component.filterWithHdpModel.liveIndicator = null;
    component.tooltip.display = jest.fn();

    // Act
    const result = component['isValidLiveIndicator']();

    // Assert
    expect(result).toBeFalsy();
    expect(component.tooltip.display).toHaveBeenCalledWith('radio-liveindicator', TEXT.REQUIRED_FIELD);
  });

  it('should validate HDP format', () => {
    // Arrange
    const value = '1.5';
    const elementClass = 'test-class';
    jest.spyOn(StaticService, 'isCorrectFormatMultipleDecimal').mockReturnValue(true);

    // Act
    const result = component.isCorrectFormatHdp(value, elementClass);

    // Assert
    expect(result).toBeTruthy();
    expect(StaticService.isCorrectFormatMultipleDecimal).toHaveBeenCalledWith(value, elementClass, component.tooltip, TEXT.INVALID_HDP);
  });

  it('should emit search event', () => {
    // Arrange
    component.searchTicketEvent.emit = jest.fn();

    // Act
    component.emitSearchEvent();

    // Assert
    expect(component.searchTicketEvent.emit).toHaveBeenCalled();
  });

  it('should emit refresh event', () => {
    // Arrange
    component.refreshEvent.emit = jest.fn();

    // Act
    component.emitRefreshEvent();

    // Assert
    expect(component.refreshEvent.emit).toHaveBeenCalled();
  });

  it('should check if sub type is wrong HDP or wrong 1st HDP', () => {
    // Arrange
    jest.spyOn(validationService, 'isSubTypeWrongHdpOrWrong1stHdp').mockReturnValue(true);

    // Act
    const result = component.isSubTypeWrongHdpOrWrong1stHdp();

    // Assert
    expect(result).toBeTruthy();
    expect(validationService.isSubTypeWrongHdpOrWrong1stHdp).toHaveBeenCalledWith(component.filter.subIssueTypeId);
  });
});
