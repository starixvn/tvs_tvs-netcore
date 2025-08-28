import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { LogInfoWrongHdpComponent } from './log-info-wrong-hdp.component';
import { ValidationService } from '../services/validation.service';
import { LogInfoService } from '../services/log-info.service';
import { EventWrongHdpService } from '../services/event-wrong-hdp.service';
import { AddRequestStore } from '../../../../../services/add-request.store';
import { LogInfoWrongHdp } from '../models/log-info-wrong-hdp.model';
import { FilterWithHdpComponent } from '../filter-with-hdp/filter-with-hdp.component';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { StaticService } from '../../../../../../utility/services/static.service';
import { ModalService } from '../../../../../../utility/components/modal/modal.service';
import { AddRequestApiService } from '../../../../../services/add-request-api.service';
import { AffectedTicketService } from '../../../../../component/affected-ticket/affected-ticket.service';
import { LogAnalysisService } from '../../../../../services/log-analysis.service';
import { DateTimeFormat } from '../../../../../../utility/constants/config';
import moment from 'moment-timezone';
import { LogInfoDetail } from '../../../../../../utility/models/log-info-detail.model';
import { PoolHouseTicketsModel } from '../../../../../component/pool-house-ticket/pool-house-ticket.model';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { OthersModel } from '../../../../../component/others/others.model';

class Helper {
  static readonly fakeRequestId = 1212;
  static readonly fakeUserId = 123;
  static readonly fakeRequestedBy = 'testUser';
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isChangeSubTypeManual: true,
    isAbnormal: false
  } as FilterModel;
  static readonly fakeOthersModel = new OthersModel();
  static readonly fakeLogInfoWrongHdp = {
    matchId: 123,
    sportType: 1,
    isMainMatch: true,
    eventDate: new Date(),
    subIssueTypeId: 1,
    filterFromTransTime: '',
    filterToTransTime: '',
    homeFavorite: '',
    awayFavorite: '',
    actualMarket: '',
    hdpValue: '',
    poolHouseCheckedBetTypes: '',
    isPoolHouseAffected: false,
    logInfoDetail: null,
    isLinkGroup1X2: false,
    isLinkGroupAIO: false,
    liveIndicator: 0,
    filterBetIdX: '',
    filterBetIdY: '',
    filterBetTypeId: '',
    leagueName: 'Test League',
    eventName: 'Test Event',
    filterWithHdp: {},
    linkedLogsViewModel: {},
    isShowValidation: false,
    messageValidationLogInfo: null
  } as unknown as LogInfoWrongHdp;
}

