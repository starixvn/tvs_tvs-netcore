import { TestBed } from '@angular/core/testing';
import { EventWrongOfferedNameService } from './event-wrong-offered-name.service';
import { ValidationService } from './validation.service';
import { AddRequestApiService } from '../../../../../services/add-request-api.service';
import { CommonService } from '../../../../../../utility/services/common.service';
import { TemplateService } from '../../../../../../utility/components/template-message/template-message/services/template.service';
import { AffectedTicketService } from '../../../../../component/affected-ticket/affected-ticket.service';
import { WrongOfferedNameModel } from '../../../../../models/event-wrong-offered-name.model';
import { LogInfoWrongOfferedName } from '../models/log-info-wrong-offered-name.model';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { MatchModel } from '../../../../../../utility/models/match.model';
import { TicketsModel } from '../../../../../component/pool-house-ticket/tickets/tickets.model';
import { FilterWrongOfferedNameModel } from '../models/filter-wrong-offered-name.model';
import { VoidedReason } from '../../../../../../utility/models/reason.model';
import { TemplateValue } from '../../../../../../utility/components/template-message/template-message/template.model';

class Helper {
  static readonly fakeMatchId = 12345;
  static readonly fakeMatch = {
    homeName: 'Home Team',
    awayName: 'Away Team',
    homeNameTraditional: 'Home Team T',
    awayNameTraditional: 'Away Team T',
    homeNameSimplified: 'Home Team S',
    awayNameSimplified: 'Away Team S',
    leagueName: 'Test League',
    leagueNameTraditional: 'Test League T',
    leagueNameSimplified: 'Test League S',
    sportType: 1
  } as MatchModel;

  static readonly fakeWrongOfferedNameModel = {
    matchId: 122,
    match: Helper.fakeMatch,
    subIssueTypeId: 12,
    licenseeNames: 'Licensee1,Licensee2',
    currencyIds: '1,2',
    wrongName: 'Wrong Name',
    actualName: 'Actual Name',
    wrongNameT: 'Wrong Name T',
    actualNameT: 'Actual Name T',
    wrongNameS: 'Wrong Name S',
    actualNameS: 'Actual Name S',
    logInfoDetail: {
      logInfoTicketsJson: '{}'
    }
  } as WrongOfferedNameModel;

  static readonly fakeFilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '2',
    action: '1',
    isTest: true,
    isVoided: false
  } as FilterModel;

  static readonly fakeTicketsModel = {
    totalSingle: 1,
    totalParlay: 1,
    fromTime: new Date(),
    toTime: new Date(),
    isHasSettledTicket: false
  } as TicketsModel;
}

