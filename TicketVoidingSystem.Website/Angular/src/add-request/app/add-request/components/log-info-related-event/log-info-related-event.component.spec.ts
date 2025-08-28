import { ComponentFixture, TestBed } from '@angular/core/testing';
import moment from 'moment-timezone';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { AcceptType, DateTimeFormat } from '../../../../../utility/constants/config';
import { TEXT } from '../../../../../utility/constants/text';
import { SubIssueType } from '../../../../../utility/models/issue-type.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterTimeWithAllowanceComponent } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.component';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { FilterModel } from '../../filter/filter.model';
import { SubIssueTypeDialogModel } from '../../filter/sub-issue-type-dialog/sub-issue-type-dialog.model';
import { LogInfoRelatedEventComponent } from './log-info-related-event.component';
import { LogInfoRelatedEvent } from './log-info-related-event.model';
import { LogInfoRelatedEventService } from './log-info-related-event.service';

class Helper {
  static readonly fakeRequestId = 1212;
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isChangeSubTypeManual: true,
    isAbnormal: false
  } as FilterModel;

  static readonly fakeLogInfo: LogInfoRelatedEvent = {
    subIssueTypeId: 1,
    isCheckedVar: null,
    isHighLightVarCheck: null,
    voidTimeArea: {
      aaTime: 0,
      paTime: 0,
      saTime: 0
    },
    logInfoDetail: new LogInfoDetail(),
    messageValidationLogInfo: null
  } as LogInfoRelatedEvent;

  static readonly fakeSubIssueTypes: SubIssueType[] = [
    {
      subIssueTypeId: 1,
      subIssueTypeName: 'Test Sub Type 1'
    },
    {
      subIssueTypeId: 2,
      subIssueTypeName: 'Test Sub Type 2'
    }
  ] as SubIssueType[];
}

