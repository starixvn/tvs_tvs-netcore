import { ElementRef, EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import moment from 'moment-timezone';
import { DateFullTimeNewComponent } from '../../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { ModalService } from '../../../../../../utility/components/modal/modal.service';
import { Tooltip } from '../../../../../../utility/components/tooltip/tooltip.model';
import { DateTimeFormat } from '../../../../../../utility/constants/config';
import { LogInfoDetail } from '../../../../../../utility/models/log-info-detail.model';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { CommonService } from '../../../../../../utility/services/common.service';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { WrongScoreModel } from '../../../../../models/event-wrong-score.model';
import { GetLogInfoModel, GetLogInfoViewModel, Validation } from '../../../../../models/get-log-info.model';
import { TransInfoAddRequestModel } from '../../../../../models/trans-info-add-request.model';
import { PrimitiveProperty } from '../event-wrong-score.model';
import { EventWrongScoreService } from '../services/event-wrong-score.service';
import { LogInfoService } from '../services/log-info.service';
import { ValidationService } from '../services/validation.service';
import { WrongScoreService } from '../services/wrong-score.service';
import { WrongScoreInfoComponent } from './wrong-score-info.component';

class Helper {
  static readonly fakeRequestId = 1212;
  static readonly fakeMatchId = 123;
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isChangeSubTypeManual: true,
    isAbnormal: false
  } as FilterModel;

  static getFakeWrongScoreModel(): WrongScoreModel {
    const model = new WrongScoreModel();
    model.scoreId = 1;
    model.isActive = true;
    model.wrongScore = '';
    model.subIssueTypeId = 1;
    model.filterFromTransTime = moment("2024-03-20 10:00:00").format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    model.filterToTransTime = moment("2024-03-20 11:00:00").format(DateTimeFormat.FULL_DATE_TIME_FORMAT);

    const logInfoDetail = new LogInfoDetail();
    logInfoDetail.matchId = 123;
    logInfoDetail.voidFromTime = new Date("2024-03-20 10:00:00");
    logInfoDetail.voidToTime = new Date("2024-03-20 11:00:00");
    logInfoDetail.transVoidToTime = new Date("2024-03-20 11:00:00");
    logInfoDetail.singleCount = 0;
    logInfoDetail.cashOutCount = 0;
    logInfoDetail.settleCount = 0;
    logInfoDetail.instantlySettleCount = 0;
    model.logInfoDetail = logInfoDetail;
    model.messageValidationLogInfo = [];
    model.actualScore = '';
    model.matchId = 123;
    model.isChecked = false;
    model.eventDate = new Date("2024-03-20 10:00:00");
    model.voidFromTime = moment("2024-03-20 10:00:00").format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    model.voidToTime = moment("2024-03-20 11:00:00").format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    model.filterBy = 1;
    model.sportType = 1;
    model.isMainMatch = true;

    return model;
  }

  static readonly fakePrimitiveProps = new PrimitiveProperty();
}