describe('EventWrongOfferedNameService', () => {
  let service: EventWrongOfferedNameService;
  let validationService: jest.Mocked<ValidationService>;
  let addRequestApiService: jest.Mocked<AddRequestApiService>;
  let commonService: jest.Mocked<CommonService>;
  let templateService: jest.Mocked<TemplateService>;
  let affectedTicketService: jest.Mocked<AffectedTicketService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EventWrongOfferedNameService,
        { provide: ValidationService, useValue: {
          isSubTypeOfLeague: jest.fn()
        } },
        { provide: AddRequestApiService, useValue: {
          getPermissionAddRequest: jest.fn()
        } },
        { provide: CommonService, useValue: {
          getVoidedReason: jest.fn()
        } },
        { provide: TemplateService, useValue: {
          initializeTemplateValue: jest.fn()
        } },
        { provide: AffectedTicketService, useValue: {
          getAffectedTickets: jest.fn()
        } }
      ]
    });

    service = TestBed.inject(EventWrongOfferedNameService);
    validationService = TestBed.inject(ValidationService) as jest.Mocked<ValidationService>;
    addRequestApiService = TestBed.inject(AddRequestApiService) as jest.Mocked<AddRequestApiService>;
    commonService = TestBed.inject(CommonService) as jest.Mocked<CommonService>;
    templateService = TestBed.inject(TemplateService) as jest.Mocked<TemplateService>;
    affectedTicketService = TestBed.inject(AffectedTicketService) as jest.Mocked<AffectedTicketService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPermissionAddRequest', () => {
    it('should call addRequestApiService.getPermissionAddRequest', () => {
      // Act
      service.getPermissionAddRequest();

      // Assert
      expect(addRequestApiService.getPermissionAddRequest).toHaveBeenCalled();
    });
  });

  describe('initLogInfoEvent', () => {
    it('should initialize LogInfoWrongOfferedName with default values', () => {
      // Act
      const result = service.initLogInfoEvent();

      // Assert
      expect(result).toBeDefined();
      expect(result.filterWrongOfferedName).toBeDefined();
    });
  });

  describe('initWrongMarketOfferedModel', () => {
    it('should initialize WrongOfferedNameModel with correct values', () => {
      // Arrange
      const subIssueTypeId = 1;
      const events = new LogInfoWrongOfferedName();
      events.matchId = Helper.fakeMatchId;
      events.filterWrongOfferedName = {
        licenseeNames: ['Licensee1', 'Licensee2'],
        currencyIds: ['1', '2'],
        wrongName: 'Wrong Name',
        actualName: 'Actual Name',
        wrongNameT: 'Wrong Name T',
        actualNameT: 'Actual Name T',
        wrongNameS: 'Wrong Name S',
        actualNameS: 'Actual Name S'
      } as FilterWrongOfferedNameModel;

      // Act
      const result = service.initWrongMarketOfferedModel(subIssueTypeId, events);

      // Assert
      expect(result.matchId).toBe(Helper.fakeMatchId);
      expect(result.subIssueTypeId).toBe(subIssueTypeId);
      expect(result.licenseeNames).toBe('Licensee1,Licensee2');
      expect(result.currencyIds).toBe('1,2');
      expect(result.wrongName).toBe('Wrong Name');
      expect(result.actualName).toBe('Actual Name');
      expect(result.wrongNameT).toBe('Wrong Name T');
      expect(result.actualNameT).toBe('Actual Name T');
      expect(result.wrongNameS).toBe('Wrong Name S');
      expect(result.actualNameS).toBe('Actual Name S');
    });
  });

  describe('assignModelsToEvents', () => {
    it('should assign models to events correctly', async () => {
      // Arrange
      const filter = Helper.fakeFilterModel;
      const inputModel = Helper.fakeWrongOfferedNameModel;
      const fakeVoidedReason = { 
        reasonEnglish: 'Test Reason',
        reasonChineseSimplified: 'Test Reason SC'
      } as VoidedReason;
      const fakeTemplateValue = { 
        matchId: 1,
        groupPHAffected: 1,
        checkSettled: false,
        wrongName: '',
        actualName: '',
        wrongNameT: '',
        actualNameT: '',
        wrongNameS: '',
        actualNameS: ''
      } as TemplateValue;
      
      commonService.getVoidedReason.mockResolvedValue(fakeVoidedReason);
      affectedTicketService.getAffectedTickets.mockResolvedValue(Helper.fakeTicketsModel);
      templateService.initializeTemplateValue.mockReturnValue(fakeTemplateValue);

      // Act
      const result = await service.assignModelsToEvents(filter, inputModel);

      // Assert
      expect(result.matchId).toBe(inputModel.matchId);
      expect(result.logInfoDetail).toBe(inputModel.logInfoDetail);
      expect(result.matchModel).toBe(inputModel.match);
      expect(result.tableTicketsModel).toBe(Helper.fakeTicketsModel);
      expect(result.voidReason).toBe(fakeVoidedReason);
      expect(result.isCollapse).toBe(filter.isVoided);
      expect(result.filterWrongOfferedName).toBeDefined();
    });
  });

  describe('getFilterWrongOfferedNameModel', () => {
    it('should get filter wrong offered name model with default values', () => {
      // Arrange
      const inputModel = Helper.fakeWrongOfferedNameModel;
      inputModel.wrongName = null;
      inputModel.actualName = null;
      inputModel.wrongNameT = null;
      inputModel.actualNameT = null;
      inputModel.wrongNameS = null;
      inputModel.actualNameS = null;

      // Act
      const result = service.getFilterWrongOfferedNameModel(inputModel);

      // Assert
      expect(result.licenseeNames).toEqual(['Licensee1', 'Licensee2']);
      expect(result.currencyIds).toEqual(['1', '2']);
      expect(result.wrongName).toBe('Home Team - vs - Away Team');
      expect(result.actualName).toBe('Home Team - vs - Away Team');
      expect(result.wrongNameT).toBe('Home Team T - vs - Away Team T');
      expect(result.actualNameT).toBe('Home Team T - vs - Away Team T');
      expect(result.wrongNameS).toBe('Home Team S - vs - Away Team S');
      expect(result.actualNameS).toBe('Home Team S - vs - Away Team S');
    });
  });

  describe('updateSelectedMatchToInput', () => {
    it('should update team name when not league sub type', () => {
      // Arrange
      const match = Helper.fakeMatch;
      const filter = new FilterWrongOfferedNameModel();
      validationService.isSubTypeOfLeague.mockReturnValue(false);

      // Act
      service.updateSelectedMatchToInput(match, filter, '1');

      // Assert
      expect(filter.wrongName).toBe('Home Team - vs - Away Team');
      expect(filter.actualName).toBe('Home Team - vs - Away Team');
      expect(filter.wrongNameT).toBe('Home Team T - vs - Away Team T');
      expect(filter.actualNameT).toBe('Home Team T - vs - Away Team T');
      expect(filter.wrongNameS).toBe('Home Team S - vs - Away Team S');
      expect(filter.actualNameS).toBe('Home Team S - vs - Away Team S');
    });

    it('should update league name when league sub type', () => {
      // Arrange
      const match = Helper.fakeMatch;
      const filter = new FilterWrongOfferedNameModel();
      validationService.isSubTypeOfLeague.mockReturnValue(true);

      // Act
      service.updateSelectedMatchToInput(match, filter, '1');

      // Assert
      expect(filter.wrongName).toBe('Test League');
      expect(filter.actualName).toBe('Test League');
      expect(filter.wrongNameT).toBe('Test League T');
      expect(filter.actualNameT).toBe('Test League T');
      expect(filter.wrongNameS).toBe('Test League S');
      expect(filter.actualNameS).toBe('Test League S');
    });
  });
});
