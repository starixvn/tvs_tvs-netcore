import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { TicketModel } from 'src/utility/components/tickets/ticket.model';
import { BlockUiService } from '../../utility/components/block-ui/block-ui.service';
import { ConfirmationComponent } from '../../utility/components/confirmation/confirmation.component';
import { ModalService } from '../../utility/components/modal/modal.service';
import { PagingModel } from '../../utility/components/paging/paging.model';
import { TemplateService } from '../../utility/components/template-message/template-message/services/template.service';
import { GroupModel } from '../../utility/components/tickets/group.model';
import { TicketsModel } from '../../utility/components/tickets/tickets.model';
import { SportType } from '../../utility/constants/sport.constant';
import { BetID } from '../../utility/models/bet-id.model';
import { MatchModel } from '../../utility/models/match.model';
import { Result } from '../../utility/models/result';
import { TestingModule } from '../../utility/modules/testing.module';
import { PasswordService } from '../../utility/services/password.service';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { FilterComponent } from './filter/filter.component';
import { FilterService } from './filter/filter.service';
import { FilterParams, GetTicketsQuery } from './models/query.model';

class Helper {
  static readonly fakeMatchModel = {
    matchId: 12345,
    homeTeam: 'Home Team',
    awayTeam: 'Away Team',
    matchDate: new Date(),
    status: 'Active',
    sportTypeName: 'Football',
    sportTypeNameTraditional: '足球',
    sportTypeNameSimplified: '足球',
    sportTypeNameNewSimplified: '足球'
  } as unknown as MatchModel;

  static readonly fakeTicketsModel = {
    singleCount: 5,
    parlayCount: 3,
    fromTransTime: new Date(),
    toTransTime: new Date(),
    fromCheckTime: new Date(),
    toCheckTime: new Date(),
    strFromTime: '12:00:00 AM',
    strToTime: '12:00:00 AM',
    groups: [{
      name: 'Test Group',
      tickets: [{
        no: 1,
        betId: '123',
        value: '123',
        member: 'Test Member',
        transDate: new Date().toISOString(),
        betType: 'Test Bet Type',
        choice: 'Test Choice',
        stake: '100',
        odds: '1.5',
        winLoss: '50',
        currency: 'USD',
        handicap: '0',
        score: '1-0',
        status: 'Active',
        secondAcceptFlag: '0',
        isDisable: false,
        isChecked: true,
        isCricket: false,
        soldId: '123',
        mainTransId: '123',
        isMarked: false,
        siteDbGroupId: 1
      }]
    }],
    totalItems: 1,
    id: 'Test ID',
    betTypeNameReplaceMessage: '',
    smallestMapTicket: null,
    licenseeAffectedList: [],
    pagingModel: new PagingModel({
      page: 1,
      pageSize: 10,
      total: 10,
      selection: [10, 20, 30, 40]
    }),
    changeIconCheckBox: jest.fn(),
    getTicketEnable: jest.fn().mockReturnValue([]),
    getTicketSold: jest.fn().mockReturnValue([]),
    getTicketCricket: jest.fn().mockReturnValue([]),
    checkSettledTickets: jest.fn().mockReturnValue(false),
    getNumberOfCheckedTickets: jest.fn().mockReturnValue(1)
  } as unknown as TicketsModel;

  static readonly fakeGetTicketsQuery = {
    matchId: 12345,
    pageIndex: 0,
    pageSize: 10,
    eventType: '1',
    timeType: 1,
    liveHomeScore: '1',
    liveAwayScore: '0',
    invalidTransDate: false
  } as GetTicketsQuery;

