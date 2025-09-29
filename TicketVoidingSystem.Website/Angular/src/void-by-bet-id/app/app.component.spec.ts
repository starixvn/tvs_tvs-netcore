import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { TemplateMessageService } from './services/template-message.service';
import { ValidationService } from './services/validation.service';
import { CommonService } from '../../utility/services/common.service';
import { VoidTicketsService } from './services/void-tickets.service';
import { FilterComponent } from './filter/filter.component';
import { ConfirmationComponent } from '../../utility/components/confirmation/confirmation.component';
import { TemplateMessageComponent } from '../../utility/components/template-message/template-message/template-message.component';
import { GetTicketsQuery, TicketsViewModel } from './model/get-tickets.query';
import { MatchModel } from '../../utility/models/match.model';
import { Result } from '../../utility/models/result';
import { SubIssueType } from '../../utility/models/issue-type.model';
import { PrimitiveProperty, VoidTicketsRequest } from './model/void-by-bet-id.model';
import { TestingModule } from '../../utility/modules/testing.module';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { GroupModel } from '../../utility/components/tickets/group.model';
import { TemplateValue } from '../../utility/components/template-message/template-message/template.model';
import { TicketsService } from '../../utility/components/tickets/tickets.service';

class Helper {
  static readonly fakeTicketsViewModel = {
    totalItems: 1,
    matchId: 1,
    match: new MatchModel(),
    tickets: [],
    invalidTransIds: '1',
    movedTransIds: '2',
    groups: [{
      name: 'a',
      tickets: [{
        transId: '123',
        betId: '1',
        betType: 1,
        betAmount: 1,
        betStatus: 1,
        isChecked: false,
        isDisabled: false,
        mainTransId: '123'
      }]
    }] as unknown as GroupModel[],
    changeIconCheckBox: jest.fn(),
    getAllTicket: jest.fn().mockReturnValue([]),
    checkSettledTickets: jest.fn().mockReturnValue(false)
  } as unknown as TicketsViewModel;

  static readonly fakeMatchViewModel = {
    matchId: 1,
    matchName: 'a',
    matchDate: '2021-01-01',
    matchTime: '10:00',
    matchStatus: 1,
  } as unknown as MatchModel;

  static readonly fakeSubIssueTypes: SubIssueType[] = [
    { subIssueTypeId: 1, issueTypeId: 1, subIssueTypeName: 'Type 1', subIssueTypeNameCS: 'Type 1 CS' },
    { subIssueTypeId: 2, issueTypeId: 1, subIssueTypeName: 'Type 2', subIssueTypeNameCS: 'Type 2 CS' }
  ];

  static readonly fakeResult: Result<null>[] = [
    { errorCode: 0, errorMsg: 'Success', isSuccessful: true }
  ];

