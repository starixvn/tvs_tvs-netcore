import * as _ from 'lodash';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { CommonService } from '../../../../../utility/services/common.service';
import { FilterModel } from '../../filter/filter.model';
import { RedCardGetLogInfoQuery } from '../../models/event-red-card.model';
import { GetLogInfoModel, GetLogInfoViewModel } from '../../models/get-log-info.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { LogInfoNotParticipate } from '../models/log-info-not-participate.model';
import { NotParticipateBetType } from '../models/not-participate-bet-type.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';
import { EventNotParticipateService } from './event-not-participate.service';
import { LogInfoService } from './log-info.service';

class Helper {
  static readonly fakeNotParticipateBetTypes: NotParticipateBetType[] = [
    {
      betTypeId: 1,
      betTypeName: '',
      disabled: false
    },
    {
      betTypeId: 2,
      betTypeName: '',
      disabled: false
    }
  ];
  static readonly fakeLogInfoNotParticipate: LogInfoNotParticipate = {
    matchId: 1,
    filterNotParticipates: [],
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
    const logInfo = _.cloneDeep(Helper.fakeLogInfoNotParticipate);
    service.resetLogInfoOfEvent(logInfo);

    expect(logInfo.logInfoDetail).toBe(null);
    expect(logInfo.messageValidationLogInfo).toBe(null);
  });

  it('#getLogInfo should call #eventNotParticipateService.getNotParticipateGetLogInfoModel', async () => {
    const eventWrongOddsService = new EventNotParticipateService();
    eventWrongOddsService.getNotParticipateGetLogInfoModel = jest.fn().mockReturnValue(new RedCardGetLogInfoQuery());
    const commonService = new CommonService(null);
    commonService.getLogInfo = jest.fn().mockReturnValue(Helper.fakeGetLogInfoViewModel);

    const mockService = new LogInfoService(commonService, eventWrongOddsService);
    await mockService.getLogInfo(Helper.fakeLogInfoNotParticipate, false, 1, new FilterModel(), new PrimitivePropertyEvent());

    expect(eventWrongOddsService.getNotParticipateGetLogInfoModel).toHaveBeenCalledTimes(1);
    expect(commonService.getLogInfo).toHaveBeenCalledTimes(1);
  });

  it('#getLogInfo should call #eventNotParticipateService.getNotParticipateGetLogInfoModel when isEdit', async () => {
    const eventWrongOddsService = new EventNotParticipateService();
    eventWrongOddsService.getNotParticipateGetLogInfoModel = jest.fn().mockReturnValue(new RedCardGetLogInfoQuery());
    const commonService = new CommonService(null);
    commonService.getLogInfo = jest.fn().mockReturnValue(Helper.fakeGetLogInfoViewModel);

    const mockService = new LogInfoService(commonService, eventWrongOddsService);
    await mockService.getLogInfo(Helper.fakeLogInfoNotParticipate, true, 1, new FilterModel(), new PrimitivePropertyEvent());

    expect(eventWrongOddsService.getNotParticipateGetLogInfoModel).toHaveBeenCalledTimes(1);
    expect(commonService.getLogInfo).toHaveBeenCalledTimes(1);

  });
});