describe('LogInfoWrongHdpComponent', () => {
  let component: LogInfoWrongHdpComponent;
  let fixture: ComponentFixture<LogInfoWrongHdpComponent>;
  let validationService: ValidationService;
  let logInfoService: LogInfoService;
  let eventWrongHdpService: EventWrongHdpService;
  let addRequestStore: AddRequestStore;
  let staticService: StaticService;
  let modalService: ModalService;
  let addRequestApiService: AddRequestApiService;
  let affectedTicketService: AffectedTicketService;
  let logAnalysisService: LogAnalysisService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService,
        LogInfoService,
        EventWrongHdpService,
        AddRequestStore,
        StaticService,
        ModalService,
        AddRequestApiService,
        AffectedTicketService,
        LogAnalysisService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LogInfoWrongHdpComponent);
    validationService = fixture.debugElement.injector.get(ValidationService);
    logInfoService = fixture.debugElement.injector.get(LogInfoService);
    eventWrongHdpService = fixture.debugElement.injector.get(EventWrongHdpService);
    addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    staticService = fixture.debugElement.injector.get(StaticService);
    modalService = fixture.debugElement.injector.get(ModalService);
    addRequestApiService = fixture.debugElement.injector.get(AddRequestApiService);
    affectedTicketService = fixture.debugElement.injector.get(AffectedTicketService);
    logAnalysisService = fixture.debugElement.injector.get(LogAnalysisService);
    component = fixture.componentInstance;

    // Set default input values
    component.isMainMatch = true;
    component.isEdit = false;
    component.filter = Helper.fakeFilterModel;
    component.logInfo = Helper.fakeLogInfoWrongHdp;
    component.isDisabled = false;
    component.requestId = Helper.fakeRequestId;
    component.primitiveProps = new PrimitiveProperty();

    // Mock addRequestStore methods
    addRequestStore.changeBlockingUiStatus = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values when not in edit mode', () => {
    // Arrange
    component.isEdit = false;

    // Act
    component.ngOnInit();

    // Assert
    expect(component.logInfo.isShowValidation).toBeFalsy();
  });

  it('should initialize with existing values when in edit mode', () => {
    // Arrange
    component.isEdit = true;

    // Act
    component.ngOnInit();

    // Assert
    expect(component.logInfo.isShowValidation).toBeTruthy();
  });

  it('should refresh log info by search event', async () => {
    // Arrange
    component.filterWithHdpComponent = {
      isValid: jest.fn().mockReturnValue(true)
    } as unknown as FilterWithHdpComponent;
    logInfoService.getLogInfo = jest.fn().mockResolvedValue(undefined);

    // Act
    await component.refreshLogInfoBySearchEvent();

    // Assert
    expect(component.isBlock).toBeFalsy();
    expect(component.logInfo.isShowValidation).toBeTruthy();
    expect(logInfoService.getLogInfo).toHaveBeenCalledWith(
      [component.logInfo],
      component.isEdit,
      component.requestId,
      component.filter,
      component.primitiveProps
    );
  });

  it('should refresh log info by pool house event', async () => {
    // Arrange
    component.filterWithHdpComponent = {
      isValid: jest.fn().mockReturnValue(true)
    } as unknown as FilterWithHdpComponent;
    logInfoService.getLogInfo = jest.fn().mockResolvedValue(undefined);

    // Act
    await component.refreshLogInfoByPoolHouseEvent();

    // Assert
    expect(component.isBlock).toBeFalsy();
    expect(component.logInfo.isShowValidation).toBeTruthy();
    expect(logInfoService.getLogInfo).toHaveBeenCalledWith(
      [component.logInfo],
      component.isEdit,
      component.requestId,
      component.filter,
      component.primitiveProps
    );
  });

  it('should not refresh log info when filter is invalid', async () => {
    // Arrange
    component.filterWithHdpComponent = {
      isValid: jest.fn().mockReturnValue(false)
    } as unknown as FilterWithHdpComponent;
    logInfoService.getLogInfo = jest.fn();

    // Act
    await component['refreshLogInfo']();

    // Assert
    expect(component.isBlock).toBeFalsy();
    expect(logInfoService.getLogInfo).not.toHaveBeenCalled();
  });

  it('should recalculate pool house ticket', async () => {
    // Arrange
    const model = { checkedBetTypes: 'test' } as PoolHouseTicketsModel;
    component.refreshLogInfoByPoolHouseEvent = jest.fn();

    // Act
    component.recalculatePoolHouseTicket(model);

    // Assert
    expect(component.logInfo.poolHouseCheckedBetTypes).toBe('test');
    expect(component.refreshLogInfoByPoolHouseEvent).toHaveBeenCalled();
  });

  it('should display full date time format', () => {
    // Arrange
    const time = new Date();
    const expectedFormat = moment(time).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);

    // Act
    const result = component.displayFullDateTimeFormat(time);

    // Assert
    expect(result).toBe(expectedFormat);
  });

  it('should handle delete event', () => {
    // Arrange
    const matchId = 123;
    component.deleteEvent.emit = jest.fn();

    // Act
    component.handleDeleteEvent(matchId);

    // Assert
    expect(component.deleteEvent.emit).toHaveBeenCalledWith(matchId);
  });

  it('should clear data validation', () => {
    // Act
    component.clearDataValidation();

    // Assert
    expect(component.logInfo.isShowValidation).toBeFalsy();
    expect(component.logInfo.logInfoDetail).toBeNull();
    expect(component.logInfo.messageValidationLogInfo).toBeNull();
  });

  it('should reset pool house checked bet types', () => {
    // Act
    component.resetPoolHouseCheckedBetTypes();

    // Assert
    expect(component.logInfo.poolHouseCheckedBetTypes).toBe('All');
  });

  it('should emit search event', () => {
    // Arrange
    component.searchTicketEvent.emit = jest.fn();

    // Act
    component.emitSearchEvent();

    // Assert
    expect(component.searchTicketEvent.emit).toHaveBeenCalled();
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

  it('should check if have pool house ticket', () => {
    // Arrange
    const singleCount = 1;
    const parlayCount = 0;

    // Act
    const result = component.isHavePoolHouseTicket(singleCount, parlayCount);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should count info content', () => {
    // Arrange
    const cashOutCount = 1;
    const settleCount = 2;
    const instantlySettleCount = 3;
    StaticService.countInfoContent = jest.fn().mockReturnValue('test');

    // Act
    const result = component.countInfoContent(cashOutCount, settleCount, instantlySettleCount);

    // Assert
    expect(result).toBe('test');
    expect(StaticService.countInfoContent).toHaveBeenCalledWith(cashOutCount, settleCount, instantlySettleCount);
  });

  it('should check if show count info', () => {
    // Arrange
    const cashOutCount = 1;
    const settleCount = 2;
    const instantlySettleCount = 3;
    StaticService.isShowCountInfo = jest.fn().mockReturnValue(true);

    // Act
    const result = component.isShowCountInfo(cashOutCount, settleCount, instantlySettleCount);

    // Assert
    expect(result).toBeTruthy();
    expect(StaticService.isShowCountInfo).toHaveBeenCalledWith(cashOutCount, settleCount, instantlySettleCount);
  });

  it('should display trans id', () => {
    // Arrange
    const ticketCount = 0;
    const transId = '123';

    // Act
    const result = component.displayTransId(ticketCount, transId);

    // Assert
    expect(result).toBe('-');
  });

  it('should show affected tickets details', () => {
    // Arrange
    component.logInfo.logInfoDetail = { logInfoTicketsJson: 'test' } as LogInfoDetail;

    // Act
    component.showAffectedTicketsDetails();

    // Assert
    expect(component.affectedTicketsModel.issueTypeId).toBe(Number(component.filter.issueTypeId));
    expect(component.affectedTicketsModel.logInfoTicketsJson).toBe('test');
    expect(component.affectedTicketsModel.isOpen).toBeTruthy();
  });

  it('should open pool house details', async () => {
    // Arrange
    const query = { test: 'test' };
    component['initGetPoolHouseTicketQuery'] = jest.fn().mockReturnValue(query);
    eventWrongHdpService.getLinkedLog = jest.fn().mockResolvedValue({ isLinkGroup1X2: true, isLinkGroupAIO: true });
    addRequestApiService.getPoolHouseTickets = jest.fn().mockResolvedValue({
      groupBetTypes: [],
      affectedTickets: [],
      otherTickets: []
    });
    logAnalysisService.writeLogClickPoolHouseDetails = jest.fn().mockResolvedValue(undefined);
    addRequestStore.changeBlockingUiStatus = jest.fn();

    // Act
    await component.openPoolHouseDetails();

    // Assert
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    expect(component.poolHouseTicketsModel.query).toBe(query);
    expect(component.poolHouseTicketsModel.isOpen).toBeTruthy();
  });

  it('should check if sport type is soccer', () => {
    // Arrange
    component.logInfo.sportType = 1;

    // Act
    const result = component.isSportTypeSoccer();

    // Assert
    expect(result).toBeTruthy();
  });
});