  static readonly fakeResult = [{
    errorCode: 0,
    message: 'Success',
    data: null
  }] as unknown as Result<null>[];
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let appService: AppService;
  let blockUIService: BlockUiService;
  let signalRService: SignalRService;
  let passwordService: PasswordService;
  let templateService: TemplateService;
  let filterComponent: FilterComponent;
  let confirmationComponent: ConfirmationComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TestingModule, ToastrModule.forRoot(), BrowserAnimationsModule,
        FilterComponent, ConfirmationComponent, AppComponent ],
      providers: [ AppService, BlockUiService, ModalService, SignalRService, PasswordService, TemplateService, FilterService]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    appService = fixture.debugElement.injector.get(AppService);
    blockUIService = fixture.debugElement.injector.get(BlockUiService);
    signalRService = fixture.debugElement.injector.get(SignalRService);
    passwordService = fixture.debugElement.injector.get(PasswordService);
    templateService = fixture.debugElement.injector.get(TemplateService);

    // Mock các service
    jest.spyOn(signalRService, 'initializeConnection').mockResolvedValue();
    jest.spyOn(appService, 'getMatchInfo').mockResolvedValue(Helper.fakeMatchModel);
    jest.spyOn(appService, 'getTickets').mockResolvedValue(Helper.fakeTicketsModel);
    jest.spyOn(appService, 'voidTickets').mockResolvedValue(Helper.fakeResult);
    jest.spyOn(appService, 'getVoidResultCache').mockResolvedValue(Helper.fakeResult);
    jest.spyOn(passwordService, 'hash').mockReturnValue('hashedPassword');
    jest.spyOn(blockUIService, 'stop').mockImplementation(() => {});
    jest.spyOn(templateService, 'initializeTemplateValue').mockImplementation(() => ({
        sportType: {
            msgEnglish: Helper.fakeMatchModel.sportTypeName,
            msgChineseTraditional: Helper.fakeMatchModel.sportTypeNameTraditional,
            msgChineseSimplified: Helper.fakeMatchModel.sportTypeNameSimplified,
            msgChineseNewSimplified: Helper.fakeMatchModel.sportTypeNameNewSimplified
        },
        matchId: Helper.fakeMatchModel.matchId,
        groupPHAffected: 0,
        severity: 1
    }));

    // Mock component
    filterComponent = TestBed.createComponent(FilterComponent).componentInstance;
    confirmationComponent = TestBed.createComponent(ConfirmationComponent).componentInstance;
    component.filterComponent = filterComponent;
    component.confirmationComponent = confirmationComponent;
    
    // Mock messagesComponent
    component.messagesComponent = {
      checkValidation: jest.fn().mockReturnValue(true)
    } as any;
    component.isShowTickets = false;
    component.isShowLogInfoOnly = false;
    component.ticketsModel = Helper.fakeTicketsModel;
    component.getTicketsQuery = Helper.fakeGetTicketsQuery;
    component.matchViewModel = Helper.fakeMatchModel;
    
    // Mock filter component
    filterComponent.playerNamesSelected = {
      msgEnglish: '',
      msgChineseTraditional: '',
      msgChineseSimplified: '',
      msgChineseNewSimplified: ''
    };
    (filterComponent as any).issueType = [];
    (filterComponent as any).subIssueType = [];
    (filterComponent as any).data = {
      issueTypes: [],
      subIssueTypes: []
    };
    
    // Mock confirmation component
    component.confirmation = {
      reason: '',
      reasonSC: '',
      userName: 'testUser',
      userPassword: ''
    };

    // Mock modal service
    component.modal.open = jest.fn();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize SignalR connection', async () => {
      await component.ngOnInit();
      expect(signalRService.initializeConnection).toHaveBeenCalled();
    });
  });

  describe('searchEvent', () => {
    it('should clear cache time and get match info', async () => {
      const query = Helper.fakeGetTicketsQuery;
      component.isShowTickets = false;
      component.matchViewModel = undefined;
      await component.searchEvent(query);
      expect(component.isShowTickets).toBeTruthy();
      expect(component.isShowLogInfoOnly).toBeFalsy();
      expect(appService.getMatchInfo).toHaveBeenCalledWith(query.matchId);
    });
  });

  describe('getMatchInfo', () => {
    it('should get match info and search tickets', async () => {
      const query = Helper.fakeGetTicketsQuery;
      component.matchViewModel = undefined;
      await component.getMatchInfo(query);
      expect(appService.getMatchInfo).toHaveBeenCalledWith(query.matchId);
      expect(component.isShowMatch).toBeTruthy();
    });
  });

  describe('searchTickets', () => {
    it('should handle invalid transaction date', async () => {
      const query = { ...Helper.fakeGetTicketsQuery, invalidTransDate: true };
      await component.searchTickets(query);
      expect(component.isShowTickets).toBeTruthy();
      expect(component.isShowMatch).toBeTruthy();
      expect(component.isShowConfirm).toBeFalsy();
      expect(component.isShowMessages).toBeFalsy();
    });

    it('should get tickets when transaction date is valid', async () => {
      const query = Helper.fakeGetTicketsQuery;
      component.matchViewModel = Helper.fakeMatchModel;
      component.ticketsModel = Helper.fakeTicketsModel;
      const groupModel = {name: 'Test Group', tickets: []} as GroupModel;
      groupModel.tickets = [{
        no: 1,
        betId: '123',
        value: '123',
        member: 'Test Member',
        transDate: new Date().toISOString(),
        betType: 'Test Bet Type',
        choice: 'Test Choice',
        stake: '100',
        odds: '1.5',
        winLoss: '50',
        currency: 'USD',
        handicap: '0',
        score: '1-0',
        status: 'Active',
        secondAcceptFlag: '0',
        isDisable: false,
        isChecked: true,
        isCricket: false,
        soldId: '123',
        mainTransId: '123',
        isMarked: false,
        siteDbGroupId: 1
      }] as TicketModel[];
      component.ticketsModel.groups = [groupModel];
      await component.searchTickets(query);
      expect(appService.getTickets).toHaveBeenCalledWith(query);
      expect(component.isShowTickets).toBeTruthy();
      expect(component.isShowMatch).toBeTruthy();
    });
  });

  describe('voidBet', () => {
    it('should show confirmation modal when validation passes', () => {
      jest.spyOn(component, 'checkValidation').mockReturnValue(true);
      component.voidBet();
      expect(component.modal.open).toHaveBeenCalled();
    });

    it('should not show confirmation modal when validation fails', () => {
      jest.spyOn(component, 'checkValidation').mockReturnValue(false);
      component.voidBet();
      expect(component.modal.open).not.toHaveBeenCalled();
    });
  });

  describe('voidTickets', () => {
    it('should void tickets and handle results', async () => {
      await component.voidTickets();
      expect(appService.voidTickets).toHaveBeenCalled();
      expect(blockUIService.stop).toHaveBeenCalled();
    });
  });

  describe('handleAfterVoid', () => {
    it('should handle successful void operation', async () => {
      const results = Helper.fakeResult;
      component.ticketsModel = Helper.fakeTicketsModel;
      component.getTicketsQuery = Helper.fakeGetTicketsQuery;

      await component.handleAfterVoid(results);

      expect(component.messagesResult.isShow).toBeTruthy();
      expect(component.messagesResult.header).toBe('Void Bet Result');
      expect(component.messagesResult.results).toEqual(results);
    });

    it('should handle failed void operation', async () => {
      const results = [{
        errorCode: 1,
        message: 'Failed',
        data: null
      }] as unknown as Result<null>[];

      await component.handleAfterVoid(results);

      expect(component.messagesResult.isShow).toBeTruthy();
      expect(component.messagesResult.results).toEqual(results);
    });
  });

  describe('ticketsChange', () => {
    it('should update template value with new ticket count', () => {
      const numberOfTickets = 5;
      component.ticketsChange(numberOfTickets);
      expect(component.templateValue.totalTickets).toBe(numberOfTickets);
    });
  });

  describe('updateEventType', () => {
    it('should update template value with new event type', () => {
      const eventType = '2';
      component.updateEventType(eventType);
      expect(component.templateValue.eventType).toBe(eventType);
    });
  });

  describe('updateIssueType', () => {
    it('should update issue type ID', () => {
      const issueTypeId = 1;
      component.updateIssueType(issueTypeId);
      expect(component.issueTypeId).toBe(issueTypeId);
    });
  });

  describe('updateSubIssueType', () => {
    it('should update sub issue type ID and reset checkbox', () => {
      const subIssueTypeId = 2;
      component.updateSubIssueType(subIssueTypeId);
      expect(component.subIssueTypeId).toBe(subIssueTypeId);
      expect(component.templateValue.isCheckedVar).toBeFalsy();
    });
  });

  describe('updateTemplateValue', () => {
    it('should update template value with correct data', () => {
      component.matchViewModel = Helper.fakeMatchModel;
      component.ticketsModel = Helper.fakeTicketsModel;
      component.getTicketsQuery = Helper.fakeGetTicketsQuery;
      component.filterComponent = {
        playerNamesSelected: {
          msgEnglish: 'Test Player',
          msgChineseTraditional: '測試球員',
          msgChineseSimplified: '测试球员',
          msgChineseNewSimplified: '测试球员'
        }
      } as any;

      component.updateTemplateValue();

      expect(component.templateValue.sportType).toBeDefined();
      expect(component.templateValue.matchId).toBe(Helper.fakeMatchModel.matchId);
      expect(component.templateValue.eventType).toBe(Helper.fakeGetTicketsQuery.eventType);
      expect(component.templateValue.playerName).toBeDefined();
    });
  });

  describe('isHasInningContent', () => {
    it('should return true for baseball sport type and early completed match', () => {
      component.issueTypeId = 27;
      component.matchViewModel = {
        ...Helper.fakeMatchModel,
        sportType: SportType.BASEBALL,
        sportTypeName: 'Baseball'
      };
      const result = component['isHasInningContent'](SportType.BASEBALL);
      expect(result).toBeTruthy();
    });

    it('should return false for non-baseball sport type', () => {
      const result = component['isHasInningContent'](1);
      expect(result).toBeFalsy();
    });
  });

  describe('checkValidation', () => {
    it('should return false when no tickets are selected', () => {
      const result = component.checkValidation();
      expect(result).toBeFalsy();
    });

    it('should return false when messages validation fails', () => {
      const mockTicket = { betId: '123' } as unknown as BetID;
      jest.spyOn(component.messagesComponent, 'checkValidation').mockReturnValue(false);
      const result = component.checkValidation();
      expect(result).toBeFalsy();
    });

    it('should return false when confirmation validation fails', () => {
      const mockTicket = { betId: '123' } as unknown as BetID;

      jest.spyOn(component.messagesComponent, 'checkValidation').mockReturnValue(true);
      jest.spyOn(component.confirmationComponent, 'checkValidation').mockReturnValue(false);
      const result = component.checkValidation();
      expect(result).toBeFalsy();
    });

    it('should return true when all validations pass', () => {
      const mockTicket = { betId: '123' } as unknown as BetID;
      jest.spyOn(component.messagesComponent, 'checkValidation').mockReturnValue(true);
      jest.spyOn(component.confirmationComponent, 'checkValidation').mockReturnValue(true);
      jest.spyOn(component, 'checkFilterBeforeVoid').mockReturnValue(true);
      
      // Mock ticketsService to return some tickets
      jest.spyOn(component.ticketsService, 'getTicketEnable').mockReturnValue([mockTicket]);
      
      const result = component.checkValidation();
      expect(result).toBeTruthy();
    });
  });

  describe('checkFilterBeforeVoid', () => {
    it('should return false when filter params changed', () => {
      const mockMatch: MatchModel = {
        matchId: 1,
        matchCode: 'TEST001',
        leagueName: 'Test League',
        matchEvent: 'Test Event',
        homeName: 'Home Team',
        awayName: 'Away Team',
        sportTypeName: 'Football',
        sportTypeNameTraditional: '足球',
        sportTypeNameSimplified: '足球',
        sportTypeNameNewSimplified: '足球'
      };
      const mockFilterParams = {
        match: mockMatch,
        ticketType: '1',
        eventType: '1',
        oddsType: '1',
        timeType: 1,
        fromTransDate: '2024-01-01',
        toTransDate: '2024-01-01',
        liveHomeScore: '',
        liveAwayScore: ''
      } as FilterParams;
      component.filterParamsBeforeSearch = mockFilterParams;
      component.filterComponent = {
        getParams: () => ({ ...mockFilterParams, match: { ...mockMatch, matchId: 2 } }),
        checkFilterParams: () => true,
        blurMatchId: jest.fn()
      } as unknown as FilterComponent;

      const result = component.checkFilterBeforeVoid();
      
      expect(result).toBeFalsy();
      expect(component.filterComponent.blurMatchId).toHaveBeenCalled();
    });

    it('should return true when filter params unchanged', () => {
      const mockMatch: MatchModel = {
        matchId: 1,
        matchCode: 'TEST001',
        leagueName: 'Test League',
        matchEvent: 'Test Event',
        homeName: 'Home Team',
        awayName: 'Away Team',
        sportTypeName: 'Football',
        sportTypeNameTraditional: '足球',
        sportTypeNameSimplified: '足球',
        sportTypeNameNewSimplified: '足球'
      };
      const mockFilterParams = {
        match: mockMatch,
        ticketType: '1',
        eventType: '1',
        oddsType: '1',
        timeType: 1,
        fromTransDate: '2024-01-01',
        toTransDate: '2024-01-01',
        liveHomeScore: '',
        liveAwayScore: ''
      } as FilterParams;
      component.filterParamsBeforeSearch = mockFilterParams;
      component.filterComponent = {
        getParams: () => mockFilterParams,
        checkFilterParams: () => true
      } as FilterComponent;

      const result = component.checkFilterBeforeVoid();
      
      expect(result).toBeTruthy();
    });
  });

  describe('clearCacheTime', () => {
    it('should clear all time cache variables', () => {
      component['fromTransTime'] = new Date();
      component['toTransTime'] = new Date();
      component['fromCheckTime'] = new Date();
      component['toCheckTime'] = new Date();

      component['clearCacheTime']();

      expect(component['fromTransTime']).toBeNull();
      expect(component['toTransTime']).toBeNull();
      expect(component['fromCheckTime']).toBeNull();
      expect(component['toCheckTime']).toBeNull();
    });
  });
});
