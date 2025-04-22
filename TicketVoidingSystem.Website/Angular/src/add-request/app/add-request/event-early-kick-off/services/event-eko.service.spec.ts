import { TestBed } from '@angular/core/testing';
import { EventEarlyKickOffService } from './event-eko.service';
import { AddRequestApiService } from '../../add-request-api.service';
import { EarlyKickOffModel } from '../../models/event-eko.model';
import { LogInfoEarlyKickOff } from '../models/log-info-eko.model';
import { FilterModel } from '../../filter/filter.model';
import { PagingConstant } from '../../../../../utility/components/paging/paging/paging.model';

class Helper {
  static readonly fakeMatchId = 12345;
  static readonly fakeKickOffTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeEarlyKickOffModel = {
    matchId: 122,
    matchCode: 'TEST123',
    leagueName: 'Test League',
    name: 'Test Event',
    isMainMatch: true,
    kickOffTime: Helper.fakeKickOffTime,
    match: {},
    sportType: 1
  } as EarlyKickOffModel;

  static readonly fakeFilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '11',
    action: '1',
    isTest: true,
    isVoided: false
  } as FilterModel;
}

describe('EventEarlyKickOffService', () => {
  let service: EventEarlyKickOffService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EventEarlyKickOffService,
        { provide: AddRequestApiService, useValue: {
          getLinkedLogs: jest.fn()
        } }
      ]
    });

    service = TestBed.inject(EventEarlyKickOffService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('assignModelsToEvents', () => {
    it('should assign models to events correctly', () => {
      // Arrange
      const allEvents: LogInfoEarlyKickOff[] = [];
      const inputModels = [Helper.fakeEarlyKickOffModel];

      // Act
      service.assignModelsToEvents(allEvents, inputModels, Helper.fakeFilterModel);

      // Assert
      expect(allEvents.length).toBe(1);
      expect(allEvents[0].matchId).toBe(Helper.fakeEarlyKickOffModel.matchId);
      expect(allEvents[0].matchCode).toBe(Helper.fakeEarlyKickOffModel.matchCode);
      expect(allEvents[0].leagueName).toBe(Helper.fakeEarlyKickOffModel.leagueName);
      expect(allEvents[0].isMainMatch).toBe(Helper.fakeEarlyKickOffModel.isMainMatch);
      expect(allEvents[0].eventName).toBe(Helper.fakeEarlyKickOffModel.name);
      expect(allEvents[0].kickOffTime).toBe(Helper.fakeEarlyKickOffModel.kickOffTime);
      expect(allEvents[0].matchModel).toBe(Helper.fakeEarlyKickOffModel.match);
      expect(allEvents[0].sportType).toBe(Helper.fakeEarlyKickOffModel.sportType);
      expect(allEvents[0].pagingModel.pageSize).toBe(PagingConstant.SIZE_ONE);
      expect(allEvents[0].isCollapse).toBe(Helper.fakeFilterModel.isVoided || !Helper.fakeEarlyKickOffModel.isMainMatch);
    });
  });

  describe('initDefaultMainEvent', () => {
    it('should initialize default main event with correct values', () => {
      // Arrange
      const allSelectedEvents: LogInfoEarlyKickOff[] = [];

      // Act
      const result = service.initDefaultMainEvent(allSelectedEvents);

      // Assert
      expect(result).toBeDefined();
      expect(result.isMainMatch).toBe(true);
      expect(result.isShowValidation).toBe(false);
      expect(result.tableTicketsModel).toBeDefined();
      expect(result.pagingModel.pageSize).toBe(PagingConstant.SIZE_ONE);
      expect(result.isCollapse).toBe(true);
      expect(result.kickOffTime).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}/);
      expect(allSelectedEvents.length).toBe(1);
      expect(allSelectedEvents[0]).toBe(result);
    });
  });

  describe('getEarlyKickOffModel', () => {
    it('should get early kick off model with correct values', () => {
      // Arrange
      const events: LogInfoEarlyKickOff[] = [{
        matchId: 123,
        isMainMatch: true,
        kickOffTime: Helper.fakeKickOffTime
      } as LogInfoEarlyKickOff];

      // Act
      const result = service.getEarlyKickOffModel(Helper.fakeFilterModel, events);

      // Assert
      expect(result.length).toBe(1);
      expect(result[0].matchId).toBe(123);
      expect(result[0].subIssueTypeId).toBe(Number(Helper.fakeFilterModel.subIssueTypeId));
      expect(result[0].kickOffTime).toBe(Helper.fakeKickOffTime);
      expect(result[0].isMainMatch).toBe(true);
    });
  });
});
