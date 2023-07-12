import * as _ from 'lodash';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { CommonService } from '../../../../../utility/services/common.service';
import { FilterModel } from '../../filter/filter.model';
import { RedCardGetLogInfoQuery } from '../../models/event-red-card.model';
import { GetLogInfoModel, GetLogInfoViewModel } from '../../models/get-log-info.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { ReducedOverBetType } from '../models/bet-type-reduced-over-json.model';
import { LogInfoReducedOver } from '../models/log-info-reduced-over.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';
import { EventReducedOverService } from './event-reduced-over.service';
import { LogInfoService } from './log-info.service';

class Helper {
  static readonly fakeReducedOverBetTypes: ReducedOverBetType[] = [
    {
      betTypeId: 1,
      betTypeName: '',
      isHasOverWicket: true,
      isHasPlayer: true,
      isHasRuns: true,
      parentId: 0,
      items: []
    },
    {
      betTypeId: 2,
      betTypeName: '',
      isHasOverWicket: true,
      isHasPlayer: true,
      isHasRuns: true,
      parentId: 0,
      items: []
    }
  ];
  static readonly fakeLogInfoReducedOver: LogInfoReducedOver = {
    matchId: 1,
    filterReducedOvers: [],
    logInfoDetail: new LogInfoDetail(),
    messageValidationLogInfo: []
  };

  static readonly fakeGetLogInfoModel: GetLogInfoModel = {
    matchId: 1,
    validation: {
      isInvalidTotalTickets: true,
      isExistedInOtherRequest: true,
      isPoolHouseAffected: false
    },
    ticketRequest: [],
    logInfoDetail: new LogInfoDetail()
  };
  static readonly fakeGetLogInfoViewModel: GetLogInfoViewModel = {
    transInfoAddRequestModel: new TransInfoAddRequestModel(),
    getLogInfoModels: [Helper.fakeGetLogInfoModel],
  };
}

describe('LogInfoService', () => {
  let service: LogInfoService;

  beforeEach(() => {
    service = new LogInfoService(null, null);
  });

  it('#resetLogInfoOfEvent should update logInfoDetail to null', async () => {
    const logInfo = _.cloneDeep(Helper.fakeLogInfoReducedOver);
    service.resetLogInfoOfEvent(logInfo);

    expect(logInfo.logInfoDetail).toBe(null);
    expect(logInfo.messageValidationLogInfo).toBe(null);
  });

  it('#getLogInfo should call #eventReducedOverService.getReducedOverGetLogInfoModel', async () => {
    const eventWrongOddsService = new EventReducedOverService();
    eventWrongOddsService.getReducedOverGetLogInfoModel = jest.fn().mockReturnValue(new RedCardGetLogInfoQuery());
    const commonService = new CommonService(null);
    commonService.getLogInfo = jest.fn().mockReturnValue(Helper.fakeGetLogInfoViewModel);

    const mockService = new LogInfoService(commonService, eventWrongOddsService);
    await mockService.getLogInfo(Helper.fakeLogInfoReducedOver, false, 1, new FilterModel(), new PrimitivePropertyEvent());

    expect(eventWrongOddsService.getReducedOverGetLogInfoModel).toHaveBeenCalledTimes(1);
    expect(commonService.getLogInfo).toHaveBeenCalledTimes(1);
  });

  it('#getLogInfo should call #eventReducedOverService.getReducedOverGetLogInfoModel when isEdit', async () => {
    const eventWrongOddsService = new EventReducedOverService();
    eventWrongOddsService.getReducedOverGetLogInfoModel = jest.fn().mockReturnValue(new RedCardGetLogInfoQuery());
    const commonService = new CommonService(null);
    commonService.getLogInfo = jest.fn().mockReturnValue(Helper.fakeGetLogInfoViewModel);

    const mockService = new LogInfoService(commonService, eventWrongOddsService);
    await mockService.getLogInfo(Helper.fakeLogInfoReducedOver, true, 1, new FilterModel(), new PrimitivePropertyEvent());

    expect(eventWrongOddsService.getReducedOverGetLogInfoModel).toHaveBeenCalledTimes(1);
    expect(commonService.getLogInfo).toHaveBeenCalledTimes(1);

  });
});
