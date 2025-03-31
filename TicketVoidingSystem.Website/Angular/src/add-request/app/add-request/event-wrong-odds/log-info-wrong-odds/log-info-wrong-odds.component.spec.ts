import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { LogInfoWrongOddsComponent } from './log-info-wrong-odds.component';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { EventWrongOddsService } from '../services/event-wrong-odds.service';
import { AddRequestStore } from '../../add-request.store';
import { AddRequestApiService } from '../../add-request-api.service';
import { LogAnalysisService } from '../../services/log-analysis.service';
import { AffectedTicketService } from '../../affected-ticket/affected-ticket.service';
import { StaticService } from '../../../../../utility/services/static.service';
import { LogInfoWrongOdds } from '../models/log-info-wrong-odds.model';
import { FilterModel } from '../../filter/filter.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { SportType } from '../../../../../utility/constants/sport.constant';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { PoolHouseTicketsModel } from '../../pool-house-ticket/pool-house-ticket.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { ValidationMessage } from '../../models/get-log-info.model';
import { ValidationService } from '../services/validation.service';
import moment from 'moment-timezone';
import { FilterWrongOddsModel } from '../models/filter-wrong-odds.model';

class Helper {
  static readonly fakeRequestId = 1212;
  static readonly fakeFilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isChangeSubTypeManual: true,
    isAbnormal: false
  } as FilterModel;

  static readonly fakeLogInfoDetail = {
    matchId: 123,
    liveScores: '0-0',
    voidFromTime: new Date(),
    voidToTime: new Date(),
    singleCount: 0,
    mainParlayCount: 0,
    cashOutCount: 0,
    settleCount: 0,
    scoreOfMatch: '',
    scoreNormalTicket: '',
    instantlySettleCount: 0,
    cancelCashOutCount: 0,
    logInfoTicketsJson: null
  } as LogInfoDetail;

  static readonly fakeValidationMessage = [{
    isError: false,
    reason: ''
  }] as ValidationMessage[];

  static readonly fakeLogInfoWrongOdds = {
    matchId: 123,
    sportType: SportType.SOCCER,
    isShowValidation: false,
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: Helper.fakeValidationMessage,
    poolHouseCheckedBetTypes: null,
    isPoolHouseAffected: false,
    linkedLogsViewModel: {
      isLinkGroup1X2: false,
      isLinkGroupAIO: false
    },
    filterWrongOdds: {
      filterFromTransTime: null,
      filterToTransTime: null,
      liveIndicator: null,
      spread: '0.5',
      allowanceRate: '1',
      maxBet: 1000,
      maxBetAndSpreadInfo: [{
        maxBet: 1000,
        spread: '0.5',
        subIssueTypeId: '1'
      }],
      fromOddsNotVoidHomeOver: '1.5',
      toOddsNotVoidHomeOver: '2.5',
      fromOddsNotVoidAwayUnder: '3.5',
      toOddsNotVoidAwayUnder: '4.5',
      fromOddsNotVoidAwayOver: '5.5',
      toOddsNotVoidAwayOver: '6.5',
      fromOddsNotVoidHomeUnder: '7.5',
      toOddsNotVoidHomeUnder: '8.5',
      correctOddsAwayUnder: '1.5',
      correctOddsHomeOver: '2.5',
      correctOddsAwayOver: '3.5',
      correctOddsHomeUnder: '4.5',
      wrongOddsAwayUnder: '5.5',
      wrongOddsHomeOver: '6.5',
      wrongOddsAwayOver: '7.5',
      wrongOddsHomeUnder: '8.5'
    } as FilterWrongOddsModel,
  } as LogInfoWrongOdds;

  static readonly fakePrimitiveProperty = {
    isShowLogInfoMainMatch: false,
    isShowRelatedEvents: false,
    isBlock: false,
    filterBy: 1,
    transInfoAddRequestModel: {
      transInfoJson: null,
      unMarkTransIds: null,
      markTransIds: null,
      removeTransIds: null
    }
  } as PrimitiveProperty;
}

