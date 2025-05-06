import { TestBed } from '@angular/core/testing';
import { EventReducedOverService } from './event-reduced-over.service';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { StaticService } from '../../../../../utility/services/static.service';
import { ReducedOverModel } from '../../models/event-reduced-over.model';
import { FilterReducedOverModel } from '../models/filter-reduced-over.model';
import { LogInfoReducedOver } from '../models/log-info-reduced-over.model';

describe('EventReducedOverService', () => {
  let service: EventReducedOverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [EventReducedOverService]
    });

    service = TestBed.inject(EventReducedOverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getReducedOverGetLogInfoModel', () => {
    it('should return correct ReducedOverGetLogInfoQuery array', () => {
      // Arrange
      const subIssueTypeId = 1;
      const matchId = 123;
      const filterModels = [{
        betTypeIds: ['1', '2'],
        wicketOver: '1.5',
        playerIds: ['101', '102'],
        runs: '10',
        nonLive: true,
        live: false
      }] as FilterReducedOverModel[];

      // Act
      const result = service.getReducedOverGetLogInfoModel(subIssueTypeId, matchId, filterModels);

      // Assert
      expect(result.length).toBe(1);
      expect(result[0].matchId).toBe(matchId);
      expect(result[0].subIssueTypeId).toBe(subIssueTypeId);
      expect(result[0].betTypeIds).toBe('1,2');
      expect(result[0].wicketOver).toBe('1.5');
      expect(result[0].filterWicketOver).toBe(StaticService.convertStringToBetId8xxx('1.5'));
      expect(result[0].playerIds).toBe('101,102');
      expect(result[0].runs).toBe('10');
      expect(result[0].nonLive).toBe(true);
      expect(result[0].live).toBe(false);
    });
  });

  describe('getReducedOverModel', () => {
    it('should return correct ReducedOverModel array', () => {
      // Arrange
      const subIssueTypeId = 1;
      const matchId = 123;
      const logInfoDetail = new LogInfoDetail();
      const logInfoEvent = {
        matchId: matchId,
        logInfoDetail: logInfoDetail,
        filterReducedOvers: [{
          betTypeIds: ['1', '2'],
          wicketOver: '1.5',
          playerIds: ['101', '102'],
          runs: '10',
          nonLive: true,
          live: false
        }]
      } as LogInfoReducedOver;

      // Act
      const result = service.getReducedOverModel(subIssueTypeId, logInfoEvent);

      // Assert
      expect(result.length).toBe(1);
      expect(result[0].matchId).toBe(matchId);
      expect(result[0].subIssueTypeId).toBe(subIssueTypeId);
      expect(result[0].betTypeIds).toBe('1,2');
      expect(result[0].wicketOver).toBe('1.5');
      expect(result[0].filterWicketOver).toBe(StaticService.convertStringToBetId8xxx('1.5'));
      expect(result[0].playerIds).toBe('101,102');
      expect(result[0].runs).toBe('10');
      expect(result[0].nonLive).toBe(true);
      expect(result[0].live).toBe(false);
      expect(result[0].logInfoDetail).toBe(logInfoDetail);
    });
  });

  describe('assignModelsToEvents', () => {
    it('should return correct LogInfoReducedOver', () => {
      // Arrange
      const logInfoDetail = new LogInfoDetail();
      const inputModels: ReducedOverModel[] = [{
        matchId: 123,
        subIssueTypeId: 1,
        betTypeIds: '1,2',
        wicketOver: '1.5',
        filterWicketOver: StaticService.convertStringToBetId8xxx('1.5'),
        playerIds: '101,102',
        runs: '10',
        nonLive: true,
        live: false,
        logInfoDetail: logInfoDetail
      }];

      // Act
      const result = service.assignModelsToEvents(inputModels);

      // Assert
      expect(result.matchId).toBe(123);
      expect(result.logInfoDetail).toBe(logInfoDetail);
      expect(result.filterReducedOvers.length).toBe(1);
      expect(result.filterReducedOvers[0].betTypeIds).toEqual(['1', '2']);
      expect(result.filterReducedOvers[0].wicketOver).toBe('1.5');
      expect(result.filterReducedOvers[0].playerIds).toEqual(['101', '102']);
      expect(result.filterReducedOvers[0].runs).toBe('10');
      expect(result.filterReducedOvers[0].nonLive).toBe(true);
      expect(result.filterReducedOvers[0].live).toBe(false);
    });
  });
});
