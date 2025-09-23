import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { EventLeagueComponent } from '../../../../../../utility/components/event-league/event-league.component';
import { DateFullTimeNewComponent } from '../../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { LogInfoEarlyKickOff } from '../models/log-info-eko.model';
import { Tooltip } from '../../../../../../utility/components/tooltip/tooltip.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { TVSRequestActionType } from '../../../../../../utility/constants/config';
import { TEXT } from '../../../../../../utility/constants/text';

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
    expect(service).toBeTruthy();
  });

  describe('validateCommonData', () => {
    it('should return true when all validations pass', () => {
      // Arrange
      const mockEventLeagueComponent = {
        isMatchIdValid: () => true
      } as EventLeagueComponent;

      const mockKickOffTimeComponent = {
        validateWithTooltip: () => true
      } as DateFullTimeNewComponent;

      // Act
      const result = service.validateCommonData(mockEventLeagueComponent, mockKickOffTimeComponent);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when matchId is invalid', () => {
      // Arrange
      const mockEventLeagueComponent = {
        isMatchIdValid: () => false
      } as EventLeagueComponent;

      const mockKickOffTimeComponent = {
        validateWithTooltip: () => true
      } as DateFullTimeNewComponent;

      // Act
      const result = service.validateCommonData(mockEventLeagueComponent, mockKickOffTimeComponent);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when kickOff time is invalid', () => {
      // Arrange
      const mockEventLeagueComponent = {
        isMatchIdValid: () => true
      } as EventLeagueComponent;

      const mockKickOffTimeComponent = {
        validateWithTooltip: () => false
      } as DateFullTimeNewComponent;

      // Act
      const result = service.validateCommonData(mockEventLeagueComponent, mockKickOffTimeComponent);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('isValidInputRelatedEvent', () => {
    it('should return false when input matchId is same as main match', () => {
      // Arrange
      const inputMatchId = 123;
      const matchIdClass = 'input-match-id';
      const allEvents = [
        { matchId: 123, isMainMatch: true },
        { matchId: 456, isMainMatch: false }
      ] as LogInfoEarlyKickOff[];
      const mockTooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isValidInputRelatedEvent(inputMatchId, matchIdClass, allEvents, mockTooltip);

      // Assert
      expect(result).toBe(false);
      expect(mockTooltip.display).toHaveBeenCalledWith(matchIdClass, TEXT.INVALID_MATCHID);
    });

    it('should return false when input matchId already exists in related events', () => {
      // Arrange
      const inputMatchId = 456;
      const matchIdClass = 'input-match-id';
      const allEvents = [
        { matchId: 123, isMainMatch: true },
        { matchId: 456, isMainMatch: false }
      ] as LogInfoEarlyKickOff[];
      const mockTooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isValidInputRelatedEvent(inputMatchId, matchIdClass, allEvents, mockTooltip);

      // Assert
      expect(result).toBe(false);
      expect(mockTooltip.display).toHaveBeenCalledWith(matchIdClass, TEXT.MATCH_ID_EXISTS_IN_LIST);
    });

    it('should return true when input matchId is valid', () => {
      // Arrange
      const inputMatchId = 789;
      const matchIdClass = 'input-match-id';
      const allEvents = [
        { matchId: 123, isMainMatch: true },
        { matchId: 456, isMainMatch: false }
      ] as LogInfoEarlyKickOff[];
      const mockTooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isValidInputRelatedEvent(inputMatchId, matchIdClass, allEvents, mockTooltip);

      // Assert
      expect(result).toBe(true);
      expect(mockTooltip.display).not.toHaveBeenCalled();
    });
  });

  describe('isAllEventsValid', () => {
    it('should return true when all events are valid', () => {
      // Arrange
      const events = [
        { isMainMatch: true, isInvalidTotalTickets: false },
        { isMainMatch: false, isInvalidTotalTickets: false }
      ] as LogInfoEarlyKickOff[];

      // Act
      const result = service.isAllEventsValid(events);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when main match has invalid total tickets', () => {
      // Arrange
      const events = [
        { isMainMatch: true, isInvalidTotalTickets: true },
        { isMainMatch: false, isInvalidTotalTickets: false }
      ] as LogInfoEarlyKickOff[];

      // Act
      const result = service.isAllEventsValid(events);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('checkCanShowConfirmationEarlyKickOff', () => {
    it('should return true when there are warning events', () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.allEvents = [
        { isMainMatch: false, isInvalidTotalTickets: true }
      ] as LogInfoEarlyKickOff[];

      // Act
      const result = service.checkCanShowConfirmationEarlyKickOff(saveRequestArg);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when there are warning tickets', () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.allEvents = [
        { messageValidationLogInfo: [{ isError: false }] }
      ] as LogInfoEarlyKickOff[];

      // Act
      const result = service.checkCanShowConfirmationEarlyKickOff(saveRequestArg);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when editing by another user', () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.isEdit = true;
      saveRequestArg.userId = 1;
      saveRequestArg.allEvents = [];
      saveRequestArg.filter = {
        action: '',
        subIssueTypeId: '',
        isTest: false,
        isAbnormal: false,
        isVoided: false,
        actions: []
      };
      saveRequestArg.actionIdOfFirstTimeAccess = '';

      // Act
      const result = service.checkCanShowConfirmationEarlyKickOff(saveRequestArg);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when has warning taken note', () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.isEdit = true;
      saveRequestArg.allEvents = [];
      saveRequestArg.filter = {
        action: TVSRequestActionType.TAKE_NOTE_ID.toString(),
        subIssueTypeId: '',
        isTest: false,
        isAbnormal: false,
        isVoided: false,
        actions: []
      };
      saveRequestArg.actionIdOfFirstTimeAccess = '1';

      // Act
      const result = service.checkCanShowConfirmationEarlyKickOff(saveRequestArg);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('isEditingByAnotherUser', () => {
    it('should return true when editing by another user', () => {
      // Arrange
      const isEdit = true;
      const editingBy = 1;
      const createdBy = 2;

      // Act
      const result = service.isEditingByAnotherUser(isEdit, editingBy, createdBy);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when not in edit mode', () => {
      // Arrange
      const isEdit = false;
      const editingBy = 1;
      const createdBy = 2;

      // Act
      const result = service.isEditingByAnotherUser(isEdit, editingBy, createdBy);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when editing by same user', () => {
      // Arrange
      const isEdit = true;
      const editingBy = 1;
      const createdBy = 1;

      // Act
      const result = service.isEditingByAnotherUser(isEdit, editingBy, createdBy);

      // Assert
      expect(result).toBe(false);
    });
  });
});
