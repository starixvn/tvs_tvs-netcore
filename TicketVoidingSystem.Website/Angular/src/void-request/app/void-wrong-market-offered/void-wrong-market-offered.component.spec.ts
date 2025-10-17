import { QueryList } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestDetailViewModel } from '../../../add-request-new/models/request-detail.model';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { IssueTypesModel } from '../../../utility/models/issue-type.model';
import { TestingModule } from '../../../utility/modules/testing.module';
import { MessageAreaComponent } from '../message-area/message-area.component';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { TicketsService } from '../services/tickets.service';
import { VoidPageCommonService } from '../services/void-page-common.service';
import { VoidWrongMarketOfferedModel } from './models/void-wrong-market-offered.model';
import { TemplateMessageService } from './services/template-message.service';
import { VoidPageService } from './services/void-page.service';
import { VoidWrongMarketOfferedComponent } from './void-wrong-market-offered.component';

class Helper {
  static readonly fakeRequestDetail = {
    requestId: 1,
    request: {
      issueTypeId: 1,
      requestId: 1
    },
    wrongMarketOfferedModels: [
      {
        id: 1,
        matchId: 1,
        requestDetailId: 1,
        subIssueTypeId: 1
      }
    ]
  } as RequestDetailViewModel;

  static readonly fakeIssueTypes = {
    issueTypes: [
      { issueTypeId: 1, issueTypeName: 'Test Issue Type' }
    ],
    subIssueTypes: [
      {
        issueTypeId: 1,
        subIssueTypeId: 1,
        subIssueTypeName: 'Test Sub Issue Type',
        subIssueTypeNameCS: 'Test Sub Issue Type CS'
      }
    ]
  } as IssueTypesModel;

  static readonly fakeVoidPageItems = [
    {
      id: 1,
      subIssueType: Helper.fakeIssueTypes.subIssueTypes[0],
      displayIssueTypeName: 'Test Issue Type',
      matchModel: {
        matchId: 1,
        matchCode: 'TEST001',
        leagueName: 'Test League',
        matchEvent: 'Test Event',
        sportType: 1
      },
      detailViewModel: Helper.fakeRequestDetail,
      requestDetailId: 1,
      logInfoDetail: {
        matchId: 1,
        liveScores: '1-0',
        voidFromTime: new Date('2023-01-01'),
        voidToTime: new Date('2023-01-02'),
        transVoidToTime: new Date('2023-01-02'),
        singleCount: 5,
        cashOutCount: 2,
        settleCount: 1,
        instantlySettleCount: 1,
        mainParlayCount: 1,
        cancelCashOutCount: 0,
        scoreNormalTicket: '1-0',
        scoreOfMatch: '1-0',
        minTransId: '123456',
        actionType: 'Void'
      },
      isAllLiveTickets: true,
      voidTicketsMini: {
        total: 10,
        isAllLiveTickets: true,
        groupPHAffected: 'Test Group',
        fromTime: 1672531200000,
        toTime: 1672617600000,
        betTypeNameReplaceMessage: null,
        licenseeAffectedList: []
      },
      templateValue: {
        groupPHAffected: 'Test Group',
        checkSettled: false,
        eventType: 'LIVE',
        totalTickets: 10,
        fromTransTime: 1672531200000,
        toTransTime: 1672617600000,
        isCheckedSpecialBetType: true,
        betTypeNameReplaceMessage: null
      },
      voidReason: {
        reasonEnglish: 'Test Reason',
        reasonChineseSimplified: '测试原因'
      },
      licenseeAffectedList: []
    }
  ] as unknown as VoidWrongMarketOfferedModel[];

  static readonly fakePrimitiveProperty = {
    isBlockUI: false,
    userName: 'user60',
    isLoadedBasicData: true,
    isLoadedUnderneathData: true,
    isRunningSubscriptionCallback: false
  } as CommonPrimitiveProperty;
}

