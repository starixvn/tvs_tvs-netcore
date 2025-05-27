import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { WrongScoreInfoComponent } from './wrong-score-info.component';
import { ValidationService } from '../services/validation.service';
import { LogInfoService } from '../services/log-info.service';
import { WrongScoreService } from '../services/wrong-score.service';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { FilterModel } from '../../filter/filter.model';
import { WrongScoreModel } from '../../models/event-wrong-score.model';
import { PrimitiveProperty } from '../event-wrong-score.model';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import moment from 'moment-timezone';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { ElementRef, EventEmitter } from '@angular/core';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { EventWrongScoreService } from '../services/event-wrong-score.service';
import { CommonService } from '../../../../../utility/services/common.service';
import { GetLogInfoViewModel, GetLogInfoModel, Validation } from '../../models/get-log-info.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';

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
    model.filterFromTransTime = moment().format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    model.filterToTransTime = moment().format(DateTimeFormat.FULL_DATE_TIME_FORMAT);

    const logInfoDetail = new LogInfoDetail();
    logInfoDetail.matchId = 123;
    logInfoDetail.liveScores = '';
    logInfoDetail.voidFromTime = new Date();
    logInfoDetail.voidToTime = new Date();
    logInfoDetail.transVoidToTime = new Date();
    logInfoDetail.singleCount = 0;
    logInfoDetail.cashOutCount = 0;
    logInfoDetail.settleCount = 0;
    logInfoDetail.instantlySettleCount = 0;
    logInfoDetail.mainParlayCount = 0;
    logInfoDetail.cancelCashOutCount = 0;
    logInfoDetail.scoreNormalTicket = '';
    logInfoDetail.scoreOfMatch = '';
    logInfoDetail.minTransId = '';
    logInfoDetail.actionType = '';
    logInfoDetail.isHasWarningRangeTime = false;
    model.logInfoDetail = logInfoDetail;

    model.messageValidationLogInfo = [];
    model.actualScore = '';
    model.matchId = 123;
    model.isChecked = false;
    model.eventDate = new Date();
    model.voidFromTime = moment().format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    model.voidToTime = moment().format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    model.aaTime = 0;
    model.paTime = 0;
    model.saTime = 0;
    model.filterBy = 1;
    model.isCheckedVar = false;
    model.tvDetectionValue = 0;
    model.serviceAcceptTime = moment().format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    model.actualTime = moment().format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    model.minuteOffset = '0';
    model.secondOffset = '0';
    model.sportType = 1;
    model.isMainMatch = true;
    model.matchType = 1;

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
    component.fromTimeComponent.validateWithTooltip = jest.fn().mockReturnValue(true);
    component.toTimeComponent.validateWithTooltip = jest.fn().mockReturnValue(true);
    component.fromTimeComponent.isTimeValid = jest.fn().mockReturnValue(true);
    component.toTimeComponent.isTimeValid = jest.fn().mockReturnValue(true);
    jest.spyOn(wrongScoreService, 'getDurationTime').mockReturnValue('1:00');

    // Act
    const result = component.getDurationTime();

    // Assert
    expect(result).toBe('1:00');
  });

  it('should return "-" when time is invalid', () => {
    // Arrange
    component.fromTimeComponent = {} as DateFullTimeNewComponent;
    component.toTimeComponent = {} as DateFullTimeNewComponent;
    component.fromTimeComponent.isTimeValid = jest.fn().mockReturnValue(false);
    component.toTimeComponent.isTimeValid = jest.fn().mockReturnValue(false);

    // Act
    const result = component.getDurationTime();

    // Assert
    expect(result).toBe('-');
  });

  it('should show warning for special bet type', () => {
    // Arrange
    const voidFromTime = moment().subtract(1, 'hour').toDate();
    component.wrongScoreModel.logInfoDetail.voidFromTime = voidFromTime;
    component.wrongScoreModel.filterFromTransTime = moment().format(DateTimeFormat.FULL_DATE_TIME_FORMAT);

    // Act
    const result = component.isShowWarningSpecialBetType();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should not show warning for special bet type when times are valid', () => {
    // Arrange
    const voidFromTime = moment().add(1, 'hour').toDate();
    component.wrongScoreModel.logInfoDetail.voidFromTime = voidFromTime;
    component.wrongScoreModel.filterFromTransTime = moment().format(DateTimeFormat.FULL_DATE_TIME_FORMAT);

    // Act
    const result = component.isShowWarningSpecialBetType();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should show count info when counts are valid', () => {
    // Act
    const result = component.isShowCountInfo(1, 2, 3);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should get count info content', () => {
    // Act
    const result = component.countInfoContent(1, 2, 3);

    // Assert
    expect(result).toBeDefined();
  });
});