describe('LogInfoWrongOddsComponent', () => {
  let component: LogInfoWrongOddsComponent;
  let fixture: ComponentFixture<LogInfoWrongOddsComponent>;
  let modalService: ModalService;
  let eventWrongOddsService: EventWrongOddsService;
  let addRequestStore: AddRequestStore;
  let addRequestApiService: AddRequestApiService;
  let logAnalysisService: LogAnalysisService;
  let affectedTicketService: AffectedTicketService;
  let validationService: ValidationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ModalService,
        EventWrongOddsService,
        AddRequestStore,
        AddRequestApiService,
        LogAnalysisService,
        AffectedTicketService,
        ValidationService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LogInfoWrongOddsComponent);
    modalService = fixture.debugElement.injector.get(ModalService);
    eventWrongOddsService = fixture.debugElement.injector.get(EventWrongOddsService);
    addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    addRequestApiService = fixture.debugElement.injector.get(AddRequestApiService);
    logAnalysisService = fixture.debugElement.injector.get(LogAnalysisService);
    affectedTicketService = fixture.debugElement.injector.get(AffectedTicketService);
    validationService = fixture.debugElement.injector.get(ValidationService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with isShowValidation true when in edit mode', () => {
    // Arrange
    component.isEdit = true;
    component.logInfo = Helper.fakeLogInfoWrongOdds;

    // Act
    component.ngOnInit();

    // Assert
    expect(component.logInfo.isShowValidation).toBeTruthy();
  });

  it('should recalculate pool house ticket and emit search event', () => {
    // Arrange
    component.logInfo = Helper.fakeLogInfoWrongOdds;
    const model = new PoolHouseTicketsModel();
    model.checkedBetTypes = '1,2,3';
    component.searchEvent = {
      emit: jest.fn()
    } as any;

    // Act
    component.recalculatePoolHouseTicket(model);

    // Assert
    expect(component.logInfo.poolHouseCheckedBetTypes).toEqual('1,2,3');
    expect(component.searchEvent.emit).toHaveBeenCalled();
  });

  it('should clear data validation', () => {
    // Arrange
    component.logInfo = Helper.fakeLogInfoWrongOdds;
    component.logInfo.logInfoDetail = Helper.fakeLogInfoDetail;
    component.logInfo.messageValidationLogInfo = Helper.fakeValidationMessage;

    // Act
    component.clearDataValidation();

    // Assert
    expect(component.logInfo.logInfoDetail).toBeNull();
    expect(component.logInfo.messageValidationLogInfo).toBeNull();
  });

  it('should open popup trans ids', () => {
    // Arrange
    const requestId = 123;
    const transIds = '1,2,3';
    StaticService.openPopupTransIds = jest.fn();

    // Act
    component.openPopupTransIds(requestId, transIds);

    // Assert
    expect(StaticService.openPopupTransIds).toHaveBeenCalledWith(requestId, transIds, modalService);
  });

  it('should count info content', () => {
    // Arrange
    const cashOutCount = 1;
    const settleCount = 2;
    const instantlySettleCount = 3;
    StaticService.countInfoContent = jest.fn().mockReturnValue('test content');

    // Act
    const result = component.countInfoContent(cashOutCount, settleCount, instantlySettleCount);

    // Assert
    expect(StaticService.countInfoContent).toHaveBeenCalledWith(cashOutCount, settleCount, instantlySettleCount);
    expect(result).toBe('test content');
  });

  it('should display trans id correctly', () => {
    // Act & Assert
    expect(component.displayTransId(0, '123')).toBe('-');
    expect(component.displayTransId(1, '123')).toBe('123');
  });

  it('should show count info', () => {
    // Arrange
    const cashOutCount = 1;
    const settleCount = 2;
    const instantlySettleCount = 3;
    StaticService.isShowCountInfo = jest.fn().mockReturnValue(true);

    // Act
    const result = component.isShowCountInfo(cashOutCount, settleCount, instantlySettleCount);

    // Assert
    expect(StaticService.isShowCountInfo).toHaveBeenCalledWith(cashOutCount, settleCount, instantlySettleCount);
    expect(result).toBeTruthy();
  });

  it('should show affected tickets details', () => {
    // Arrange
    component.filter = Helper.fakeFilterModel;
    component.logInfo = Helper.fakeLogInfoWrongOdds;
    component.logInfo.logInfoDetail = {
      ...Helper.fakeLogInfoDetail,
      logInfoTicketsJson: 'test json'
    } as LogInfoDetail;

    // Act
    component.showAffectedTicketsDetails();

    // Assert
    expect(component.affectedTicketsModel.issueTypeId).toBe(Number(Helper.fakeFilterModel.issueTypeId));
    expect(component.affectedTicketsModel.logInfoTicketsJson).toBe('test json');
    expect(component.affectedTicketsModel.isOpen).toBeTruthy();
  });

  it('should open pool house details', async () => {
    // Arrange
    component.requestId = Helper.fakeRequestId;
    component.filter = Helper.fakeFilterModel;
    component.logInfo = Helper.fakeLogInfoWrongOdds;
    addRequestStore.changeBlockingUiStatus = jest.fn();
    eventWrongOddsService.getLinkedLog = jest.fn().mockResolvedValue({});
    addRequestApiService.getPoolHouseTickets = jest.fn().mockResolvedValue({
      groupBetTypes: [],
      affectedTickets: [],
      otherTickets: []
    });
    logAnalysisService.writeLogClickPoolHouseDetails = jest.fn();

    // Act
    await component.openPoolHouseDetails();

    // Assert
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
    expect(eventWrongOddsService.getLinkedLog).toHaveBeenCalled();
    expect(addRequestApiService.getPoolHouseTickets).toHaveBeenCalled();
    expect(logAnalysisService.writeLogClickPoolHouseDetails).toHaveBeenCalled();
    expect(component.poolHouseTicketsModel.isOpen).toBeTruthy();
  });

  it('should check if sport type is soccer', () => {
    // Arrange
    component.logInfo = Helper.fakeLogInfoWrongOdds;

    // Act & Assert
    expect(component.isSportTypeSoccer()).toBeTruthy();

    // Arrange
    component.logInfo.sportType = 2;

    // Act & Assert
    expect(component.isSportTypeSoccer()).toBeFalsy();
  });

  it('should display full date time format', () => {
    // Arrange
    const date = new Date('2024-01-01T12:00:00');

    // Act
    const result = component.displayFullDateTimeFormat(date);

    // Assert
    expect(result).toBe(moment(date).format(DateTimeFormat.FULL_DATE_TIME_FORMAT));
  });
});