describe('WrongScoreInfoComponent', () => {
  let component: WrongScoreInfoComponent;
  let fixture: ComponentFixture<WrongScoreInfoComponent>;
  let validationService: ValidationService;
  let logInfoService: LogInfoService;
  let wrongScoreService: WrongScoreService;
  let commonService: CommonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService,
        LogInfoService,
        WrongScoreService,
        ModalService,
        EventWrongScoreService,
        CommonService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WrongScoreInfoComponent);
    validationService = fixture.debugElement.injector.get(ValidationService);
    logInfoService = fixture.debugElement.injector.get(LogInfoService);
    wrongScoreService = fixture.debugElement.injector.get(WrongScoreService);
    commonService = fixture.debugElement.injector.get(CommonService);
    component = fixture.componentInstance;

    // Set default input values
    component.index = 0;
    component.matchId = Helper.fakeMatchId;
    component.filter = Helper.fakeFilterModel;
    component.isEdit = false;
    component.requestId = Helper.fakeRequestId;
    component.isVoided = false;
    component.isCollapse = false;
    component.filterBy = 1;
    component.originWrongScoreModels = [Helper.getFakeWrongScoreModel()];
    component.wrongScoreModel = Helper.getFakeWrongScoreModel();
    component.primitiveProps = Helper.fakePrimitiveProps;
    component.selectedWrongScores = [Helper.getFakeWrongScoreModel()];
    component.checkScoreEvent = new EventEmitter();
    component.updateByOriginWrongScoreModelEvent = new EventEmitter();
    component.isBlock = false;
    component.tooltip = new Tooltip();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Act
    component.ngOnInit();

    // Assert
    expect(component.maxDate).toBeDefined();
    expect(component.isCollapse).toBeTruthy();
  });

  it('should handle checkbox change when checked', async () => {
    // Arrange
    component.fromTimeComponent = {} as DateFullTimeNewComponent;
    component.toTimeComponent = {} as DateFullTimeNewComponent;
    component.fromTimeComponent.validateWithTooltip = jest.fn().mockReturnValue(true);
    component.toTimeComponent.validateWithTooltip = jest.fn().mockReturnValue(true);
    component.fromTimeComponent.isTimeValid = jest.fn().mockReturnValue(true);
    component.toTimeComponent.isTimeValid = jest.fn().mockReturnValue(true);
    component.wrongScoreModel = {} as WrongScoreModel;

    // Mock element cho Tooltip
    const mockElement = {
      nativeElement: {
        getElementsByClassName: jest.fn().mockReturnValue([{
          scrollIntoView: jest.fn()
        }])
      }
    };
    component.tooltip.element = mockElement as unknown as ElementRef;

    jest.spyOn(component.checkScoreEvent, 'emit');
    jest.spyOn(validationService, 'isLastScore').mockReturnValue(true);
    jest.spyOn(wrongScoreService, 'handleCheckedLastScore').mockResolvedValue(undefined);
    jest.spyOn(logInfoService, 'clearDataValidation');
    jest.spyOn(logInfoService, 'getLogInfo');
    jest.spyOn(validationService, 'isFromTimeSameOrBeforeToTime').mockReturnValue(true);
    jest.spyOn(validationService, 'isFromTimeSameOrAfterDefaultValue').mockReturnValue(true);
    jest.spyOn(validationService, 'isToTimeSmallerThanFromTimeNextScore').mockReturnValue(true);

    const mockTransInfoModel = new TransInfoAddRequestModel();
    mockTransInfoModel.transInfoJson = '';
    mockTransInfoModel.unMarkTransIds = '';
    mockTransInfoModel.markTransIds = '';
    mockTransInfoModel.removeTransIds = '';

    const mockGetLogInfoModel = new GetLogInfoModel();
    mockGetLogInfoModel.matchId = 123;
    mockGetLogInfoModel.logInfoDetail = new LogInfoDetail();
    mockGetLogInfoModel.validation = {
      isInvalidTotalTickets: false,
      isExistsSecondAccept: false,
      isExistedInOtherRequest: false
    } as Validation;
    const mockViewModel = new GetLogInfoViewModel();
    mockViewModel.getLogInfoModels = [mockGetLogInfoModel];
    mockViewModel.transInfoAddRequestModel = mockTransInfoModel;

    jest.spyOn(commonService, 'getLogInfo').mockResolvedValue(mockViewModel);

    // Act
    await component.onchangeCheckbox(true);

    // Assert
    expect(component.checkScoreEvent.emit).toHaveBeenCalled();
    expect(validationService.isLastScore).toHaveBeenCalled();
    expect(wrongScoreService.handleCheckedLastScore).toHaveBeenCalled();
    expect(logInfoService.clearDataValidation).toHaveBeenCalled();
    expect(logInfoService.getLogInfo).toHaveBeenCalled();
    expect(component.isCollapse).toBeFalsy();
  });

  it('should handle checkbox change when unchecked', async () => {
    // Arrange
    jest.spyOn(component.checkScoreEvent, 'emit');
    jest.spyOn(wrongScoreService, 'setNullAllowanceTime');
    jest.spyOn(logInfoService, 'clearDataValidation');
    jest.spyOn(validationService, 'isLastScore').mockReturnValue(true);

    // Act
    await component.onchangeCheckbox(false);

    // Assert
    expect(component.checkScoreEvent.emit).toHaveBeenCalled();
    expect(wrongScoreService.setNullAllowanceTime).toHaveBeenCalled();
    expect(logInfoService.clearDataValidation).toHaveBeenCalled();
    expect(component.wrongScoreModel.filterToTransTime).toBeNull();
    expect(component.isCollapse).toBeTruthy();
  });

  it('should refresh log info when date time is valid', async () => {
    // Arrange
    component.fromTimeComponent = {} as DateFullTimeNewComponent;
    component.toTimeComponent = {} as DateFullTimeNewComponent;
    component.fromTimeComponent.validateWithTooltip = jest.fn().mockReturnValue(true);
    component.toTimeComponent.validateWithTooltip = jest.fn().mockReturnValue(true);
    component.fromTimeComponent.isTimeValid = jest.fn().mockReturnValue(true);
    component.toTimeComponent.isTimeValid = jest.fn().mockReturnValue(true);
    jest.spyOn(validationService, 'isValidToDateTime').mockReturnValue(true);
    jest.spyOn(validationService, 'isFromTimeSameOrBeforeToTime').mockReturnValue(true);
    jest.spyOn(validationService, 'isFromTimeSameOrAfterDefaultValue').mockReturnValue(true);
    jest.spyOn(validationService, 'isToTimeSmallerThanFromTimeNextScore').mockReturnValue(true);
    jest.spyOn(logInfoService, 'clearDataValidation');

    const mockTransInfoModel = new TransInfoAddRequestModel();
    mockTransInfoModel.transInfoJson = '';
    mockTransInfoModel.unMarkTransIds = '';
    mockTransInfoModel.markTransIds = '';
    mockTransInfoModel.removeTransIds = '';

    const mockGetLogInfoModel = new GetLogInfoModel();
    mockGetLogInfoModel.matchId = 123;
    mockGetLogInfoModel.logInfoDetail = new LogInfoDetail();

    const mockViewModel = new GetLogInfoViewModel();
    mockViewModel.getLogInfoModels = [mockGetLogInfoModel];
    mockViewModel.transInfoAddRequestModel = mockTransInfoModel;

    jest.spyOn(logInfoService, 'getLogInfo').mockResolvedValue(undefined);
    jest.spyOn(commonService, 'getLogInfo').mockResolvedValue(mockViewModel);

    // Act
    await component.refreshLogInfo();

    // Assert
    expect(logInfoService.clearDataValidation).toHaveBeenCalled();
    expect(logInfoService.getLogInfo).toHaveBeenCalled();
    expect(component.isCollapse).toBeFalsy();
  });

  it('should get duration time when time is valid', () => {
    // Arrange
    component.fromTimeComponent = {} as DateFullTimeNewComponent;
    component.toTimeComponent = {} as DateFullTimeNewComponent;
    component.fromTimeComponent.isTimeValid = jest.fn().mockReturnValue(true);
    component.toTimeComponent.isTimeValid = jest.fn().mockReturnValue(true);
    component.wrongScoreModel.filterFromTransTime = '2024-03-20 10:00:00';
    component.wrongScoreModel.filterToTransTime = '2024-03-20 11:00:00';
    jest.spyOn(wrongScoreService, 'getDurationTime').mockReturnValue('1:00:00');

    // Act
    const result = component.getDurationTime();

    // Assert
    expect(result).toBe('1:00:00');
    expect(wrongScoreService.getDurationTime).toHaveBeenCalledWith(
      component.wrongScoreModel.filterFromTransTime,
      component.wrongScoreModel.filterToTransTime
    );
  });

  it('should return dash when time is invalid', () => {
    // Arrange
    component.fromTimeComponent = {} as DateFullTimeNewComponent;
    component.toTimeComponent = {} as DateFullTimeNewComponent;
    component.fromTimeComponent.isTimeValid = jest.fn().mockReturnValue(false);
    component.toTimeComponent.isTimeValid = jest.fn().mockReturnValue(true);

    // Act
    const result = component.getDurationTime();

    // Assert
    expect(result).toBe('-');
  });

  it('should show warning for special bet type when void time is before filter time', () => {
    // Arrange
    component.wrongScoreModel.logInfoDetail = new LogInfoDetail();
    component.wrongScoreModel.logInfoDetail.voidFromTime = new Date('2024-03-20 09:00:00');
    component.wrongScoreModel.filterFromTransTime = '2024-03-20 10:00:00';

    // Act
    const result = component.isShowWarningSpecialBetType();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should not show warning for special bet type when void time is after filter time', () => {
    // Arrange
    component.wrongScoreModel.logInfoDetail = new LogInfoDetail();
    component.wrongScoreModel.logInfoDetail.voidFromTime = new Date('2024-03-20 11:00:00');
    component.wrongScoreModel.filterFromTransTime = '2024-03-20 10:00:00';

    // Act
    const result = component.isShowWarningSpecialBetType();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should show count info when any count is greater than 0', () => {
    // Act
    const result = component.isShowCountInfo(1, 0, 0);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should not show count info when all counts are 0', () => {
    // Act
    const result = component.isShowCountInfo(0, 0, 0);

    // Assert
    expect(result).toBeFalsy();
  });

  it('should create get log info params correctly', () => {
    // Arrange
    component.isEdit = true;
    component.requestId = 123;
    component.filter = Helper.fakeFilterModel;
    component.primitiveProps = Helper.fakePrimitiveProps;
    component.selectedWrongScores = [Helper.getFakeWrongScoreModel()];

    // Act
    const result = component.createGetLogInfoParams();

    // Assert
    expect(result).toEqual({
      isEdit: true,
      requestId: 123,
      filter: Helper.fakeFilterModel,
      primitiveProps: Helper.fakePrimitiveProps,
      wrongScoreModels: [Helper.getFakeWrongScoreModel()]
    });
  });

  it('should validate date time correctly', () => {
    // Arrange
    component.fromTimeComponent = {} as DateFullTimeNewComponent;
    component.toTimeComponent = {} as DateFullTimeNewComponent;
    component.fromTimeComponent.validateWithTooltip = jest.fn().mockReturnValue(true);
    component.toTimeComponent.validateWithTooltip = jest.fn().mockReturnValue(true);
    jest.spyOn(validationService, 'isValidToDateTime').mockReturnValue(true);
    jest.spyOn(validationService, 'isFromTimeSameOrBeforeToTime').mockReturnValue(true);
    jest.spyOn(validationService, 'isFromTimeSameOrAfterDefaultValue').mockReturnValue(true);
    jest.spyOn(validationService, 'isToTimeSmallerThanFromTimeNextScore').mockReturnValue(true);

    // Act
    const result = component.isValidDateTime();

    // Assert
    expect(result).toBeTruthy();
    expect(component.fromTimeComponent.validateWithTooltip).toHaveBeenCalled();
    expect(validationService.isValidToDateTime).toHaveBeenCalled();
    expect(validationService.isFromTimeSameOrBeforeToTime).toHaveBeenCalled();
    expect(validationService.isFromTimeSameOrAfterDefaultValue).toHaveBeenCalled();
    expect(validationService.isToTimeSmallerThanFromTimeNextScore).toHaveBeenCalled();
  });

  it('should show log info when log info detail exists', () => {
    // Arrange
    component.wrongScoreModel.logInfoDetail = new LogInfoDetail();
    component.wrongScoreModel.messageValidationLogInfo = [];

    // Act
    const result = component.isShowLogInfo();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should show log info when message validation exists', () => {
    // Arrange
    component.wrongScoreModel.logInfoDetail = null;
    component.wrongScoreModel.messageValidationLogInfo = [{
      isError: true,
      reason: 'Error message',
      isShowPopup: false
    }];

    // Act
    const result = component.isShowLogInfo();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should not show log info when no log info detail and no message validation', () => {
    // Arrange
    component.wrongScoreModel.logInfoDetail = null;
    component.wrongScoreModel.messageValidationLogInfo = [];

    // Act
    const result = component.isShowLogInfo();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should show label only for first index', () => {
    // Arrange
    component.index = 0;

    // Act
    const result = component.isShowLabel();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should not show label for other indices', () => {
    // Arrange
    component.index = 1;

    // Act
    const result = component.isShowLabel();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should clear data validation', () => {
    // Arrange
    jest.spyOn(logInfoService, 'clearDataValidation');

    // Act
    component.clearDataValidation();

    // Assert
    expect(logInfoService.clearDataValidation).toHaveBeenCalledWith(
      [component.wrongScoreModel],
      [],
      null
    );
  });

  it('should set null allowance time', () => {
    // Arrange
    jest.spyOn(wrongScoreService, 'setNullAllowanceTime');

    // Act
    component.setNullAllowanceTime();

    // Assert
    expect(wrongScoreService.setNullAllowanceTime).toHaveBeenCalledWith(component.wrongScoreModel);
  });

  it('should display full date time format correctly', () => {
    // Arrange
    const date = new Date('2024-03-20 10:00:00');

    // Act
    const result = component.displayFullDateTimeFormat(date);

    // Assert
    expect(result).toBe('2024/03/20 10:00:00.000 AM');
  });
});
