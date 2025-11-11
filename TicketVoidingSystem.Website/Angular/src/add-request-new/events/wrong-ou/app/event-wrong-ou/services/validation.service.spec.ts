import { TestBed } from '@angular/core/testing';
import { EventLeagueComponent } from '../../../../../../utility/components/event-league/event-league.component';
import { Tooltip } from '../../../../../../utility/components/tooltip/tooltip.model';
import { TVSRequestActionType } from '../../../../../../utility/constants/config';
import { TEXT } from '../../../../../../utility/constants/text';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { LogInfoWrongOuComponent } from '../log-info-wrong-ou/log-info-wrong-ou.component';
import { FilterWrongOuModel } from '../models/filter-wrong-ou.model';
import { LogInfoWrongOu } from '../models/log-info-wrong-ou.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { ValidationService } from './validation.service';
import { FilterWrongOuService } from '../filter-wrong-ou/filter-wrong-ou.service';

describe('ValidationService', () => {
  let service: ValidationService;
  let mockBodyElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ValidationService, FilterWrongOuService]
    });

    service = TestBed.inject(ValidationService);

    // Mock document.getElementById
    mockBodyElement = document.createElement('div');
    mockBodyElement.setAttribute('user-id', '2');
    mockBodyElement.id = 'body';
    document.body.appendChild(mockBodyElement);
    jest.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (id === 'body') {
        return mockBodyElement;
      }
      return null;
    });
  });

  afterEach(() => {
    if (mockBodyElement && document.body.contains(mockBodyElement)) {
      document.body.removeChild(mockBodyElement);
    }
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
        filterWrongOuComponent: {
          isValid: () => true
        }
      } as LogInfoWrongOuComponent;

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
        filterWrongOuComponent: {
          isValid: () => true
        }
      } as LogInfoWrongOuComponent;

      // Act
      const result = service.validateCommonData(mockEventLeagueComponent, [mockLogInfoComponent]);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when filterWrongOu is invalid', () => {
      // Arrange
      const mockEventLeagueComponent = {
        isMatchIdValid: () => true
      } as EventLeagueComponent;

      const mockLogInfoComponent = {
        filterWrongOuComponent: {
          isValid: () => false
        }
      } as LogInfoWrongOuComponent;

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
      ] as LogInfoWrongOu[];
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
      ] as LogInfoWrongOu[];
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
      ] as LogInfoWrongOu[];
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
      ] as LogInfoWrongOu[];

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
      ] as LogInfoWrongOu[];

      // Act
      const result = service.isAllEventsValid(events);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('isValidHdp', () => {
    it('should return false when wrongMarket is missing', () => {
      // Arrange
      const filterWrongOuModel = new FilterWrongOuModel();
      const mockTooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isValidHdp(filterWrongOuModel, mockTooltip)

      // Assert
      expect(result).toBe(false);
      expect(mockTooltip.display).toHaveBeenCalled();
    });

    it('should return false when actualMarket is missing', () => {
      // Arrange
      const filterWrongOuModel = new FilterWrongOuModel();
      filterWrongOuModel.wrongMarket = '1.5';
      const mockTooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isValidHdp(filterWrongOuModel, mockTooltip);

      // Assert
      expect(result).toBe(false);
      expect(mockTooltip.display).toHaveBeenCalled();
    });
  });

  describe('checkCanShowConfirmationWrongOu', () => {
    it('should return true when there are warning tickets', () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.allEvents = [
        { messageValidationLogInfo: [{ isError: false }] }
      ] as LogInfoWrongOu[];

      // Act
      const result = service.checkCanShowConfirmationWrongOu(saveRequestArg);

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
      const result = service.checkCanShowConfirmationWrongOu(saveRequestArg);

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
      const result = service.checkCanShowConfirmationWrongOu(saveRequestArg);

      // Assert
      expect(result).toBe(true);
      expect(document.getElementById).toHaveBeenCalledWith('body');
    });
  });
});