describe('LogInfoRelatedEventComponent', () => {
  let component: LogInfoRelatedEventComponent;
  let fixture: ComponentFixture<LogInfoRelatedEventComponent>;
  let logInfoRelatedEventService: LogInfoRelatedEventService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        LogInfoRelatedEventService,
        ModalService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LogInfoRelatedEventComponent);
    logInfoRelatedEventService = fixture.debugElement.injector.get(LogInfoRelatedEventService);
    component = fixture.componentInstance;
    component.tooltip.display = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isBlock).toBeFalsy();
    expect(component.isShowValidation).toBeTruthy();
    expect(component.tooltipVarMessage).toBe(TEXT.SELECTED_VAR_OPTIONS);
    expect(component.acceptTypeName).toBe('');
  });

  it('should show tooltip for sub type when required', () => {
    // Arrange
    component.tooltip.display = jest.fn();

    // Act
    component.showTooltipSubType();

    // Assert
    expect(component.tooltip.display).toHaveBeenCalledWith('btn-select-sub-type', TEXT.REQUIRED_SUB_TYPE);
  });

  it('should refresh log info when sub issue type is selected', async () => {
    // Arrange
    component.logInfo = Helper.fakeLogInfo;
    component.logInfo.subIssueTypeId = 1;
    component.filterTimeWithAllowanceComponent = {
      isValid: jest.fn().mockReturnValue(true),
      updateData: jest.fn()
    } as unknown as FilterTimeWithAllowanceComponent;
    logInfoRelatedEventService.refreshLogInfoForRelatedEvent = jest.fn().mockResolvedValue(undefined);

    // Act
    await component.refreshLogInfo();

    // Assert
    expect(component.isBlock).toBeFalsy();
    expect(logInfoRelatedEventService.refreshLogInfoForRelatedEvent).toHaveBeenCalled();
    expect(component.filterTimeWithAllowanceComponent.updateData).toHaveBeenCalled();
  });

  it('should not refresh log info when sub issue type is not selected', async () => {
    // Arrange
    component.logInfo = Helper.fakeLogInfo;
    component.logInfo.subIssueTypeId = null;
    component.logInfo.logInfoDetail = new LogInfoDetail();
    component.tooltip.display = jest.fn();

    // Act
    await component.refreshLogInfo();

    // Assert
    expect(component.tooltip.display).toHaveBeenCalledWith('btn-select-sub-type', TEXT.REQUIRED_SUB_TYPE);
    expect(component.isBlock).toBeFalsy();
  });

  it('should clear data validation', () => {
    // Arrange
    component.logInfo = Helper.fakeLogInfo;
    component.logInfo.logInfoDetail = new LogInfoDetail();
    component.logInfo.messageValidationLogInfo = [{
      isError: true,
      reason: 'Test message'
    }];

    // Act
    component['clearDataValidation']();

    // Assert
    expect(component.logInfo.logInfoDetail).toBeNull();
    expect(component.logInfo.messageValidationLogInfo).toBeNull();
  });

  it('should update data after sub issue type dialog is closed', () => {
    // Arrange
    component.logInfo = Helper.fakeLogInfo;
    component.logInfo.logInfoDetail = new LogInfoDetail();
    component.subIssueTypeDialogModel = new SubIssueTypeDialogModel();
    component.subIssueTypeDialogModel.allowanceTime = {
      aaTime: 10,
      paTime: 20,
      saTime: 30
    };

    // Act
    component.updateDataAfterClosed(1);

    // Assert
    expect(component.logInfo.subIssueTypeId).toBe(1);
    expect(component.logInfo.isCheckedVar).toBeNull();
    expect(component.logInfo.isHighLightVarCheck).toBeNull();
    expect(component.logInfo.voidTimeArea.aaTime).toBe(10);
    expect(component.logInfo.voidTimeArea.paTime).toBe(20);
    expect(component.logInfo.voidTimeArea.saTime).toBe(30);
  });

  it('should get sub issue type name correctly', () => {
    // Arrange
    component.logInfo = Helper.fakeLogInfo;
    component.logInfo.subIssueTypeId = 1;
    component.subIssueTypes = Helper.fakeSubIssueTypes;

    // Act
    const result = component.getSubIssueTypeName();

    // Assert
    expect(result).toBe('Test Sub Type 1');
  });

  it('should return default text when sub issue type is not selected', () => {
    // Arrange
    component.logInfo = Helper.fakeLogInfo;
    component.logInfo.subIssueTypeId = null;

    // Act
    const result = component.getSubIssueTypeName();

    // Assert
    expect(result).toBe('Select Sub Type');
  });

  it('should get highlight min time class correctly', () => {
    // Arrange
    component.logInfo = Helper.fakeLogInfo;
    component.logInfo.logInfoDetail = new LogInfoDetail();
    const minTime = new Date();

    // Test AA case
    component.logInfo.logInfoDetail.highlightAcceptType = AcceptType.AUTO_ACCEPT;
    expect(component.getHighlightMinTimeClass(minTime)).toBe('highlight-min-aa');
    expect(component.acceptTypeName).toBe('AA');

    // Test SA case
    component.logInfo.logInfoDetail.highlightAcceptType = AcceptType.SECOND_ACCEPT;
    expect(component.getHighlightMinTimeClass(minTime)).toBe('highlight-min-sa');
    expect(component.acceptTypeName).toBe('SA');

    // Test PA case
    component.logInfo.logInfoDetail.highlightAcceptType = AcceptType.PENDING_ACCEPT;
    expect(component.getHighlightMinTimeClass(minTime)).toBe('highlight-min-pa');
    expect(component.acceptTypeName).toBe('PA');
  });

  it('should display min time correctly', () => {
    // Arrange
    const minTime = new Date();
    component.acceptTypeName = 'AA';

    // Act
    const result = component.displayMinTime(minTime);

    // Assert
    expect(result).toBe(`${moment(minTime).format(DateTimeFormat.TIME_FORMAT)} - AA`);
  });

  it('should return dash when min time is null', () => {
    // Act
    const result = component.displayMinTime(null);

    // Assert
    expect(result).toBe('-');
  });

  it('should check if var check should be shown', () => {
    // Arrange
    component.logInfo = Helper.fakeLogInfo;
    component.logInfo.subIssueTypeId = 1;
    component.logInfo.isMainMatch = false;
    jest.spyOn(StaticService, 'isShowVarCheck').mockReturnValue(true);

    // Act
    const result = component.isShowVarCheck();

    // Assert
    expect(result).toBeTruthy();
    expect(StaticService.isShowVarCheck).toHaveBeenCalledWith(1);
  });

  it('should change var check value', () => {
    // Arrange
    component.logInfo = Helper.fakeLogInfo;

    // Act
    component.changeVarCheckValue(true);

    // Assert
    expect(component.logInfo.isCheckedVar).toBeTruthy();
    expect(component.logInfo.isHighLightVarCheck).toBeFalsy();
  });

  it('should get duration time correctly', () => {
    // Arrange
    component.defaultFilterTimeWithAllowance = new FilterTimeWithAllowance();
    component.defaultFilterTimeWithAllowance.fromDateTime = moment().format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    component.logInfo = Helper.fakeLogInfo;
    component.logInfo.logInfoDetail = new LogInfoDetail();
    component.logInfo.logInfoDetail.transVoidToTime = new Date();
    jest.spyOn(StaticService, 'getDurations').mockReturnValue('1 hour');

    // Act
    const result = component.getDurationTime();

    // Assert
    expect(result).toBe('1 hour');
    expect(StaticService.getDurations).toHaveBeenCalled();
  });

  it('should check if message range void time should be shown', () => {
    // Arrange
    component.logInfo = Helper.fakeLogInfo;
    component.logInfo.logInfoDetail = new LogInfoDetail();
    component.logInfo.logInfoDetail.isHasWarningRangeTime = true;
    component.filter = Helper.fakeFilterModel;
    jest.spyOn(StaticService, 'isDangerAccepted').mockReturnValue(true);

    // Act
    const result = component.isShowMessageRangeVoidTime();

    // Assert
    expect(result).toBeTruthy();
    expect(StaticService.isDangerAccepted).toHaveBeenCalledWith(component.filter.issueTypeId);
  });
});
