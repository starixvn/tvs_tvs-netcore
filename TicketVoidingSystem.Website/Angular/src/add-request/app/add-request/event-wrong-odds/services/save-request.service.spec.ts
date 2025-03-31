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

describe('SaveRequestService', () => {
  let service: SaveRequestService;
  let validationService: ValidationService;
  let logInfoService: LogInfoService;
  let popupService: PopupService;
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
  } as unknown as any;

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
    popupService = TestBed.inject(PopupService);
    eventWrongOddsService = TestBed.inject(EventWrongOddsService);

    // Mock document.getElementById
    document.getElementById = jest.fn().mockReturnValue({ getAttribute: () => '1' } as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveRequest', () => {
    it('should proceed save request when data is valid', async () => {
      // Arrange
      jest.spyOn(service as any, 'recheckLogInfoBeforeSaveRequest').mockResolvedValue(true);
      jest.spyOn(service as any, 'proceedSaveRequest').mockImplementation(() => {});

      // Act
      await service.saveRequest(mockSaveRequestArg);

      // Assert
      expect(mockAddRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
      expect(service['proceedSaveRequest']).toHaveBeenCalledWith(mockSaveRequestArg);
    });

    it('should not proceed save request when data is invalid', async () => {
      // Arrange
      jest.spyOn(service as any, 'recheckLogInfoBeforeSaveRequest').mockResolvedValue(false);
      jest.spyOn(service as any, 'proceedSaveRequest').mockImplementation(() => {});

      // Act
      await service.saveRequest(mockSaveRequestArg);

      // Assert
      expect(mockAddRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(4);
      expect(mockAddRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(false);
      expect(service['proceedSaveRequest']).not.toHaveBeenCalled();
    });
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
      expect(mockAddRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(6);
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

  describe('proceedSaveRequest', () => {
    it('should show confirmation when needed', () => {
      // Arrange
      jest.spyOn(validationService, 'checkCanShowConfirmationWrongOdds').mockReturnValue(true);
      jest.spyOn(popupService, 'showConfirm').mockImplementation(() => {});
      jest.spyOn(service as any, 'getMessageConfirmationWrongOdds').mockReturnValue('test message');

      // Act
      service['proceedSaveRequest'](mockSaveRequestArg);

      // Assert
      expect(popupService.showConfirm).toHaveBeenCalledWith(
        'test message',
        expect.any(Function),
        expect.any(Function)
      );
    });

    it('should execute save request directly when no confirmation needed', () => {
      // Arrange
      jest.spyOn(validationService, 'checkCanShowConfirmationWrongOdds').mockReturnValue(false);
      jest.spyOn(service as any, 'executeSaveRequestApi').mockImplementation(() => {});

      // Act
      service['proceedSaveRequest'](mockSaveRequestArg);

      // Assert
      expect(service['executeSaveRequestApi']).toHaveBeenCalledWith(mockSaveRequestArg);
    });
  });

  describe('getMessageConfirmationWrongOdds', () => {
    it('should include warning message when has warnings', () => {
      // Arrange
      const argWithWarnings = {
        ...mockSaveRequestArg,
        logInfoEvent: {
          ...mockLogInfoWrongOdds,
          messageValidationLogInfo: [{ isError: false, reason: '' }]
        }
      };

      // Act
      const result = service['getMessageConfirmationWrongOdds'](argWithWarnings);

      // Assert
      expect(result).toContain('There are some warnings in this request');
    });

    it('should include unmark message when action is TAKE_NOTE', () => {
      // Arrange
      const argWithTakeNote = {
        ...mockSaveRequestArg,
        isEdit: true,
        filter: {
          ...mockSaveRequestArg.filter,
          action: TVSRequestActionType.TAKE_NOTE_ID.toString()
        },
        actionIdOfFirstTimeAccess: 'different-action'
      };

      // Act
      const result = service['getMessageConfirmationWrongOdds'](argWithTakeNote);

      // Assert
      expect(result).toContain('Ticket(s) on request will be unmarked');
    });

    it('should include user warning when editing by another user', () => {
      // Arrange
      const argWithDifferentUser = {
        ...mockSaveRequestArg,
        isEdit: true,
        userId: 1,
        requestedBy: 'Other User'
      };
      document.getElementById = jest.fn().mockReturnValue({ getAttribute: () => '2' } as any);

      // Act
      const result = service['getMessageConfirmationWrongOdds'](argWithDifferentUser);

      // Assert
      expect(result).toContain('Please remind this request');
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
