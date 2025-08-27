import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { LogInfoEkoComponent } from './log-info-eko.component';
import { LogInfoService } from '../services/log-info.service';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { LogInfoEarlyKickOff } from '../models/log-info-eko.model';
import { StaticService } from '../../../../../utility/services/static.service';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { IssueTypes } from '../../filter/issue-types.model';
import { GroupModel } from '../tickets-list/group-tickets.model';
import { EventEarlyKickOffService } from '../services/event-eko.service';

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
  static readonly fakeLogInfoEko = {
    matchId: 123,
    sportType: 1,
    isMainMatch: true,
    eventDate: new Date(),
    subIssueTypeId: 1,
    filterFromTransTime: '',
    filterToTransTime: '',
    isCollapse: false,
    isRenderedTickets: false,
    messageValidationLogInfo: [],
    tableTicketsModel: {
      groups: []
    }
  } as unknown as LogInfoEarlyKickOff;
}

describe('LogInfoEkoComponent', () => {
  let component: LogInfoEkoComponent;
  let fixture: ComponentFixture<LogInfoEkoComponent>;
  let logInfoService: LogInfoService;
  let addRequestStore: AddRequestStore;
  let staticService: StaticService;
  let modalService: ModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        LogInfoService,
        AddRequestStore,
        StaticService,
        ModalService,
        EventEarlyKickOffService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LogInfoEkoComponent);
    logInfoService = fixture.debugElement.injector.get(LogInfoService);
    addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    staticService = fixture.debugElement.injector.get(StaticService);
    modalService = fixture.debugElement.injector.get(ModalService);
    component = fixture.componentInstance;

    // Set default input values
    component.isMainMatch = true;
    component.isEdit = false;
    component.filter = Helper.fakeFilterModel;
    component.logInfo = Helper.fakeLogInfoEko;
    component.requestId = Helper.fakeRequestId;
    component.issueTypes = new IssueTypes();

    // Mock addRequestStore methods
    addRequestStore.changeBlockingUiStatus = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle click header when collapsing', async () => {
    // Arrange
    component.logInfo.isCollapse = true;
    logInfoService.getTickets = jest.fn().mockResolvedValue(undefined);
    logInfoService.assignTemplateMessageValueToEvent = jest.fn();

    // Act
    await component.clickHeader();

    // Assert
    expect(component.logInfo.isCollapse).toBeFalsy();
    expect(component.isBlock).toBeFalsy();
    expect(logInfoService.getTickets).toHaveBeenCalledWith(
      component.logInfo,
      component.isEdit,
      component.requestId,
      component.filter
    );
    expect(logInfoService.assignTemplateMessageValueToEvent).toHaveBeenCalledWith(component.logInfo);
  });

  it('should handle click header when expanding', async () => {
    // Arrange
    component.logInfo.isCollapse = false;
    logInfoService.getTickets = jest.fn().mockResolvedValue(undefined);

    // Act
    await component.clickHeader();

    // Assert
    expect(component.logInfo.isCollapse).toBeTruthy();
    expect(component.isBlock).toBeFalsy();
    expect(logInfoService.getTickets).not.toHaveBeenCalled();
  });

  it('should handle paging event', async () => {
    // Arrange
    logInfoService.getTickets = jest.fn().mockResolvedValue(undefined);

    // Act
    await component.pagingEvent();

    // Assert
    expect(component.isBlock).toBeFalsy();
    expect(component.logInfo.isRenderedTickets).toBeFalsy();
    expect(logInfoService.getTickets).toHaveBeenCalledWith(
      component.logInfo,
      component.isEdit,
      component.requestId,
      component.filter
    );
  });

  it('should check if show message', () => {
    // Arrange
    component.logInfo.messageValidationLogInfo = [
      { isError: false, reason: 'Test message 1' },
      { isError: true, reason: 'Test message 2' }
    ];

    // Act
    const result = component.isShowMessage();

    // Assert
    expect(result).toBeTruthy();
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

  it('should get issue type id', () => {
    // Act
    const result = component.getIssueTypeId();

    // Assert
    expect(result).toBe(Number(component.filter.issueTypeId));
  });

  it('should get sub issue type id', () => {
    // Act
    const result = component.getSubIssueTypeId();

    // Assert
    expect(result).toBe(Number(component.filter.subIssueTypeId));
  });

  it('should check if not show template message when groups is undefined', () => {
    // Arrange
    component.logInfo.tableTicketsModel.groups = undefined;

    // Act
    const result = component.isNotShowTemplateMessage();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should check if not show template message when groups is empty', () => {
    // Arrange
    component.logInfo.tableTicketsModel.groups = [];

    // Act
    const result = component.isNotShowTemplateMessage();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should check if not show template message when groups is null', () => {
    // Arrange
    component.logInfo.tableTicketsModel.groups = null;

    // Act
    const result = component.isNotShowTemplateMessage();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should show template message when groups has items', () => {
    // Arrange
    const mockGroup = {
      name: 'Test Group',
      isExpanded: true,
      tickets: [],
      displayTotalTickets: 0,
      setCommonValue: jest.fn(),
      mapTickets: jest.fn()
    } as unknown as GroupModel;
    component.logInfo.tableTicketsModel.groups = [mockGroup];

    // Act
    const result = component.isNotShowTemplateMessage();

    // Assert
    expect(result).toBeFalsy();
  });
});
