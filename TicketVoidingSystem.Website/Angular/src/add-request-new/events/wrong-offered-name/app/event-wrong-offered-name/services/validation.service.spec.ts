import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';
import { EventLeagueComponent } from '../../../../../../utility/components/event-league/event-league.component';
import { FilterWrongOfferedNameComponent } from '../filter-wrong-offered-name/filter-wrong-offered-name.component';
import { CheckAddPermissionService } from '../../../../../services/check-permission.service';
import { PermissionAddRequest } from '../../../../../models/permission-add-request.model';
import { LogInfoWrongOfferedName } from '../models/log-info-wrong-offered-name.model';
import { SubIssueTypeConstant } from '../../../../../../utility/constants/sub-issue-type.constant';

describe('ValidationService', () => {
  let service: ValidationService;
  let checkPermissionService: jest.Mocked<CheckAddPermissionService>;
  let eventLeagueComponent: jest.Mocked<EventLeagueComponent>;
  let filterWrongOfferedNameComponent: jest.Mocked<FilterWrongOfferedNameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ValidationService,
        { provide: CheckAddPermissionService, useValue: {
          isAccountHasAddRequestPermission: jest.fn()
        } }
      ]
    });

    service = TestBed.inject(ValidationService);
    checkPermissionService = TestBed.inject(CheckAddPermissionService) as jest.Mocked<CheckAddPermissionService>;
    eventLeagueComponent = {
      isMatchIdValid: jest.fn()
    } as unknown as jest.Mocked<EventLeagueComponent>;
    filterWrongOfferedNameComponent = {
      isValidity: jest.fn()
    } as unknown as jest.Mocked<FilterWrongOfferedNameComponent>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isAccountHasAddRequestPermission', () => {
    it('should call checkPermissionService with correct parameters', () => {
      // Arrange
      const action = 'test-action';
      const isHasInstantlySettledTicket = true;
      const isHasSettledTicket = false;
      const permission = {} as PermissionAddRequest;
      checkPermissionService.isAccountHasAddRequestPermission.mockReturnValue(true);

      // Act
      const result = service.isAccountHasAddRequestPermission(
        action,
        isHasInstantlySettledTicket,
        isHasSettledTicket,
        permission
      );

      // Assert
      expect(checkPermissionService.isAccountHasAddRequestPermission)
        .toHaveBeenCalledWith(action, isHasInstantlySettledTicket, isHasSettledTicket, permission);
      expect(result).toBe(true);
    });
  });

  describe('validateCommonData', () => {
    it('should return true when both components are valid', () => {
      // Arrange
      eventLeagueComponent.isMatchIdValid.mockReturnValue(true);
      filterWrongOfferedNameComponent.isValidity.mockReturnValue(true);

      // Act
      const result = service.validateCommonData(eventLeagueComponent, filterWrongOfferedNameComponent);

      // Assert
      expect(result).toBe(true);
      expect(eventLeagueComponent.isMatchIdValid).toHaveBeenCalled();
      expect(filterWrongOfferedNameComponent.isValidity).toHaveBeenCalled();
    });

    it('should return false when eventLeague is invalid', () => {
      // Arrange
      eventLeagueComponent.isMatchIdValid.mockReturnValue(false);
      filterWrongOfferedNameComponent.isValidity.mockReturnValue(true);

      // Act
      const result = service.validateCommonData(eventLeagueComponent, filterWrongOfferedNameComponent);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when filterWrongOfferedName is invalid', () => {
      // Arrange
      eventLeagueComponent.isMatchIdValid.mockReturnValue(true);
      filterWrongOfferedNameComponent.isValidity.mockReturnValue(false);

      // Act
      const result = service.validateCommonData(eventLeagueComponent, filterWrongOfferedNameComponent);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('isValidLogInfoEvent', () => {
    it('should return true when no validation errors exist', () => {
      // Arrange
      const logInfo = {
        messageValidationLogInfo: [
          { isError: false },
          { isError: false }
        ]
      } as LogInfoWrongOfferedName;

      // Act
      const result = service.isValidLogInfoEvent(logInfo);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when validation errors exist', () => {
      // Arrange
      const logInfo = {
        messageValidationLogInfo: [
          { isError: false },
          { isError: true }
        ]
      } as LogInfoWrongOfferedName;

      // Act
      const result = service.isValidLogInfoEvent(logInfo);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('isSubTypeChinese', () => {
    it('should return true for team name chinese', () => {
      // Act
      const result = service.isSubTypeChinese(SubIssueTypeConstant.TEAM_NAME_CHINESE.toString());

      // Assert
      expect(result).toBe(true);
    });

    it('should return true for league name chinese', () => {
      // Act
      const result = service.isSubTypeChinese(SubIssueTypeConstant.LEAGUE_NAME_CHINESE.toString());

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for other sub types', () => {
      // Act
      const result = service.isSubTypeChinese('other-type');

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('isSubTypeOfLeague', () => {
    it('should return true for league name english', () => {
      // Act
      const result = service.isSubTypeOfLeague(SubIssueTypeConstant.LEAGUE_NAME_ENGLISH.toString());

      // Assert
      expect(result).toBe(true);
    });

    it('should return true for league name chinese', () => {
      // Act
      const result = service.isSubTypeOfLeague(SubIssueTypeConstant.LEAGUE_NAME_CHINESE.toString());

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for other sub types', () => {
      // Act
      const result = service.isSubTypeOfLeague('other-type');

      // Assert
      expect(result).toBe(false);
    });
  });
});
