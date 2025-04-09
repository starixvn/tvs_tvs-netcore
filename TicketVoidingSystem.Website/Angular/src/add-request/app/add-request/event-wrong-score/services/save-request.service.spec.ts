import { TestBed } from '@angular/core/testing';
import { SaveRequestService } from './save-request.service';
import { ValidationService } from './validation.service';
import { AddRequestService } from '../../add-request.service';
import { LogInfoService } from './log-info.service';
import { PopupService } from '../../services/popup.service';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { SaveRequestArg } from './save-request.model';
import { LABELS } from '../../../../../utility/constants/labels';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { WrongScoreModel } from '../../models/event-wrong-score.model';
import { AddRequestQuery } from '../../models/add-request.query';
import { TvDetectionType } from '../../../../../utility/constants/config';
import { ValidationBusinessRuleArgs } from './validation.model';

describe('SaveRequestService', () => {
  let service: SaveRequestService;
  let validationService: ValidationService;
  let addRequestService: AddRequestService;
  let logInfoService: LogInfoService;
  let popupService: PopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        SaveRequestService,
        {
          provide: ValidationService,
          useValue: {
            validateCommonData: jest.fn(),
            isValidAllScores: jest.fn()
          }
        },
        {
          provide: AddRequestService,
          useValue: {
            executeSaveRequest: jest.fn()
          }
        },
        {
          provide: LogInfoService,
          useValue: {
            clearDataValidation: jest.fn(),
            mapRelatedEventToWrongScoreModel: jest.fn(),
            getLogInfo: jest.fn()
          }
        },
        {
          provide: PopupService,
          useValue: {
            showError: jest.fn()
          }
        }
      ]
    });

    service = TestBed.inject(SaveRequestService);
    validationService = TestBed.inject(ValidationService);
    addRequestService = TestBed.inject(AddRequestService);
    logInfoService = TestBed.inject(LogInfoService);
    popupService = TestBed.inject(PopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('onYesConfirmAddRequest', () => {
    it('should save request directly when isVoided is true', async () => {
      // Arrange
      const args: SaveRequestArg = {
        isVoided: true,
        addRequestStore: {
          changeSavingRequestStatus: jest.fn(),
          changeBlockingUiStatus: jest.fn()
        }
      } as unknown as SaveRequestArg;

      jest.spyOn(service, 'saveRequest').mockResolvedValue();

      // Act
      await service.onYesConfirmAddRequest(args);

      // Assert
      expect(service.saveRequest).toHaveBeenCalledWith(args);
    });

    it('should save request when validation passes', async () => {
      // Arrange
      const args: SaveRequestArg = {
        isVoided: false,
        addRequestStore: {
          changeSavingRequestStatus: jest.fn(),
          changeBlockingUiStatus: jest.fn()
        }
      } as unknown as SaveRequestArg;
      service['checkValidationBeforeSaveRequest'] = jest.fn().mockResolvedValue({ isValid: true, transInfo: '' });

      jest.spyOn(service, 'saveRequest').mockResolvedValue();

      // Act
      await service.onYesConfirmAddRequest(args);

      // Assert
      expect(service.saveRequest).toHaveBeenCalledWith(args);
    });

    it('should show error when validation fails', async () => {
      // Arrange
      const args: SaveRequestArg = {
        isVoided: false,
        addRequestStore: {
          changeSavingRequestStatus: jest.fn(),
          changeBlockingUiStatus: jest.fn()
        }
      } as unknown as SaveRequestArg;
      service['checkValidationBeforeSaveRequest'] = jest.fn().mockResolvedValue({ isValid: false, transInfo: '' });

      // Act
      await service.onYesConfirmAddRequest(args);

      // Assert
      expect(popupService.showError).toHaveBeenCalledWith('There are some invalid in this request, please check again!');
      expect(args.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(false);
    });
  });

  describe('saveRequest', () => {
    it('should execute save request with correct parameters', async () => {
      // Arrange
      const mockWrongScoreModel = {
        matchId: 1,
        actualScore: '1-0',
        filterBy: 1,
        subIssueTypeId: 1,
        isCheckedVar: false,
        tvDetectionValue: TvDetectionType.NONE,
        isMainMatch: true
      } as WrongScoreModel;

      const args: SaveRequestArg = {
        isEdit: false,
        requestId: 123,
        addRequestStore: {
          changeBlockingUiStatus: jest.fn()
        },
        filter: {
          issueTypeId: 1,
          subIssueTypeId: '2',
          action: '3',
          isTest: true,
          isVoided: false
        },
        others: {
          mistakenBy: 1,
          decidedBy: 2,
          operatorsList: [1, 2],
          provider: 'provider',
          source: 'source',
          remark: 'remark'
        },
        primitiveProps: {
          transInfoAddRequestModel: {
            transInfoJson: 'json',
            unMarkTransIds: [1],
            markTransIds: [2]
          },
          actualScore: '1-0',
          isCheckedVar: false
        },
        allSelectedEvents: [],
        wrongScoreModels: [mockWrongScoreModel],
        leagueEventWrongScoreComponent: {
          selectedMatch: { matchId: 1 }
        },
        tvDetectionComponent: {
          tvDetectionValue: TvDetectionType.NONE
        },
        tvDetectionModel: {
          tvDetectionValue: TvDetectionType.NONE,
          serviceAcceptTime: new Date(),
          actualTime: new Date()
        }
      } as unknown as SaveRequestArg;

      // Act
      await service.saveRequest(args);

      // Assert
      expect(args.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(addRequestService.executeSaveRequest).toHaveBeenCalledWith(
        args.isEdit,
        args.requestId,
        expect.any(AddRequestQuery),
        args.addRequestStore
      );
      expect(args.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    });
  });

  describe('checkValidationBeforeSaveRequest', () => {
    it('should return invalid when validateCommonData returns false', async () => {
      // Arrange
      const args: ValidationBusinessRuleArgs = {
        addRequestStore: {
          changeSavingRequestStatus: jest.fn(),
          changeBlockingUiStatus: jest.fn()
        },
        filter: {},
        leagueEventWrongScoreComponent: {},
        filterWrongScoreComponent: {},
        wrongScoreInfoComponents: [],
        tvDetectionComponent: {}
      } as unknown as ValidationBusinessRuleArgs;

      (validationService.validateCommonData as jest.Mock).mockReturnValue(false);

      // Act
      const result = await service.checkValidationBeforeSaveRequest(args);

      // Assert
      expect(result.isValid).toBeFalsy();
    });

    it('should return invalid when actualScore is missing', async () => {
      // Arrange
      const args: ValidationBusinessRuleArgs = {
        addRequestStore: {
          changeSavingRequestStatus: jest.fn(),
          changeBlockingUiStatus: jest.fn()
        },
        filter: {},
        leagueEventWrongScoreComponent: {},
        filterWrongScoreComponent: {},
        wrongScoreInfoComponents: [],
        tvDetectionComponent: {},
        primitiveProps: {
          actualScore: null
        },
        tooltip: {
          display: jest.fn()
        }
      } as unknown as ValidationBusinessRuleArgs;

      (validationService.validateCommonData as jest.Mock).mockReturnValue(true);

      // Act
      const result = await service.checkValidationBeforeSaveRequest(args);

      // Assert
      expect(result.isValid).toBeFalsy();
      expect(args.tooltip.display).toHaveBeenCalledWith('input-actual-score', LABELS.REQUIRED_ACTUAL_SCORE);
    });

    it('should return invalid when isValidAllScores returns false', async () => {
      // Arrange
      const mockWrongScoreModel = {
        matchId: 1,
        actualScore: '1-0',
        filterBy: 1,
        subIssueTypeId: 1,
        isCheckedVar: false,
        tvDetectionValue: TvDetectionType.NONE,
        isMainMatch: true
      } as WrongScoreModel;

      const args: ValidationBusinessRuleArgs = {
        addRequestStore: {
          changeSavingRequestStatus: jest.fn(),
          changeBlockingUiStatus: jest.fn()
        },
        filter: {},
        leagueEventWrongScoreComponent: {},
        filterWrongScoreComponent: {},
        wrongScoreInfoComponents: [],
        tvDetectionComponent: {},
        primitiveProps: {
          actualScore: '1-0'
        },
        wrongScoreModels: [mockWrongScoreModel],
        allSelectedEvents: [],
        defaultFilterTimeWithAllowance: new FilterTimeWithAllowance(),
        isEdit: false,
        requestId: 123
      } as unknown as ValidationBusinessRuleArgs;

      (validationService.validateCommonData as jest.Mock).mockReturnValue(true);
      (validationService.isValidAllScores as jest.Mock).mockReturnValue(false);
      (logInfoService.mapRelatedEventToWrongScoreModel as jest.Mock).mockReturnValue(mockWrongScoreModel);

      // Act
      const result = await service.checkValidationBeforeSaveRequest(args);

      // Assert
      expect(result.isValid).toBeFalsy();
    });

    it('should return valid when all validations pass', async () => {
      // Arrange
      const mockWrongScoreModel = {
        matchId: 1,
        actualScore: '1-0',
        filterBy: 1,
        subIssueTypeId: 1,
        isCheckedVar: false,
        tvDetectionValue: TvDetectionType.NONE,
        isMainMatch: true
      } as WrongScoreModel;

      const args: ValidationBusinessRuleArgs = {
        addRequestStore: {
          changeSavingRequestStatus: jest.fn(),
          changeBlockingUiStatus: jest.fn()
        },
        filter: {},
        leagueEventWrongScoreComponent: {},
        filterWrongScoreComponent: {},
        wrongScoreInfoComponents: [],
        tvDetectionComponent: {},
        primitiveProps: {
          actualScore: '1-0'
        },
        wrongScoreModels: [mockWrongScoreModel],
        allSelectedEvents: [],
        defaultFilterTimeWithAllowance: new FilterTimeWithAllowance(),
        isEdit: false,
        requestId: 123
      } as unknown as ValidationBusinessRuleArgs;

      (validationService.validateCommonData as jest.Mock).mockReturnValue(true);
      (validationService.isValidAllScores as jest.Mock).mockReturnValue(true);
      (logInfoService.mapRelatedEventToWrongScoreModel as jest.Mock).mockReturnValue(mockWrongScoreModel);

      // Act
      const result = await service.checkValidationBeforeSaveRequest(args);

      // Assert
      expect(result.isValid).toBeTruthy();
      expect(result.transInfo).toBe('');
    });

    it('should update wrongScoreModels with related events', async () => {
      // Arrange
      const mockWrongScoreModel = {
        matchId: 1,
        actualScore: '1-0',
        filterBy: 1,
        subIssueTypeId: 1,
        isCheckedVar: false,
        tvDetectionValue: TvDetectionType.NONE,
        isMainMatch: true
      } as WrongScoreModel;

      const args: ValidationBusinessRuleArgs = {
        addRequestStore: {
          changeSavingRequestStatus: jest.fn(),
          changeBlockingUiStatus: jest.fn()
        },
        filter: {
          subIssueTypeId: '1'
        },
        leagueEventWrongScoreComponent: {
          selectedMatch: { matchId: 1 }
        },
        filterWrongScoreComponent: {},
        wrongScoreInfoComponents: [],
        tvDetectionComponent: {},
        primitiveProps: {
          actualScore: '1-0',
          filterBy: 1,
          isCheckedVar: false
        },
        wrongScoreModels: [mockWrongScoreModel],
        allSelectedEvents: [],
        defaultFilterTimeWithAllowance: new FilterTimeWithAllowance(),
        tvDetectionModel: {
          tvDetectionValue: TvDetectionType.NONE
        }
      } as unknown as ValidationBusinessRuleArgs;

      (validationService.validateCommonData as jest.Mock).mockReturnValue(true);
      (validationService.isValidAllScores as jest.Mock).mockReturnValue(true);
      (logInfoService.mapRelatedEventToWrongScoreModel as jest.Mock).mockReturnValue(mockWrongScoreModel);

      // Act
      const result = await service.checkValidationBeforeSaveRequest(args);

      // Assert
      expect(result.isValid).toBeTruthy();
      expect(args.wrongScoreModels).toContain(mockWrongScoreModel);
    });
  });
});
