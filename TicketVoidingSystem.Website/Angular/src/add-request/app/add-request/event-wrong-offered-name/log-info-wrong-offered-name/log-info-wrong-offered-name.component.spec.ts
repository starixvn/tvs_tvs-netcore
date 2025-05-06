import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { LogInfoWrongOfferedNameComponent } from './log-info-wrong-offered-name.component';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterModel } from '../../filter/filter.model';
import { LogInfoWrongOfferedName } from '../models/log-info-wrong-offered-name.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { ValidationMessage } from '../../models/get-log-info.model';
import { CommonGroupTicketsModel } from '../../../../../utility/models/common.group-tickets.model';
import { CommonTicketModel } from '../../../../../utility/models/common.ticket.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../../utility/models/match.model';
import { FilterWrongOfferedNameModel } from '../models/filter-wrong-offered-name.model';
import { TicketsModel } from '../../pool-house-ticket/tickets/tickets.model';
import { GroupModel } from '../../pool-house-ticket/tickets/group-tickets.model';

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

  static readonly fakeLogInfo: LogInfoWrongOfferedName = {
    matchId: 1,
    matchModel: new MatchModel(),
    filterWrongOfferedName: new FilterWrongOfferedNameModel(),
    logInfoDetail: new LogInfoDetail(),
    messageValidationLogInfo: [
      { isError: false, reason: 'Test message' }
    ],
    tableTicketsModel: new TicketsModel(),
    isCollapse: false,
    titleTableTicket: 'Test Title',
    isInvalidTotalTickets: false,
    isHasSettledTicket: false,
    isHasInstantlySettledTicket: false
  } as LogInfoWrongOfferedName;

  static readonly fakePrimitiveProps: PrimitiveProperty = {
    isShowRelatedEvents: false,
    isBlock: false,
    inputRelatedMatchId: '',
    transInfoAddRequestModel: null,
    isShowLogInfo: false,
    transInfoAddRequest: null
  } as PrimitiveProperty;
}

describe('LogInfoWrongOfferedNameComponent', () => {
  let component: LogInfoWrongOfferedNameComponent;
  let fixture: ComponentFixture<LogInfoWrongOfferedNameComponent>;
  let modalService: ModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ModalService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LogInfoWrongOfferedNameComponent);
    modalService = fixture.debugElement.injector.get(ModalService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle collapse state when clicking header', () => {
    // Arrange
    component.logInfo = Helper.fakeLogInfo;
    component.logInfo.isCollapse = false;

    // Act
    component.clickHeader();

    // Assert
    expect(component.logInfo.isCollapse).toBeTruthy();
  });

  it('should show message when there are non-error validation messages', () => {
    // Arrange
    component.logInfo = Helper.fakeLogInfo;
    component.logInfo.messageValidationLogInfo = [
      { isError: false, reason: 'Test message' },
      { isError: true, reason: 'Error message' }
    ] as ValidationMessage[];

    // Act
    const result = component.isShowMessage();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should not show message when all validation messages are errors', () => {
    // Arrange
    component.logInfo = Helper.fakeLogInfo;
    component.logInfo.messageValidationLogInfo = [
      { isError: true, reason: 'Error message 1' },
      { isError: true, reason: 'Error message 2' }
    ] as ValidationMessage[];

    // Act
    const result = component.isShowMessage();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should emit search event', () => {
    // Arrange
    component.searchTicketEvent = {
      emit: jest.fn()
    } as any;

    // Act
    component.emitSearchEvent();

    // Assert
    expect(component.searchTicketEvent.emit).toHaveBeenCalled();
  });

  it('should open popup for transaction IDs', () => {
    // Arrange
    const requestId = 123;
    const transIds = '1,2,3';
    jest.spyOn(StaticService, 'openPopupTransIds');

    // Act
    component.openPopupTransIds(requestId, transIds);

    // Assert
    expect(StaticService.openPopupTransIds).toHaveBeenCalledWith(requestId, transIds, modalService);
  });

  it('should get issue type ID from filter', () => {
    // Arrange
    component.filter = Helper.fakeFilterModel;

    // Act
    const result = component.getIssueTypeId();

    // Assert
    expect(result).toBe(Number(Helper.fakeFilterModel.issueTypeId));
  });

  it('should get sub issue type ID from filter', () => {
    // Arrange
    component.filter = Helper.fakeFilterModel;

    // Act
    const result = component.getSubIssueTypeId();

    // Assert
    expect(result).toBe(Number(Helper.fakeFilterModel.subIssueTypeId));
  });

  it('should show template message when there are ticket groups', () => {
    // Arrange
    component.logInfo = Helper.fakeLogInfo;
    const group = new CommonGroupTicketsModel<CommonTicketModel>();
    group.tickets = [new CommonTicketModel()];
    component.logInfo.tableTicketsModel.groups = [group] as GroupModel[];

    // Act
    const result = component.isShowTemplateMessage();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should not show template message when there are no ticket groups', () => {
    // Arrange
    component.logInfo = Helper.fakeLogInfo;
    component.logInfo.tableTicketsModel.groups = [];

    // Act
    const result = component.isShowTemplateMessage();

    // Assert
    expect(result).toBeFalsy();
  });
});
