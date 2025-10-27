import { TestBed } from '@angular/core/testing';
import { TVSRequestFilterBy } from '../../../../../../utility/constants/config';
import { TEXT } from '../../../../../../utility/constants/text';
import { LogInfoDetail } from '../../../../../../utility/models/log-info-detail.model';
import { WrongScoreModel } from '../../../../../models/event-wrong-score.model';
import { AddRequestService } from '../../../../../services/add-request.service';
import { PopupService } from '../../../../../services/popup.service';
import { CreateMapService } from './create-map.service';
import { LogInfoService } from './log-info.service';
import { SaveRequestService } from './save-request.service';
import { ValidationService } from './validation.service';

describe('SaveRequestService', () => {
  let service: SaveRequestService;
  let validationService: ValidationService;
  let addRequestService: AddRequestService;
  let popupService: PopupService;
  let createMapService: CreateMapService;

  const mockAddRequestStore = {
    changeSavingRequestStatus: jest.fn(),
    changeBlockingUiStatus: jest.fn()
  };

  const mockTooltip = {
    display: jest.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SaveRequestService,
        {
          provide: ValidationService,
          useValue: {
            validateCommonData: jest.fn(),
            isAllWrongScoreModelsValid: jest.fn()
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
            getLogInfo: jest.fn()
          }
        },
        {
          provide: PopupService,
          useValue: {
            showError: jest.fn()
          }
        },
        {
          provide: CreateMapService,
          useValue: {
            createGetLogInfoParams: jest.fn(),
            mapRelatedEventToWrongScoreModel: jest.fn(),
            mapWrongScoreSaveRequestModel: jest.fn()
          }
        }
      ]
    });

    service = TestBed.inject(SaveRequestService);
    validationService = TestBed.inject(ValidationService);
    addRequestService = TestBed.inject(AddRequestService);
    popupService = TestBed.inject(PopupService);
    createMapService = TestBed.inject(CreateMapService);
  });

  describe('onYesConfirmAddRequest', () => {
    it('should save request when validation is valid', async () => {
      const args = {
        isVoided: false,
        addRequestStore: mockAddRequestStore,
        primitiveProps: { actualScore: '1-0' },
        filter: {issueType: 3, subIssueTypeId: '4',
        filterBy: TVSRequestFilterBy.CHECK_TIME},
        others: {},
        wrongScoreModels: [],
        relatedEvents: []
      };
      (validationService.validateCommonData as jest.Mock).mockReturnValue(true);
      (validationService.isAllWrongScoreModelsValid as jest.Mock).mockReturnValue(true);
      (addRequestService.executeSaveRequest as jest.Mock).mockResolvedValue(undefined);

      await service.onYesConfirmAddRequest(args as any);

      expect(addRequestService.executeSaveRequest).toHaveBeenCalled();
    });
  });

  describe('checkValidationBeforeSaveRequest', () => {
    it('should return invalid when common data validation fails', async () => {
      const args = {
        addRequestStore: mockAddRequestStore,
        filter: {},
        leagueEventWrongScoreComponent: {},
        filterWrongScoreComponent: {},
        wrongScoreInfoComponents: [],
        tvDetectionComponent: {}
      };
      (validationService.validateCommonData as jest.Mock).mockReturnValue(false);

      const result = await service.checkValidationBeforeSaveRequest(args as any);

      expect(result.isValid).toBeFalsy();
    });

    it('should return invalid when actual score is missing', async () => {
      const args = {
        addRequestStore: mockAddRequestStore,
        filter: {},
        leagueEventWrongScoreComponent: {},
        filterWrongScoreComponent: {},
        wrongScoreInfoComponents: [],
        tvDetectionComponent: {},
        primitiveProps: { actualScore: null },
        tooltip: mockTooltip
      };
      (validationService.validateCommonData as jest.Mock).mockReturnValue(true);

      const result = await service.checkValidationBeforeSaveRequest(args as any);

      expect(result.isValid).toBeFalsy();
      expect(mockTooltip.display).toHaveBeenCalledWith('input-actual-score', TEXT.REQUIRED_ACTUAL_SCORE);
    });
  });

  describe('getWrongScoresHasRelatedEvent', () => {
    it('should map related events to wrong score models', () => {
      const args = {
        mainEvent: { id: 1 },
        relatedEvents: [{ id: 2 }]
      };
      const mockWrongScoreModel = new WrongScoreModel();
      mockWrongScoreModel.matchId = 1;
      mockWrongScoreModel.actualScore = '1-0';
      mockWrongScoreModel.filterBy = TVSRequestFilterBy.CHECK_TIME;
      mockWrongScoreModel.subIssueTypeId = 1;
      mockWrongScoreModel.isCheckedVar = false;
      mockWrongScoreModel.tvDetectionValue = 0;
      mockWrongScoreModel.isMainMatch = true;
      mockWrongScoreModel.logInfoDetail = new LogInfoDetail();

      (createMapService.mapRelatedEventToWrongScoreModel as jest.Mock).mockReturnValue(mockWrongScoreModel);

      const result = service.getWrongScoresHasRelatedEvent(args as any);

      expect(result.length).toBe(2);
      expect(createMapService.mapRelatedEventToWrongScoreModel).toHaveBeenCalledTimes(2);
    });
  });

  describe('getWrongScoresHasManyScores', () => {
    it('should map wrong score models with log info', () => {
      const args = {
        wrongScoreModels: [
          { logInfoDetail: new LogInfoDetail() },
          { logInfoDetail: null }
        ]
      };
      const mockWrongScoreModel = new WrongScoreModel();
      mockWrongScoreModel.matchId = 1;
      mockWrongScoreModel.actualScore = '1-0';
      mockWrongScoreModel.filterBy = TVSRequestFilterBy.CHECK_TIME;
      mockWrongScoreModel.subIssueTypeId = 1;
      mockWrongScoreModel.isCheckedVar = false;
      mockWrongScoreModel.tvDetectionValue = 0;
      mockWrongScoreModel.isMainMatch = true;
      mockWrongScoreModel.logInfoDetail = new LogInfoDetail();

      (createMapService.mapWrongScoreSaveRequestModel as jest.Mock).mockReturnValue(mockWrongScoreModel);

      const result = service.getWrongScoresHasManyScores(args as any);

      expect(result.length).toBe(1);
      expect(createMapService.mapWrongScoreSaveRequestModel).toHaveBeenCalledTimes(1);
    });
  });
});