describe('VoidWrongMarketOfferedComponent', () => {
  let component: VoidWrongMarketOfferedComponent;
  let fixture: ComponentFixture<VoidWrongMarketOfferedComponent>;
  let voidPageService: VoidPageService;
  let ticketsService: TicketsService;
  let voidPageCommonService: VoidPageCommonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        VoidPageService,
        TicketsService,
        VoidPageCommonService,
        TemplateMessageService
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(VoidWrongMarketOfferedComponent);
    voidPageService = fixture.debugElement.injector.get(VoidPageService);
    ticketsService = fixture.debugElement.injector.get(TicketsService);
    voidPageCommonService = fixture.debugElement.injector.get(VoidPageCommonService);
    component = fixture.componentInstance;
    component.tooltip = {} as Tooltip;
    document.body.setAttribute('user-name', 'user60');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.primitiveProperty).toBeInstanceOf(CommonPrimitiveProperty);
    expect(component.voidPageItems).toEqual([]);
    expect(component.issueTypes).toBeUndefined();
    expect(component.tooltip).toBeDefined();
  });

  it('should initialize component properties on ngOnInit', async () => {
    // Arrange
    component.requestDetail = Helper.fakeRequestDetail;
    voidPageService.getIssueTypes = jest.fn().mockResolvedValue(Helper.fakeIssueTypes);
    voidPageService.getBasicVoidPageItemsData = jest.fn().mockResolvedValue(Helper.fakeVoidPageItems);
    voidPageService.loadUnderneathVoidPageItemsData = jest.fn().mockResolvedValue(undefined);
    
    // Mock document.body.getAttribute without breaking DOM
    const originalGetAttribute = document.body.getAttribute;
    document.body.getAttribute = jest.fn().mockReturnValue('testuser');

    // Act
    await component.ngOnInit();

    // Assert
    expect(component.primitiveProperty.isBlockUI).toBeFalsy();
    expect(component.primitiveProperty.userName).toBe('testuser');
    expect(component.issueTypes).toEqual(Helper.fakeIssueTypes);
    expect(component.voidPageItems).toEqual(Helper.fakeVoidPageItems);
    expect(component.primitiveProperty.isLoadedBasicData).toBeTruthy();
    expect(component.primitiveProperty.isLoadedUnderneathData).toBeTruthy();
    expect(voidPageService.getIssueTypes).toHaveBeenCalled();
    expect(voidPageService.getBasicVoidPageItemsData).toHaveBeenCalledWith(Helper.fakeIssueTypes, Helper.fakeRequestDetail);
    expect(voidPageService.loadUnderneathVoidPageItemsData).toHaveBeenCalledWith(Helper.fakeVoidPageItems, Helper.fakeRequestDetail);
    
    // Restore original method
    document.body.getAttribute = originalGetAttribute;
  });

  it('should handle onClickShowVoidTickets', async () => {
    // Arrange
    const voidPageItem = Helper.fakeVoidPageItems[0];
    component.requestDetail = Helper.fakeRequestDetail;
    component.primitiveProperty = Helper.fakePrimitiveProperty;
    component.voidPageItems = Helper.fakeVoidPageItems;
    voidPageCommonService.onClickShowVoidTickets = jest.fn();

    // Act
    await component.onClickShowVoidTickets(voidPageItem);

    // Assert
    expect(voidPageCommonService.onClickShowVoidTickets).toHaveBeenCalledWith(
      voidPageItem,
      Helper.fakeRequestDetail,
      Helper.fakePrimitiveProperty,
      Helper.fakeVoidPageItems
    );
  });

  it('should handle onPagingTicketsChange', async () => {
    // Arrange
    const voidPageItem = Helper.fakeVoidPageItems[0];
    component.requestDetail = Helper.fakeRequestDetail;
    ticketsService.loadVoidTicketsFullOnPagingChange = jest.fn();

    // Act
    await component.onPagingTicketsChange(voidPageItem);

    // Assert
    expect(ticketsService.loadVoidTicketsFullOnPagingChange).toHaveBeenCalledWith(
      voidPageItem,
      Helper.fakeRequestDetail
    );
  });

  it('should handle exportTickets', async () => {
    // Arrange
    const voidPageItem = Helper.fakeVoidPageItems[0];
    component.requestDetail = Helper.fakeRequestDetail;
    voidPageCommonService.exportTickets = jest.fn();

    // Act
    await component.exportTickets(voidPageItem);

    // Assert
    expect(voidPageCommonService.exportTickets).toHaveBeenCalledWith(
      voidPageItem,
      Helper.fakeRequestDetail
    );
  });

  it('should handle onClickShowTemplateMessage', async () => {
    // Arrange
    const voidPageItem = Helper.fakeVoidPageItems[0];
    component.primitiveProperty = Helper.fakePrimitiveProperty;
    component.requestDetail = Helper.fakeRequestDetail;
    component.voidPageItems = Helper.fakeVoidPageItems;
    const mockSubscription = { unsubscribe: jest.fn() };
    Object.defineProperty(component, 'afterLoadUnderneathDataSubscription', {
      value: mockSubscription,
      writable: true
    });
    voidPageCommonService.onClickShowTemplateMessage = jest.fn();

    // Act
    await component.onClickShowTemplateMessage(voidPageItem);

    // Assert
    expect(voidPageCommonService.onClickShowTemplateMessage).toHaveBeenCalledWith(
      voidPageItem,
      Helper.fakePrimitiveProperty,
      Helper.fakeRequestDetail,
      mockSubscription,
      Helper.fakeVoidPageItems
    );
  });

  it('should handle onClickVoidAllMatches', () => {
    // Arrange
    component.voidPageItems = Helper.fakeVoidPageItems;
    component.primitiveProperty = Helper.fakePrimitiveProperty;
    component.tooltip.display = jest.fn();
    const mockMessageAreaComponents = {
      toArray: jest.fn().mockReturnValue([])
    } as unknown as QueryList<MessageAreaComponent>;
    component.messageAreaComponents = mockMessageAreaComponents;
    const mockSubscription = { unsubscribe: jest.fn() };
    Object.defineProperty(component, 'afterLoadUnderneathDataSubscription', {
      value: mockSubscription,
      writable: true
    });
    voidPageCommonService.onClickVoidAllMatches = jest.fn();

    // Act
    component.onClickVoidAllMatches();

    // Assert
    expect(voidPageCommonService.onClickVoidAllMatches).toHaveBeenCalled();
  });

  it('should set primitiveProperty.isBlockUI to true during initialization', async () => {
    // Arrange
    component.requestDetail = Helper.fakeRequestDetail;
    voidPageService.getIssueTypes = jest.fn().mockResolvedValue(Helper.fakeIssueTypes);
    voidPageService.getBasicVoidPageItemsData = jest.fn().mockResolvedValue(Helper.fakeVoidPageItems);
    voidPageService.loadUnderneathVoidPageItemsData = jest.fn().mockResolvedValue(undefined);

    // Act
    const initPromise = component.ngOnInit();
    expect(component.primitiveProperty.isBlockUI).toBeTruthy();
    await initPromise;

    // Assert
    expect(component.primitiveProperty.isBlockUI).toBeFalsy();
  });
});
