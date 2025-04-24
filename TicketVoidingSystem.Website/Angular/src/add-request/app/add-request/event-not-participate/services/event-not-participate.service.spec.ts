import { TestBed } from '@angular/core/testing';
import { EventNotParticipateService } from './event-not-participate.service';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { NotParticipateModel } from '../../models/event-not-participate.model';
import { FilterNotParticipateModel } from '../models/filter-not-participate.model';
import { LogInfoNotParticipate } from '../models/log-info-not-participate.model';

describe('EventNotParticipateService', () => {
  let service: EventNotParticipateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [EventNotParticipateService]
    });

    service = TestBed.inject(EventNotParticipateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getNotParticipateGetLogInfoModel', () => {
    it('should return correct NotParticipateGetLogInfoQuery array', () => {
      // Arrange
      const subIssueTypeId = 1;
      const matchId = 123;
      const filterModels = [
        {
          playerId: 'player1',
          betTypeIds: ['1', '2']
        }
      ] as unknown as FilterNotParticipateModel[];

      // Act
      const result = service.getNotParticipateGetLogInfoModel(subIssueTypeId, matchId, filterModels);

      // Assert
      expect(result).toEqual([
        {
          matchId: 123,
          subIssueTypeId: 1,
          betTypeIds: '1,2',
          playerId: 'player1'
        }
      ]);
    });
  });

  describe('getNotParticipateModel', () => {
    it('should return correct NotParticipateModel array', () => {
      // Arrange
      const subIssueTypeId = 1;
      const logInfoEvent = {
        matchId: 123,
        logInfoDetail: {} as LogInfoDetail,
        filterNotParticipates: [
          {
            playerId: 'player1',
            betTypeIds: ['1', '2']
          }
        ]
      } as unknown as LogInfoNotParticipate;

      // Act
      const result = service.getNotParticipateModel(subIssueTypeId, logInfoEvent);

      // Assert
      expect(result).toEqual([
        {
          betTypeIds: '1,2',
          playerId: 'player1',
          matchId: 123,
          subIssueTypeId: 1,
          logInfoDetail: {}
        }
      ]);
    });
  });

  describe('assignModelsToEvents', () => {
    it('should return correct LogInfoNotParticipate', () => {
      // Arrange
      const inputModels = [
        {
          betTypeIds: '1,2',
          playerId: 'player1',
          matchId: 123,
          subIssueTypeId: 1,
          logInfoDetail: {} as LogInfoDetail
        }
      ] as unknown as NotParticipateModel[];

      // Act
      const result = service.assignModelsToEvents(inputModels);

      // Assert
      expect(result).toEqual({
        matchId: 123,
        logInfoDetail: {},
        filterNotParticipates: [
          {
            playerId: 'player1',
            betTypeIds: ['1', '2']
          }
        ]
      });
    });
  });
});
