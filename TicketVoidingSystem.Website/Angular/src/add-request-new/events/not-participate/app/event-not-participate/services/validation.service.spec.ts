import { TestBed } from '@angular/core/testing';
import { EventLeagueComponent } from '../../../../../../utility/components/event-league/event-league.component';
import { Tooltip } from '../../../../../../utility/components/tooltip/tooltip.model';
import { TVSRequestActionType } from '../../../../../../utility/constants/config';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { FilterNotParticipateComponent } from '../filter-not-participate/filter-not-participate.component';
import { FilterNotParticipateModel } from '../models/filter-not-participate.model';
import { LogInfoNotParticipate } from '../models/log-info-not-participate.model';
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
    
    // Mock document.getElementById
    let mockBodyElement: HTMLElement;
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
    // Cleanup
    document.body = document.createElement('body');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('validateCommonData', () => {
    it('should return true when all validations pass', () => {
      // Arrange
      const mockEventLeagueComponent = {
        isMatchIdValid: () => true
      } as unknown as EventLeagueComponent;

      const mockFilterNotParticipateComponent = {
        isValid: () => true
      } as unknown as FilterNotParticipateComponent;

      // Act
      const result = service.validateCommonData(mockEventLeagueComponent, mockFilterNotParticipateComponent);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when matchId is invalid', () => {
      // Arrange
      const mockEventLeagueComponent = {
        isMatchIdValid: () => false
      } as unknown as EventLeagueComponent;

      const mockFilterNotParticipateComponent = {
        isValid: () => true
      } as unknown as FilterNotParticipateComponent;

      // Act
      const result = service.validateCommonData(mockEventLeagueComponent, mockFilterNotParticipateComponent);

      // Assert
      expect(result).toBeFalsy();
    });

    it('should return false when filter is invalid', () => {
      // Arrange
      const mockEventLeagueComponent = {
        isMatchIdValid: () => true
      } as unknown as EventLeagueComponent;

      const mockFilterNotParticipateComponent = {
        isValid: () => false
      } as unknown as FilterNotParticipateComponent;

      // Act
      const result = service.validateCommonData(mockEventLeagueComponent, mockFilterNotParticipateComponent);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('isAllFieldsHaveValue', () => {
    it('should return true when all fields have values', () => {
      // Arrange
      const model = {
        playerId: 123,
        betTypeIds: ['1', '2'],
        betTypeMultipleSelection: true
      } as unknown as FilterNotParticipateModel;

      const tooltip = {
        display: jest.fn()
      } as unknown as Tooltip;

      // Act
      const result = service.isAllFieldsHaveValue(model, 1, tooltip);

      // Assert
      expect(result).toBeTruthy();
      expect(tooltip.display).not.toHaveBeenCalled();
    });

    it('should return false and show tooltip when playerId is missing', () => {
      // Arrange
      const model = {
        playerId: 0,
        betTypeIds: ['1', '2'],
        betTypeMultipleSelection: true
      } as unknown as FilterNotParticipateModel;

      const tooltip = {
        display: jest.fn()
      } as unknown as Tooltip;

      // Act
      const result = service.isAllFieldsHaveValue(model, 1, tooltip);

      // Assert
      expect(result).toBeFalsy();
      expect(tooltip.display).toHaveBeenCalledWith('player-dropdown1', 'Required field.');
    });

    it('should return false and show tooltip when betTypeIds is empty', () => {
      // Arrange
      const model = {
        playerId: 123,
        betTypeIds: [],
        betTypeMultipleSelection: true
      } as unknown as FilterNotParticipateModel;

      const tooltip = {
        display: jest.fn()
      } as unknown as Tooltip;

      // Act
      const result = service.isAllFieldsHaveValue(model, 1, tooltip);

      // Assert
      expect(result).toBeFalsy();
      expect(tooltip.display).toHaveBeenCalledWith('bet-type-dropdown1', 'Required field.');
    });
  });

  describe('isValidLogInfoEvent', () => {
    it('should return true when no error messages', () => {
      // Arrange
      const logInfo: LogInfoNotParticipate = {
        messageValidationLogInfo: [
          { isError: false },
          { isError: false }
        ]
      } as LogInfoNotParticipate;

      // Act
      const result = service.isValidLogInfoEvent(logInfo);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when has error messages', () => {
      // Arrange
      const logInfo: LogInfoNotParticipate = {
        messageValidationLogInfo: [
          { isError: false },
          { isError: true }
        ]
      } as LogInfoNotParticipate;

      // Act
      const result = service.isValidLogInfoEvent(logInfo);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('checkCanShowConfirmationNotParticipate', () => {
    it('should return true when has settled tickets', () => {
      // Arrange
      const arg: SaveRequestArg = {
        logInfoEvent: {
          logInfoDetail: {
            settleCount: 1
          },
          messageValidationLogInfo: []
        },
        isEdit: false
      } as SaveRequestArg;

      // Act
      const result = service.checkCanShowConfirmationNotParticipate(arg);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return true when has warning tickets', () => {
      // Arrange
      const arg: SaveRequestArg = {
        logInfoEvent: {
          logInfoDetail: {
            settleCount: 0
          },
          messageValidationLogInfo: [
            { isError: false }
          ]
        },
        isEdit: false
      } as SaveRequestArg;

      // Act
      const result = service.checkCanShowConfirmationNotParticipate(arg);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return true when has warning taken note', () => {
      // Arrange
      document.body = document.createElement('body');
      document.body.setAttribute('user-id', '1');
      const arg: SaveRequestArg = {
        logInfoEvent: {
          logInfoDetail: {
            settleCount: 0
          },
          messageValidationLogInfo: []
        },
        isEdit: true,
        filter: {
          action: TVSRequestActionType.TAKE_NOTE_ID.toString()
        },
        actionIdOfFirstTimeAccess: 'different_action'
      } as SaveRequestArg;

      // Act
      const result = service.checkCanShowConfirmationNotParticipate(arg);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when no conditions are met', () => {
      // Arrange
      const arg: SaveRequestArg = {
        logInfoEvent: {
          logInfoDetail: {
            settleCount: 0
          },
          messageValidationLogInfo: []
        },
        isEdit: false
      } as SaveRequestArg;

      // Act
      const result = service.checkCanShowConfirmationNotParticipate(arg);

      // Assert
      expect(result).toBeFalsy();
    });
  });
});
