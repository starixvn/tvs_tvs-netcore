import { TestBed } from '@angular/core/testing';
import { AdvancedModeAddRequestComponent } from '../../../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.component';
import { EventLeagueComponent } from '../../../../../../utility/components/event-league/event-league.component';
import { TVSRequestActionType } from '../../../../../../utility/constants/config';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { FilterTimeTechnicalErrorComponent } from '../filter-time-technical-error/filter-time-technical-error.component';
import { LogInfoTechnicalError } from '../models/log-info-technical-error.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ValidationService]
    });

    service = TestBed.inject(ValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('validateCommonData', () => {
    it('should return false when match ID is invalid', () => {
      // Arrange
      const mockEventLeague = {
        isMatchIdValid: () => false
      } as unknown as EventLeagueComponent;

      const mockFilterTime = {
        isValidity: () => true
      } as unknown as FilterTimeTechnicalErrorComponent;

      // Act
      const result = service.validateCommonData(mockEventLeague, mockFilterTime);

      // Assert
      expect(result).toBeFalsy();
    });

    it('should return false when filter time is invalid', () => {
      // Arrange
      const mockEventLeague = {
        isMatchIdValid: () => true
      } as unknown as EventLeagueComponent;

      const mockFilterTime = {
        isValidity: () => false
      } as unknown as FilterTimeTechnicalErrorComponent;

      // Act
      const result = service.validateCommonData(mockEventLeague, mockFilterTime);

      // Assert
      expect(result).toBeFalsy();
    });

    it('should return false when advanced mode is invalid', () => {
      // Arrange
      const mockEventLeague = {
        isMatchIdValid: () => true
      } as unknown as EventLeagueComponent;

      const mockFilterTime = {
        isValidity: () => true
      } as unknown as FilterTimeTechnicalErrorComponent;

      const mockAdvancedMode = {
        isValidity: () => false
      } as unknown as AdvancedModeAddRequestComponent;

      // Act
      const result = service.validateCommonData(mockEventLeague, mockFilterTime, mockAdvancedMode);

      // Assert
      expect(result).toBeFalsy();
    });

    it('should return true when all validations pass', () => {
      // Arrange
      const mockEventLeague = {
        isMatchIdValid: () => true
      } as unknown as EventLeagueComponent;

      const mockFilterTime = {
        isValidity: () => true
      } as unknown as FilterTimeTechnicalErrorComponent;

      const mockAdvancedMode = {
        isValidity: () => true
      } as unknown as AdvancedModeAddRequestComponent;

      // Act
      const result = service.validateCommonData(mockEventLeague, mockFilterTime, mockAdvancedMode);

      // Assert
      expect(result).toBeTruthy();
    });
  });

  describe('isValidLogInfoEvent', () => {
    it('should return false when there are error messages', () => {
      // Arrange
      const mockLogInfo: LogInfoTechnicalError = {
        messageValidationLogInfo: [
          { isError: true },
          { isError: false }
        ]
      } as LogInfoTechnicalError;

      // Act
      const result = service.isValidLogInfoEvent(mockLogInfo);

      // Assert
      expect(result).toBeFalsy();
    });

    it('should return true when there are no error messages', () => {
      // Arrange
      const mockLogInfo: LogInfoTechnicalError = {
        messageValidationLogInfo: [
          { isError: false },
          { isError: false }
        ]
      } as LogInfoTechnicalError;

      // Act
      const result = service.isValidLogInfoEvent(mockLogInfo);

      // Assert
      expect(result).toBeTruthy();
    });
  });

  describe('checkCanShowConfirmationTechnicalError', () => {
    beforeEach(() => {
      // Mock document.getElementById
      document.getElementById = jest.fn().mockReturnValue({
        getAttribute: () => '2'
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return true when has settled tickets', () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        logInfoEvent: {
          logInfoDetail: {
            settleCount: 1
          }
        },
        isEdit: false,
        filter: {
          action: TVSRequestActionType.TAKE_NOTE_ID.toString()
        }
      } as SaveRequestArg;

      // Act
      const result = service.checkCanShowConfirmationTechnicalError(mockArg);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return true when has warning tickets', () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        logInfoEvent: {
          messageValidationLogInfo: [
            { isError: false }
          ]
        },
        isEdit: false,
        filter: {
          action: TVSRequestActionType.TAKE_NOTE_ID.toString()
        }
      } as SaveRequestArg;

      // Act
      const result = service.checkCanShowConfirmationTechnicalError(mockArg);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return true when editing by another user', () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        isEdit: true,
        userId: 1,
        filter: {
          action: TVSRequestActionType.TAKE_NOTE_ID.toString()
        },
        logInfoEvent: {
          logInfoDetail: {
            settleCount: 0
          },
          messageValidationLogInfo: []
        }
      } as SaveRequestArg;

      // Act
      const result = service.checkCanShowConfirmationTechnicalError(mockArg);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return true when has warning taken note', () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        isEdit: true,
        filter: {
          action: TVSRequestActionType.TAKE_NOTE_ID.toString()
        },
        actionIdOfFirstTimeAccess: 'different_action',
        logInfoEvent: {
          logInfoDetail: {
            settleCount: 0
          },
          messageValidationLogInfo: []
        }
      } as SaveRequestArg;

      // Act
      const result = service.checkCanShowConfirmationTechnicalError(mockArg);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when no warning conditions are met', () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        isEdit: false,
        filter: {
          action: TVSRequestActionType.TAKE_NOTE_ID.toString()
        },
        logInfoEvent: {
          logInfoDetail: {
            settleCount: 0
          },
          messageValidationLogInfo: [
            { isError: true }
          ]
        }
      } as SaveRequestArg;

      // Act
      const result = service.checkCanShowConfirmationTechnicalError(mockArg);

      // Assert
      expect(result).toBeFalsy();
    });
  });
});
