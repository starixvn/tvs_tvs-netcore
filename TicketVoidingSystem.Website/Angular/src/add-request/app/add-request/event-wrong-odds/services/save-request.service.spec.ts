import { TestBed } from '@angular/core/testing';
import { SaveRequestService } from './save-request.service';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { ValidationService } from './validation.service';
import { LogInfoService } from './log-info.service';
import { PopupService } from '../../services/popup.service';
import { AddRequestService } from '../../add-request.service';
import { EventWrongOddsService } from './event-wrong-odds.service';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { LogInfoWrongOdds } from '../models/log-info-wrong-odds.model';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import moment from 'moment-timezone';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { FilterWrongOddsComponent } from '../filter-wrong-odds/filter-wrong-odds.component';

describe('SaveRequestService', () => {
  let service: SaveRequestService;
  let validationService: ValidationService;
  let logInfoService: LogInfoService;
  let eventWrongOddsService: EventWrongOddsService;

  const mockAddRequestStore = {
    changeBlockingUiStatus: jest.fn(),
    changeSavingRequestStatus: jest.fn()
  };

  const mockEventLeagueComponent = {
    isEdit: false,
    matchId: '123',
    isShowSportType: false,
    changeEvent: jest.fn(),
    isMatchIdValid: jest.fn(),
    selectedMatch: null,
    matches: [],
    isBlock: false,
    tooltip: null
  } as unknown as EventLeagueComponent;

  const mockFilterWrongOddsComponent = {
    isValid: jest.fn().mockReturnValue(true),
    filterWrongOddsModel: {},
    isEdit: false,
    subIssueTypeId: '',
    isDisabled: false
  } as unknown as FilterWrongOddsComponent;

  const mockLogInfoWrongOdds = {
    matchId: 123,
    isShowValidation: false,
    messageValidationLogInfo: [{ isError: false, reason: '' }],
    logInfoDetail: {},
    filterWrongOdds: {
      filterFromTransTime: moment().format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
      filterToTransTime: moment().add(1, 'hour').format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
      spread: '0.5',
      allowanceRate: '1',
      liveIndicator: 1,
      wrongOU: '0.5',
      filterFavoriteType: '1',
      favoriteValue: '0.5'
    },
    linkedLogsViewModel: {
      isLinkGroup1X2: false,
      isLinkGroupAIO: false
    }
  } as unknown as LogInfoWrongOdds;

  const mockSaveRequestArg = {
    isEdit: false,
    requestId: 123,
    userId: 1,
    requestedBy: 'Test User',
    actionIdOfFirstTimeAccess: TVSRequestActionType.TAKE_NOTE_ID.toString(),
    addRequestStore: mockAddRequestStore,
    eventLeagueComponent: mockEventLeagueComponent,
    filterWrongOddsComponent: mockFilterWrongOddsComponent,
    logInfoEvent: mockLogInfoWrongOdds,
    filter: {
      isVoided: false,
      issueTypeId: '1',
      subIssueTypeId: SubIssueTypeConstant.OVER_UNDER.toString(),
      action: TVSRequestActionType.TAKE_NOTE_ID.toString(),
      isTest: false,
      isAbnormal: false,
      actions: []
    },
    primitiveProps: {
      transInfoAddRequestModel: {
        transInfoJson: '{}',
        unMarkTransIds: '',
        markTransIds: '',
        removeTransIds: ''
      },
      isBlock: false
    },
    others: {
      mistakenBy: 'Test',
      decidedBy: 'Test',
      remark: 'Test'
    },
    confirmAddRequest: {
      isOpen: false
    }
  } as unknown as SaveRequestArg;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        SaveRequestService,
        ValidationService,
        LogInfoService,
        PopupService,
        AddRequestService,
        EventWrongOddsService
      ]
    });

    service = TestBed.inject(SaveRequestService);
    validationService = TestBed.inject(ValidationService);
    logInfoService = TestBed.inject(LogInfoService);
    eventWrongOddsService = TestBed.inject(EventWrongOddsService);

    // Mock document.getElementById
    document.getElementById = jest.fn().mockReturnValue({ getAttribute: () => '1' } as unknown as HTMLElement);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('recheckLogInfoBeforeSaveRequest', () => {
    it('should return true when all validations pass', async () => {
      // Arrange
      jest.spyOn(validationService, 'validateCommonData').mockReturnValue(true);
      jest.spyOn(eventWrongOddsService, 'getLinkedLog').mockResolvedValue({
        isLinkGroup1X2: false,
        isLinkGroupAIO: false,
        groupLinkedLogs: [],
        result: {
          errorCode: 0,
          errorMsg: '',
          isSuccessful: true,
          data: null
        }
      });
      jest.spyOn(logInfoService, 'getLogInfo').mockResolvedValue();
      jest.spyOn(validationService, 'isValidLogInfoEvent').mockReturnValue(true);

      // Act
      const result = await service['recheckLogInfoBeforeSaveRequest'](mockSaveRequestArg);

      // Assert
      expect(result).toBeTruthy();
      expect(mockAddRequestStore.changeBlockingUiStatus).toHaveBeenCalled();
      expect(mockLogInfoWrongOdds.isShowValidation).toBeTruthy();
    });

    it('should return false when common data validation fails', async () => {
      // Arrange
      jest.spyOn(validationService, 'validateCommonData').mockReturnValue(false);

      // Act
      const result = await service['recheckLogInfoBeforeSaveRequest'](mockSaveRequestArg);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('getWrongOddsInfo', () => {
    it('should return correct model for OU type', () => {
      // Arrange
      const subIssueTypeId = SubIssueTypeConstant.OVER_UNDER.toString();
      jest.spyOn(validationService, 'isSubTypeOuOr1stOu').mockReturnValue(true);

      // Act
      const result = service.getWrongOddsInfo(mockLogInfoWrongOdds, subIssueTypeId);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].matchId).toBe(mockLogInfoWrongOdds.matchId);
      expect(result[0].wrongOU).toBeDefined();
      expect(result[0].filterFavoriteType).toBeUndefined();
    });

    it('should return correct model for non-OU type', () => {
      // Arrange
      const subIssueTypeId = '1';
      jest.spyOn(validationService, 'isSubTypeOuOr1stOu').mockReturnValue(false);

      // Act
      const result = service.getWrongOddsInfo(mockLogInfoWrongOdds, subIssueTypeId);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].matchId).toBe(mockLogInfoWrongOdds.matchId);
      expect(result[0].wrongOU).toBeUndefined();
      expect(result[0].filterFavoriteType).toBeDefined();
    });
  });
});
