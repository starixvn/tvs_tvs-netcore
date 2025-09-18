import { TestBed } from '@angular/core/testing';
import { BetTeamAddRequestResult } from '../../../../../../utility/components/advanced-mode-add-request/advanced-mode/advanced-mode.model';
import { LogInfoDetail } from '../../../../../../utility/models/log-info-detail.model';
import { Selection } from '../../../../../../utility/models/selection.model';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { TechnicalErrorModel } from '../../../../../models/event-technical-error.model';
import { BetTypeCountModel } from '../../../../../models/get-log-info.model';
import { FilterTechnicalErrorModel } from '../models/filter-technical-error.model';
import { LogInfoTechnicalError } from '../models/log-info-technical-error.model';
import { EventTechnicalErrorService } from './event-technical-error.service';

describe('EventTechnicalErrorService', () => {
  let service: EventTechnicalErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [EventTechnicalErrorService]
    });

    service = TestBed.inject(EventTechnicalErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTechnicalErrorGetLogInfoModel', () => {
    it('should create TechnicalErrorGetLogInfoQuery with correct values', () => {
      // Arrange
      const subIssueTypeId = 123;
      const logInfo = new LogInfoTechnicalError();
      logInfo.matchId = 123;
      logInfo.filterTechnicalErrorModel = new FilterTechnicalErrorModel();
      logInfo.filterTechnicalErrorModel.fromDateTime = '2024-01-01';
      logInfo.filterTechnicalErrorModel.toDateTime = '2024-01-02';
      logInfo.betTeamsResult = [] as BetTeamAddRequestResult[];

      // Act
      const result = service.getTechnicalErrorGetLogInfoModel(subIssueTypeId, logInfo);

      // Assert
      expect(result).toEqual({
        matchId: 123,
        subIssueTypeId: 123,
        filterFromTransTime: '2024-01-01',
        filterToTransTime: '2024-01-02',
        betTeamsResult: []
      });
    });
  });

  describe('getTechnicalErrorModel', () => {
    it('should create TechnicalErrorModel with correct values', () => {
      // Arrange
      const subIssueTypeId = 123;
      const logInfoEvent = new LogInfoTechnicalError();
      logInfoEvent.filterTechnicalErrorModel = new FilterTechnicalErrorModel();
      logInfoEvent.filterTechnicalErrorModel.fromDateTime = '2024-01-01';
      logInfoEvent.filterTechnicalErrorModel.toDateTime = '2024-01-02';
      logInfoEvent.matchId = 123;
      logInfoEvent.logInfoDetail = new LogInfoDetail();
      logInfoEvent.betTeamsResult = [] as BetTeamAddRequestResult[];
      logInfoEvent.betTypeCount = [] as BetTypeCountModel[];
      logInfoEvent.allBetTypesSelection = [] as Selection[];

      // Act
      const result = service.getTechnicalErrorModel(subIssueTypeId, logInfoEvent);

      // Assert
      expect(result).toEqual({
        filterFromTransTime: '2024-01-01',
        filterToTransTime: '2024-01-02',
        matchId: 123,
        subIssueTypeId: 123,
        logInfoDetail: new LogInfoDetail(),
        betTeamsResult: [],
        betTypeCount: [],
        allBetTypesSelection: []
      });
    });
  });

  describe('assignModelsToEvents', () => {
    it('should create LogInfoTechnicalError with correct values', () => {
      // Arrange
      const inputModel = new TechnicalErrorModel();
      inputModel.matchId = 123;
      inputModel.logInfoDetail = new LogInfoDetail();
      inputModel.filterFromTransTime = '2024-01-01';
      inputModel.filterToTransTime = '2024-01-02';
      inputModel.betTypeCount = [] as BetTypeCountModel[];
      inputModel.betTeamsResult = [] as BetTeamAddRequestResult[];
      inputModel.allBetTypesSelection = [] as Selection[];

      // Act
      const result = service.assignModelsToEvents(inputModel);

      // Assert
      expect(result).toEqual({
        matchId: 123,
        logInfoDetail: new LogInfoDetail(),
        filterTechnicalErrorModel: {
          fromDateTime: '2024-01-01',
          toDateTime: '2024-01-02'
        },
        betTypeCount: [],
        betTeamsResult: [],
        allBetTypesSelection: []
      });
    });
  });
});
