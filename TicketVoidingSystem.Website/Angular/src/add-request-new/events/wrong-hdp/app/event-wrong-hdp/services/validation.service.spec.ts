import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { EventLeagueComponent } from '../../../../../../utility/components/event-league/event-league.component';
import { LogInfoWrongHdpComponent } from '../log-info-wrong-hdp/log-info-wrong-hdp.component';
import { LogInfoWrongHdp } from '../models/log-info-wrong-hdp.model';
import { FilterWithHdpModel } from '../models/filter-with-hdp.model';
import { Tooltip } from '../../../../../../utility/components/tooltip/tooltip.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { TeamFavorite, TVSRequestActionType } from '../../../../../../utility/constants/config';
import { TEXT } from '../../../../../../utility/constants/text';
import { SubIssueTypeConstant } from '../../../../../../utility/constants/sub-issue-type.constant';
import { FilterModel } from '../../../../../component/filter/filter.model';

describe('ValidationService', () => {
  let service: ValidationService;
  let mockBodyElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ValidationService]
    });

    service = TestBed.inject(ValidationService);

    // Mock document.getElementById
    mockBodyElement = document.createElement('div');
    mockBodyElement.setAttribute('user-id', '2');
    document.body.appendChild(mockBodyElement);
    jest.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (id === 'body') {
        return mockBodyElement;
      }
      return null;
    });
  });

  afterEach(() => {
    document.body.removeChild(mockBodyElement);
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    // Arrange & Act
    const service = TestBed.inject(ValidationService);

    // Assert
    expect(service).toBeTruthy();
  });

  describe('validateCommonData', () => {
    it('should return true when all validations pass', () => {
      // Arrange
      const mockEventLeagueComponent = {
        isMatchIdValid: () => true
      } as EventLeagueComponent;

      const mockLogInfoComponent = {
        filterWithHdpComponent: {
          isValid: () => true
        }
      } as LogInfoWrongHdpComponent;

      // Act
      const result = service.validateCommonData(mockEventLeagueComponent, [mockLogInfoComponent]);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when matchId is invalid', () => {
      // Arrange
      const mockEventLeagueComponent = {
        isMatchIdValid: () => false
      } as EventLeagueComponent;

      const mockLogInfoComponent = {
        filterWithHdpComponent: {
          isValid: () => true
        }
      } as LogInfoWrongHdpComponent;

      // Act
      const result = service.validateCommonData(mockEventLeagueComponent, [mockLogInfoComponent]);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when filterWithHdp is invalid', () => {
      // Arrange
      const mockEventLeagueComponent = {
        isMatchIdValid: () => true
      } as EventLeagueComponent;

      const mockLogInfoComponent = {
        filterWithHdpComponent: {
          isValid: () => false
        }
      } as LogInfoWrongHdpComponent;

      // Act
      const result = service.validateCommonData(mockEventLeagueComponent, [mockLogInfoComponent]);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('isFromTimeSameOrBeforeToTime', () => {
    it('should return true when fromTime is before toTime', () => {
      // Arrange
      const fromTime = '2024-03-20T10:00:00';
      const toTime = '2024-03-20T11:00:00';
      const mockTooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isFromTimeSameOrBeforeToTime(fromTime, toTime, mockTooltip);

      // Assert
      expect(result).toBe(true);
      expect(mockTooltip.display).not.toHaveBeenCalled();
    });

    it('should return false when fromTime is after toTime', () => {
      // Arrange
      const fromTime = '2024-03-20T12:00:00';
      const toTime = '2024-03-20T11:00:00';
      const mockTooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isFromTimeSameOrBeforeToTime(fromTime, toTime, mockTooltip);

      // Assert
      expect(result).toBe(false);
      expect(mockTooltip.display).toHaveBeenCalled();
    });
  });

  describe('isValidInputRelatedEvent', () => {
    it('should return false when input matchId is same as main match', () => {
      // Arrange
      const inputMatchId = 123;
      const matchIdInputClass = 'input-match-id';
      const allEvents = [
        { matchId: 123, isMainMatch: true },
        { matchId: 456, isMainMatch: false }
      ] as LogInfoWrongHdp[];
      const mockTooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isValidInputRelatedEvent(inputMatchId, matchIdInputClass, allEvents, mockTooltip);

      // Assert
      expect(result).toBe(false);
      expect(mockTooltip.display).toHaveBeenCalledWith(matchIdInputClass, TEXT.INVALID_MATCHID);
    });

    it('should return false when input matchId already exists in related events', () => {
      // Arrange
      const inputMatchId = 456;
      const matchIdInputClass = 'input-match-id';
      const allEvents = [
        { matchId: 123, isMainMatch: true },
        { matchId: 456, isMainMatch: false }
      ] as LogInfoWrongHdp[];
      const mockTooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isValidInputRelatedEvent(inputMatchId, matchIdInputClass, allEvents, mockTooltip);

      // Assert
      expect(result).toBe(false);
      expect(mockTooltip.display).toHaveBeenCalledWith(matchIdInputClass, TEXT.MATCH_ID_EXISTS_IN_LIST);
    });

    it('should return true when input matchId is valid', () => {
      // Arrange
      const inputMatchId = 789;
      const matchIdInputClass = 'input-match-id';
      const allEvents = [
        { matchId: 123, isMainMatch: true },
        { matchId: 456, isMainMatch: false }
      ] as LogInfoWrongHdp[];
      const mockTooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isValidInputRelatedEvent(inputMatchId, matchIdInputClass, allEvents, mockTooltip);

      // Assert
      expect(result).toBe(true);
      expect(mockTooltip.display).not.toHaveBeenCalled();
    });
  });

  describe('isAllEventsValid', () => {
    it('should return true when all events have no error messages', () => {
      // Arrange
      const events = [
        { messageValidationLogInfo: [{ isError: false }] },
        { messageValidationLogInfo: [{ isError: false }] }
      ] as LogInfoWrongHdp[];

      // Act
      const result = service.isAllEventsValid(events);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when any event has error messages', () => {
      // Arrange
      const events = [
        { messageValidationLogInfo: [{ isError: false }] },
        { messageValidationLogInfo: [{ isError: true }] }
      ] as LogInfoWrongHdp[];

      // Act
      const result = service.isAllEventsValid(events);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('isValidHdpWithSubTypeWrongHdpOrWrong1stHdp', () => {
    it('should return false when homeFavorite is missing for HOME team', () => {
      // Arrange
      const teamFavorite = TeamFavorite.HOME;
      const filterWithHdpModel = new FilterWithHdpModel();
      const mockTooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isValidHdpWithSubTypeWrongHdpOrWrong1stHdp(teamFavorite, filterWithHdpModel, mockTooltip);

      // Assert
      expect(result).toBe(false);
      expect(mockTooltip.display).toHaveBeenCalled();
    });

    it('should return false when awayFavorite is missing for AWAY team', () => {
      // Arrange
      const teamFavorite = TeamFavorite.AWAY;
      const filterWithHdpModel = new FilterWithHdpModel();
      const mockTooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isValidHdpWithSubTypeWrongHdpOrWrong1stHdp(teamFavorite, filterWithHdpModel, mockTooltip);

      // Assert
      expect(result).toBe(false);
      expect(mockTooltip.display).toHaveBeenCalled();
    });

    it('should return false when actualMarket is missing', () => {
      // Arrange
      const teamFavorite = TeamFavorite.HOME;
      const filterWithHdpModel = new FilterWithHdpModel();
      filterWithHdpModel.homeFavorite = '1.5';
      const mockTooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isValidHdpWithSubTypeWrongHdpOrWrong1stHdp(teamFavorite, filterWithHdpModel, mockTooltip);

      // Assert
      expect(result).toBe(false);
      expect(mockTooltip.display).toHaveBeenCalled();
    });
  });

  describe('checkCanShowConfirmation', () => {
    it('should return true when there are warning tickets', () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.allEvents = [
        { messageValidationLogInfo: [{ isError: false }] }
      ] as LogInfoWrongHdp[];

      // Act
      const result = service.checkCanShowConfirmation(saveRequestArg);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when editing by another user', () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.isEdit = true;
      saveRequestArg.userId = 1;
      saveRequestArg.allEvents = [];
      saveRequestArg.filter = new FilterModel();
      saveRequestArg.filter.action = TVSRequestActionType.TAKE_NOTE_ID.toString();

      // Act
      const result = service.checkCanShowConfirmation(saveRequestArg);

      // Assert
      expect(result).toBe(true);
      expect(document.getElementById).toHaveBeenCalledWith('body');
    });

    it('should return true when has warning taken note', () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.isEdit = true;
      saveRequestArg.allEvents = [];
      saveRequestArg.filter = new FilterModel();
      saveRequestArg.filter.action = TVSRequestActionType.TAKE_NOTE_ID.toString();
      saveRequestArg.actionIdOfFirstTimeAccess = '1';

      // Act
      const result = service.checkCanShowConfirmation(saveRequestArg);

      // Assert
      expect(result).toBe(true);
      expect(document.getElementById).toHaveBeenCalledWith('body');
    });
  });

  describe('isSubTypeWrongHdpOrWrong1stHdp', () => {
    it('should return true for WRONG_HDP subtype', () => {
      // Arrange
      const subIssueTypeId = SubIssueTypeConstant.WRONG_HDP.toString();

      // Act
      const result = service.isSubTypeWrongHdpOrWrong1stHdp(subIssueTypeId);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true for WRONG_1ST_HDP subtype', () => {
      // Arrange
      const subIssueTypeId = SubIssueTypeConstant.WRONG_1ST_HDP.toString();

      // Act
      const result = service.isSubTypeWrongHdpOrWrong1stHdp(subIssueTypeId);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for other subtypes', () => {
      // Arrange
      const subIssueTypeId = 'OTHER_TYPE';

      // Act
      const result = service.isSubTypeWrongHdpOrWrong1stHdp(subIssueTypeId);

      // Assert
      expect(result).toBe(false);
    });
  });
});