  static readonly fakeVoidTicketsRequest: VoidTicketsRequest = {
    tickets: [],
    transIdCrickets: [],
    password: '',
    username: '',
    reason: '',
    reasonSC: '',
    guid: 'test-guid',
    match: new MatchModel(),
    abnormalBetType: 0,
    issueTypeId: 0,
    subIssueTypeId: 0,
    subIssueTypeName: '',
    subIssueTypeNameCS: ''
  };
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let appService: AppService;
  let templateMessageService: TemplateMessageService;
  let validationService: ValidationService;
  let commonService: CommonService;
  let voidTicketsService: VoidTicketsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, ToastrModule.forRoot()],
      providers: [
        SignalRService, ToastrService, TemplateMessageService, ValidationService, VoidTicketsService, TicketsService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    appService = fixture.debugElement.injector.get(AppService);
    templateMessageService = fixture.debugElement.injector.get(TemplateMessageService);
    validationService = fixture.debugElement.injector.get(ValidationService);
    commonService = fixture.debugElement.injector.get(CommonService);
    voidTicketsService = fixture.debugElement.injector.get(VoidTicketsService);

    // Mock child components
    component.filterComponent = {
      isAbnormalBet: false,
      resetAllItemsToValid: jest.fn(),
      resetFilter: jest.fn(),
      createTicketsQuery: () => new GetTicketsQuery()
    } as unknown as FilterComponent;

    component.confirmationComponent = {
      clearData: jest.fn()
    } as unknown as ConfirmationComponent;

    component.messagesComponent = {
      message: {},
      initialMessage: {}
    } as unknown as TemplateMessageComponent;

    component.primitiveProps = new PrimitiveProperty();
    component.ticketsViewModel = new TicketsViewModel();
    component.ticketsViewModel.groups = [];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize tooltip and get sub issue types', async () => {
      // Arrange
      appService.getAbnormalBetSubIssueTypes = jest.fn().mockResolvedValue(Helper.fakeSubIssueTypes);

      // Act
      await component.ngOnInit();

      // Assert
      expect(component.tooltip.element).toBeDefined();
      expect(appService.getAbnormalBetSubIssueTypes).toHaveBeenCalled();
      expect(component.subIssueTypes).toEqual(Helper.fakeSubIssueTypes);
    });
  });

  describe('getInfoEventSearch', () => {
    it('should get tickets and match info', async () => {
      // Arrange
      const query = new GetTicketsQuery();
      component.filterComponent.isAbnormalBet = false;
      appService.getTickets = jest.fn().mockResolvedValue(Helper.fakeTicketsViewModel);
      commonService.getMatch = jest.fn().mockResolvedValue(Helper.fakeMatchViewModel);
      templateMessageService.generateTemplateValue = jest.fn().mockReturnValue(new TemplateValue());
      component.ticketsViewModel = new TicketsViewModel();
      component.ticketsViewModel.groups = [];

      // Act
      await component.getInfoEventSearch(query);

      // Assert
      expect(appService.getTickets).toHaveBeenCalledWith(query);
      expect(component.primitiveProps.isShowTickets).toBe(true);
    });

    it('should handle abnormal bet case', async () => {
      // Arrange
      const query = new GetTicketsQuery();
      component.filterComponent.isAbnormalBet = true;
      component.subIssueTypes = Helper.fakeSubIssueTypes;
      appService.getTickets = jest.fn().mockResolvedValue(Helper.fakeTicketsViewModel);
      commonService.getMatch = jest.fn().mockResolvedValue(Helper.fakeMatchViewModel);
      templateMessageService.generateTemplateValue = jest.fn().mockReturnValue(new TemplateValue());
      component.ticketsViewModel = new TicketsViewModel();
      component.ticketsViewModel.groups = [];

      // Act
      await component.getInfoEventSearch(query);

      // Assert
      expect(component.primitiveProps.isShowReason).toBe(true);
      expect(component.selectedSubIssueTypeId).toBe(Helper.fakeSubIssueTypes[0].subIssueTypeId);
      expect(templateMessageService.generateTemplateValue).toHaveBeenCalled();
    });
  });

  describe('search', () => {
    it('should call getInfoEventSearch with block UI', async () => {
      // Arrange
      const query = new GetTicketsQuery();
      const getInfoEventSearchSpy = jest.spyOn(component, 'getInfoEventSearch');
      appService.getTickets = jest.fn().mockResolvedValue(Helper.fakeTicketsViewModel);
      commonService.getMatch = jest.fn().mockResolvedValue(Helper.fakeMatchViewModel);
      component.primitiveProps = new PrimitiveProperty();
      component.primitiveProps.isBlockUI = false;
      component.ticketsViewModel = new TicketsViewModel();
      component.ticketsViewModel.groups = [];

      // Act
      await component.search(query);

      // Assert
      expect(getInfoEventSearchSpy).toHaveBeenCalledWith(query);
      expect(component.primitiveProps.isBlockUI).toBe(false);
    });
  });

  describe('voidBet', () => {
    it('should show confirmation when validation passes', async () => {
      // Arrange
      const showConfirmSpy = jest.spyOn(component, 'showConfirmBeforeVoid');
      validationService.checkValidation = jest.fn().mockReturnValue(true);

      // Act
      await component.voidBet();

      // Assert
      expect(validationService.checkValidation).toHaveBeenCalled();
      expect(showConfirmSpy).toHaveBeenCalled();
    });

    it('should not show confirmation when validation fails', async () => {
      // Arrange
      validationService.checkValidation = jest.fn().mockReturnValue(false);
      const showConfirmSpy = jest.spyOn(component, 'showConfirmBeforeVoid');

      // Act
      await component.voidBet();

      // Assert
      expect(validationService.checkValidation).toHaveBeenCalled();
      expect(showConfirmSpy).not.toHaveBeenCalled();
    });
  });

  describe('voidTickets', () => {
    it('should handle void tickets process', async () => {
      // Arrange
      voidTicketsService.createVoidBetRequest = jest.fn().mockReturnValue(Helper.fakeVoidTicketsRequest);
      appService.voidBet = jest.fn().mockResolvedValue(Helper.fakeResult);
      component.primitiveProps = new PrimitiveProperty();
      component.primitiveProps.isBlockUI = false;
      component.ticketsViewModel = new TicketsViewModel();
      component.ticketsViewModel.groups = [];

      // Act
      await component.voidTickets();

      // Assert
      expect(component.primitiveProps.isBlockUI).toBe(false);
      expect(voidTicketsService.createVoidBetRequest).toHaveBeenCalled();
      expect(appService.voidBet).toHaveBeenCalledWith(Helper.fakeVoidTicketsRequest);
    });
  });

  describe('handleAfterVoid', () => {
    it('should reset data and filter when success', async () => {
      // Arrange
      const results: Result<null>[] = [{ errorCode: 0, errorMsg: 'Success', isSuccessful: true }];
      templateMessageService.updateMessagesResult = jest.fn().mockReturnValue({
        isShow: false,
        header: '',
        results: [],
        open: (header: string, results: Result<string>[]) => {}
      });
      component.ticketsViewModel = new TicketsViewModel();
      component.ticketsViewModel.groups = [];

      // Act
      await component.handleAfterVoid(results);

      // Assert
      expect(component.filterComponent.resetFilter).toHaveBeenCalled();
      expect(templateMessageService.updateMessagesResult).toHaveBeenCalled();
      expect(component.primitiveProps.isBlockUI).toBe(false);
    });
  });

  describe('exportExcel', () => {
    it('should call exportExcel with block UI', async () => {
      // Arrange
      const query = new GetTicketsQuery();
      appService.exportExcel = jest.fn().mockResolvedValue(undefined);
      component.primitiveProps = new PrimitiveProperty();
      component.primitiveProps.isBlockUI = false;

      // Act
      await component.exportExcel();

      // Assert
      expect(appService.exportExcel).toHaveBeenCalledWith(query);
      expect(component.primitiveProps.isBlockUI).toBe(false);
    });
  });
});
