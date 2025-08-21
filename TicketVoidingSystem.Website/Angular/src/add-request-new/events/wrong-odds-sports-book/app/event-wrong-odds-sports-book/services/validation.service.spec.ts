import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { EventLeagueComponent } from '../../../../../../utility/components/event-league/event-league.component';
import { FilterWrongOddsSportsBookComponent } from '../filter-wrong-odds-sports-book/filter-wrong-odds-sports-book.component';
import { AdvancedModeAddRequestComponent } from '../../../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.component';
import { Tooltip } from '../../../../../../utility/components/tooltip/tooltip.model';
import { TVSRequestActionType } from '../../../../../../utility/constants/config';
import { FilterWrongOddsSportsBookModel, FilterOddsTypeConstant } from '../models/filter-wrong-odds-sports-book.model';
import { LogInfoWrongOddsSportsBook } from '../models/log-info-wrong-odds-sports-book.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { CheckAddPermissionService } from '../../../../../services/check-permission.service';

describe('ValidationService', () => {
  let service: ValidationService;
  let mockTooltip: Tooltip;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ValidationService, CheckAddPermissionService]
    });

    service = TestBed.inject(ValidationService);
    mockTooltip = {
      display: jest.fn(),
      hide: jest.fn()
    } as unknown as Tooltip;

    // Mock document.getElementById
    document.body.innerHTML = '<div id="body" user-id="1"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('validateCommonData', () => {
    it('should return true when all components are valid', () => {
      const mockEventLeague = {
        isMatchIdValid: () => true
      } as unknown as EventLeagueComponent;

      const mockFilterTime = {
        isValidity: () => true
      } as unknown as FilterWrongOddsSportsBookComponent;

      const mockAdvancedMode = {
        isValidity: () => true
      } as unknown as AdvancedModeAddRequestComponent;

      const result = service.validateCommonData(mockEventLeague, mockFilterTime, mockAdvancedMode);
      expect(result).toBeTruthy();
    });

    it('should return false when event league is invalid', () => {
      const mockEventLeague = {
        isMatchIdValid: () => false
      } as unknown as EventLeagueComponent;

      const mockFilterTime = {
        isValidity: () => true
      } as unknown as FilterWrongOddsSportsBookComponent;

      const result = service.validateCommonData(mockEventLeague, mockFilterTime);
      expect(result).toBeFalsy();
    });
  });

  describe('isValidFilterWrongOddsSportsBook', () => {
    it('should return true when all validations pass', () => {
      const mockFilter = {
        filterOddsType: FilterOddsTypeConstant.VALUE,
        oddsValue: '1.5',
        correctOdds: '2.0',
        liveIndicator: '1',
        fromDateTime: new Date(),
        toDateTime: new Date(),
        fromOdds: '1.0',
        toOdds: '2.0'
      } as unknown as FilterWrongOddsSportsBookModel;

      const result = service.isValidFilterWrongOddsSportsBook(mockFilter, mockTooltip);
      expect(result).toBeTruthy();
    });

    it('should return false when live indicator is missing', () => {
      const mockFilter = {
        filterOddsType: FilterOddsTypeConstant.VALUE,
        oddsValue: '1.5',
        correctOdds: '2.0',
        liveIndicator: null,
        fromDateTime: new Date(),
        toDateTime: new Date(),
        fromOdds: '1.0',
        toOdds: '2.0'
      } as unknown as FilterWrongOddsSportsBookModel;

      const result = service.isValidFilterWrongOddsSportsBook(mockFilter, mockTooltip);
      expect(result).toBeFalsy();
      expect(mockTooltip.display).toHaveBeenCalled();
    });
  });

  describe('isValidLogInfoEvent', () => {
    it('should return true when no error messages', () => {
      const mockLogInfo = {
        messageValidationLogInfo: [
          { isError: false },
          { isError: false }
        ]
      } as LogInfoWrongOddsSportsBook;

      const result = service.isValidLogInfoEvent(mockLogInfo);
      expect(result).toBeTruthy();
    });

    it('should return false when has error messages', () => {
      const mockLogInfo = {
        messageValidationLogInfo: [
          { isError: false },
          { isError: true }
        ]
      } as LogInfoWrongOddsSportsBook;

      const result = service.isValidLogInfoEvent(mockLogInfo);
      expect(result).toBeFalsy();
    });
  });

  describe('isValidFilterOddsValue', () => {
    it('should return true for valid odds value', () => {
      const result = service.isValidFilterOddsValue('1.5', mockTooltip);
      expect(result).toBeTruthy();
    });

    it('should return false for invalid odds value', () => {
      const result = service.isValidFilterOddsValue('0', mockTooltip);
      expect(result).toBeFalsy();
      expect(mockTooltip.display).toHaveBeenCalled();
    });
  });

  describe('checkCanShowConfirmationWrongOdds', () => {
    it('should return true when has warning tickets', () => {
      const mockArg = {
        logInfoEvent: {
          messageValidationLogInfo: [{ isError: false }]
        },
        isEdit: false,
        userId: 1
      } as SaveRequestArg;

      const result = service.checkCanShowConfirmationWrongOdds(mockArg);
      expect(result).toBeTruthy();
    });

    it('should return true when editing by another user', () => {
      const mockArg = {
        logInfoEvent: {
          messageValidationLogInfo: [{ isError: true }]
        },
        isEdit: true,
        userId: 1,
        filter: {
          action: TVSRequestActionType.TAKE_NOTE_ID.toString()
        },
        actionIdOfFirstTimeAccess: 'different_id'
      } as SaveRequestArg;

      document.body.innerHTML = '<div id="body" user-id="2"></div>';
      const result = service.checkCanShowConfirmationWrongOdds(mockArg);
      expect(result).toBeTruthy();
    });
  });
});
