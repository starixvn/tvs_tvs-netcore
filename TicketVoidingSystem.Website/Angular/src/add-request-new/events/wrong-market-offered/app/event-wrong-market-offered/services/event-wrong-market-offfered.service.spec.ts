import { TestBed } from '@angular/core/testing';
import { EventWrongMarketOfferedService } from './event-wrong-market-offfered.service';
import { LogInfoDetail } from '../../../../../../utility/models/log-info-detail.model';
import { LogInfoItem, LogInfoWrongMarketOffered } from '../models/log-info-wrong-market-offered.model';
import { FilterWrongMarketOfferedModel } from '../models/filter-wrong-market-offered.model';
import { BetTeamAddRequestResult } from '../../../../../../utility/components/advanced-mode-add-request/advanced-mode/advanced-mode.model';
import { Selection } from '../../../../../../utility/models/selection.model';
import { BetTypeCountModel } from '../../../../../models/get-log-info.model';
import { WrongMarketOfferedGetLogInfoQuery } from '../models/get-log-info.query';
import { WrongMarketOfferedModel } from '../../../../../models/event-wrong-market-offered.model';

class Helper {
  static readonly fakeMatchId = 123;
  static readonly fakeFromDateTime = '2024-01-01T00:00:00';
  static readonly fakeToDateTime = '2024-01-02T00:00:00';

  static readonly fakeBetTeamResult = {
    id: '1',
    team: 'Team A',
    hdp: '1.5'
  } as BetTeamAddRequestResult;

  static readonly fakeSelection = {
    name: 'Selection 1',
    value: '1'
  } as Selection;

  static readonly fakeBetTypeCount = {
    betTypeName: 'Bet Type 1',
    ticketsCount: 1,
    betTypeId: 1
  } as BetTypeCountModel;

  static readonly fakeLogInfoDetail = {
    matchId: Helper.fakeMatchId,
    liveScores: '1-0',
    singleCount: 1,
    cashOutCount: 1
  } as LogInfoDetail;

  static readonly fakeWrongMarketOfferedModel = {
    id: 1,
    matchId: Helper.fakeMatchId,
    subIssueTypeId: 1,
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeToDateTime,
    logInfoDetail: Helper.fakeLogInfoDetail,
    betTeamsResult: [Helper.fakeBetTeamResult],
    betTypeCount: [Helper.fakeBetTypeCount],
    allBetTypesSelection: [Helper.fakeSelection]
  } as WrongMarketOfferedModel;

  static readonly fakeFilterWrongMarketOfferedModel = {
    id: 1,
    fromDateTime: Helper.fakeFromDateTime,
    toDateTime: Helper.fakeToDateTime
  } as FilterWrongMarketOfferedModel;

  static readonly fakeLogInfoItem = {
    id: 1,
    filterTime: Helper.fakeFilterWrongMarketOfferedModel,
    logInfoDetail: Helper.fakeLogInfoDetail,
    betTypeCount: [Helper.fakeBetTypeCount]
  } as LogInfoItem;

  static readonly fakeLogInfoWrongMarketOffered = {
    matchId: Helper.fakeMatchId,
    filterWrongMarketOfferedModels: [Helper.fakeFilterWrongMarketOfferedModel],
    logInfoItems: [Helper.fakeLogInfoItem],
    betTeamsResult: [Helper.fakeBetTeamResult],
    allBetTypesSelection: [Helper.fakeSelection]
  } as LogInfoWrongMarketOffered;

  static readonly fakeGetLogInfoQuery = {
    id: 1,
    matchId: Helper.fakeMatchId,
    subIssueTypeId: 1,
    betTeamsResult: [Helper.fakeBetTeamResult],
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeToDateTime
  } as WrongMarketOfferedGetLogInfoQuery;
}

describe('EventWrongMarketOfferedService', () => {
  let service: EventWrongMarketOfferedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventWrongMarketOfferedService]
    });
    service = TestBed.inject(EventWrongMarketOfferedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initDefaultTime', () => {
    it('should return default time model', () => {
      const result = service.initDefaultTime();
      expect(result).toBeTruthy();
      expect(result.fromDateTime).toBeTruthy();
      expect(result.toDateTime).toBeTruthy();
    });

    it('should return default time model with id', () => {
      const id = 1;
      const result = service.initDefaultTime(id);
      expect(result).toBeTruthy();
      expect(result.id).toBe(id);
      expect(result.fromDateTime).toBeTruthy();
      expect(result.toDateTime).toBeTruthy();
    });
  });

  describe('initRangeTimeByInputTime', () => {
    it('should return range time model', () => {
      const result = service.initRangeTimeByInputTime(Helper.fakeFromDateTime);
      expect(result).toBeTruthy();
      expect(result.fromDateTime).toBeTruthy();
      expect(result.toDateTime).toBeTruthy();
    });
  });

  describe('getWrongMarketOfferedGetLogInfoModel', () => {
    it('should return wrong market offered get log info model', () => {
      const result = service.getWrongMarketOfferedGetLogInfoModel(1, Helper.fakeLogInfoWrongMarketOffered);
      expect(result).toBeTruthy();
      expect(result[0]).toEqual(Helper.fakeGetLogInfoQuery);
    });
  });

  describe('getWrongMarketOfferedModel', () => {
    it('should return wrong market offered model', () => {
      const result = service.getWrongMarketOfferedModel(1, Helper.fakeLogInfoWrongMarketOffered);
      expect(result).toBeTruthy();
      expect(result.length).toBe(1);
      expect(result[0].matchId).toBe(Helper.fakeMatchId);
    });
  });

  describe('assignModelsToEvents', () => {
    it('should assign models to events', () => {
      const result = service.assignModelsToEvents([Helper.fakeWrongMarketOfferedModel]);
      expect(result).toBeTruthy();
      expect(result.logInfoItems).toBeTruthy();
      expect(result.logInfoItems[0].logInfoDetail).toBeTruthy();
      expect(result.logInfoItems[0].betTypeCount).toBeTruthy();
    });
  });

  describe('getExtraWarningModel', () => {
    it('should return extra warning model when logInfoItems have no logInfoDetail', () => {
      const logInfoItems = [{
        id: 1,
        filterTime: Helper.fakeFilterWrongMarketOfferedModel,
        logInfoDetail: null,
        betTypeCount: [Helper.fakeBetTypeCount]
      } as LogInfoItem];
      
      const result = service.getExtraWarningModel(logInfoItems);
      expect(result).toBeTruthy();
      expect(result.title).toBeTruthy();
      expect(result.messages).toBeTruthy();
    });

    it('should return null when all logInfoItems have logInfoDetail', () => {
      const result = service.getExtraWarningModel(Helper.fakeLogInfoWrongMarketOffered.logInfoItems);
      expect(result).toBeNull();
    });
  });
});
