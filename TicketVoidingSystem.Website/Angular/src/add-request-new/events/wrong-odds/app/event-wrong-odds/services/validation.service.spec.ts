import { TestBed } from '@angular/core/testing';
import moment from 'moment-timezone';
import { EventLeagueComponent } from '../../../../../../utility/components/event-league/event-league.component';
import { Tooltip } from '../../../../../../utility/components/tooltip/tooltip.model';
import { DateTimeFormat, TVSRequestActionType } from '../../../../../../utility/constants/config';
import { SubIssueTypeConstant } from '../../../../../../utility/constants/sub-issue-type.constant';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { StaticService } from '../../../../../../utility/services/static.service';
import { FilterWrongOddsComponent } from '../filter-wrong-odds/filter-wrong-odds.component';
import { FilterWrongOddsModel } from '../models/filter-wrong-odds.model';
import { LogInfoWrongOdds } from '../models/log-info-wrong-odds.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  let service: ValidationService;
  let tooltip: Tooltip;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ValidationService, StaticService]
    });
    service = TestBed.inject(ValidationService);
    tooltip = {
      display: jest.fn(),
      hide: jest.fn(),
      element: { nativeElement: document.createElement('div') }
    } as unknown as Tooltip;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('validateCommonData', () => {
    it('should return true when both components are valid', () => {
      // Arrange
      const eventLeagueComponent = {
        isMatchIdValid: jest.fn().mockReturnValue(true)
      } as unknown as EventLeagueComponent;
      const filterWrongOddsComponent = {
        isValid: jest.fn().mockReturnValue(true)
      } as unknown as FilterWrongOddsComponent;

      // Act
      const result = service.validateCommonData(eventLeagueComponent, filterWrongOddsComponent);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when event league is invalid', () => {
      // Arrange
      const eventLeagueComponent = {
        isMatchIdValid: jest.fn().mockReturnValue(false)
      } as unknown as EventLeagueComponent;
      const filterWrongOddsComponent = {
        isValid: jest.fn().mockReturnValue(true)
      } as unknown as FilterWrongOddsComponent;

      // Act
      const result = service.validateCommonData(eventLeagueComponent, filterWrongOddsComponent);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('isFromTimeSameOrBeforeToTime', () => {
    it('should return true when from time is before to time', () => {
      // Arrange
      const filterWrongOddsModel = {
        filterFromTransTime: moment().format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
        filterToTransTime: moment().add(1, 'hour').format(DateTimeFormat.FULL_DATE_TIME_FORMAT)
      } as FilterWrongOddsModel;
      StaticService.isFromTimeSameOrBeforeToTime = jest.fn().mockReturnValue(true);

      // Act
      const result = service.isFromTimeSameOrBeforeToTime(filterWrongOddsModel, tooltip);

      // Assert
      expect(result).toBeTruthy();
    });
  });

  describe('isValidFilterWrongOdds', () => {
    it('should return true when all validations pass', () => {
      // Arrange
      const filterWrongOddsModel = {
        filterFromTransTime: moment().format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
        filterToTransTime: moment().add(1, 'hour').format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
        maxBet: 100,
        allowanceRate: '1',
        favoriteValue: '0.5',
        wrongOU: '0.5',
        spread: '0.5',
        correctOddsHomeOver: '1.5',
        correctOddsAwayUnder: '2.5',
        liveIndicator: 1,
        fromOddsNotVoidHomeOver: '1.5',
        toOddsNotVoidHomeOver: '1.5',
        fromOddsNotVoidAwayUnder: '2.5',
        toOddsNotVoidAwayUnder: '2.5',
        maxBetAndSpreadInfo: []
      } as FilterWrongOddsModel;
      const subIssueTypeId = SubIssueTypeConstant.OVER_UNDER.toString();
      
      // Mock all validation methods
      service['isSubTypeOuOr1stOu'] = jest.fn().mockReturnValue(true);
      service['isValidFilterOu'] = jest.fn().mockReturnValue(true);
      service['isValidFilterLiveIndicator'] = jest.fn().mockReturnValue(true);
      service['isValidSpread'] = jest.fn().mockReturnValue(true);
      service['isValidFilterCorrectOdds'] = jest.fn().mockReturnValue(true)

      // Act
      const result = service.isValidFilterWrongOdds(filterWrongOddsModel, tooltip, subIssueTypeId);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when live indicator is missing', () => {
      // Arrange
      const filterWrongOddsModel = {
        filterFromTransTime: moment().format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
        filterToTransTime: moment().add(1, 'hour').format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
        maxBet: 100,
        allowanceRate: '1',
        favoriteValue: '0.5',
        wrongOU: '0.5',
        spread: '0.5',
        correctOddsHomeOver: '1.5',
        correctOddsAwayUnder: '2.5',
        liveIndicator: null,
        fromOddsNotVoidHomeOver: '1.5',
        toOddsNotVoidHomeOver: '1.5',
        fromOddsNotVoidAwayUnder: '2.5',
        toOddsNotVoidAwayUnder: '2.5',
        maxBetAndSpreadInfo: []
      } as FilterWrongOddsModel;
      const subIssueTypeId = SubIssueTypeConstant.OVER_UNDER.toString();

      // Act
      const result = service.isValidFilterWrongOdds(filterWrongOddsModel, tooltip, subIssueTypeId);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('isValidLogInfoEvent', () => {
    it('should return true when no error messages', () => {
      // Arrange
      const logInfoWrongOdds = {
        messageValidationLogInfo: [
          { isError: false }
        ]
      } as LogInfoWrongOdds;

      // Act
      const result = service.isValidLogInfoEvent(logInfoWrongOdds);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when has error messages', () => {
      // Arrange
      const logInfoWrongOdds = {
        messageValidationLogInfo: [
          { isError: true }
        ]
      } as LogInfoWrongOdds;

      // Act
      const result = service.isValidLogInfoEvent(logInfoWrongOdds);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('isSubTypeOuOr1stOu', () => {
    it('should return true for OU type', () => {
      // Act
      const result = service.isSubTypeOuOr1stOu(SubIssueTypeConstant.OVER_UNDER.toString());

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return true for 1st OU type', () => {
      // Act
      const result = service.isSubTypeOuOr1stOu(SubIssueTypeConstant.FIRST_HALF_OVER_UNDER.toString());

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false for other types', () => {
      // Act
      const result = service.isSubTypeOuOr1stOu('other-type');

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('checkCanShowConfirmationWrongOdds', () => {
    it('should return true when has warning ticket', () => {
      // Arrange
      const argWrongOdds = {
        logInfoEvent: {
          messageValidationLogInfo: [{ isError: false }]
        }
      } as SaveRequestArg;

      // Act
      const result = service.checkCanShowConfirmationWrongOdds(argWrongOdds);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return true when editing by another user', () => {
      // Arrange
      const argWrongOdds = {
        isEdit: true,
        userId: 1,
        logInfoEvent: {
          messageValidationLogInfo: [{ isError: true }]
        },
        filter: {
          action: TVSRequestActionType.TAKE_NOTE_ID.toString()
        }
      } as SaveRequestArg;
      document.getElementById = jest.fn().mockReturnValue({ getAttribute: () => '2' } as unknown as HTMLElement);

      // Act
      const result = service.checkCanShowConfirmationWrongOdds(argWrongOdds);

      // Assert
      expect(result).toBeTruthy();
    });
  });

  describe('isValidSpread', () => {
    it('should return true for valid spread', () => {
      // Arrange
      StaticService.isCorrectFormatSingleDecimal = jest.fn().mockReturnValue(true);

      // Act
      const result = service.isValidSpread('0.5', tooltip);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false for invalid spread format', () => {
      // Arrange
      StaticService.isCorrectFormatSingleDecimal = jest.fn().mockReturnValue(false);

      // Act
      const result = service.isValidSpread('invalid', tooltip);

      // Assert
      expect(result).toBeFalsy();
      expect(tooltip.display).toHaveBeenCalled();
    });

    it('should return false for spread out of range', () => {
      // Arrange
      StaticService.isCorrectFormatSingleDecimal = jest.fn().mockReturnValue(true);

      // Act
      const result = service.isValidSpread('1.5', tooltip);

      // Assert
      expect(result).toBeFalsy();
      expect(tooltip.display).toHaveBeenCalled();
    });
  });

  describe('isValidFilterCorrectOdds', () => {
    it('should return true for valid odds', () => {
      // Arrange
      StaticService.isCorrectFormatSingleDecimal = jest.fn().mockReturnValue(true);

      // Act
      const result = service.isValidFilterCorrectOdds('0.6', '0.5', tooltip);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false for invalid odds format', () => {
      // Arrange
      StaticService.isCorrectFormatSingleDecimal = jest.fn().mockReturnValue(false);

      // Act
      const result = service.isValidFilterCorrectOdds('invalid', '0.5', tooltip);

      // Assert
      expect(result).toBeFalsy();
      expect(tooltip.display).toHaveBeenCalled();
    });

    it('should return false for odds less than spread', () => {
      // Arrange
      StaticService.isCorrectFormatSingleDecimal = jest.fn().mockReturnValue(true);

      // Act
      const result = service.isValidFilterCorrectOdds('0.3', '0.5', tooltip);

      // Assert
      expect(result).toBeFalsy();
      expect(tooltip.display).toHaveBeenCalled();
    });
  });
});
