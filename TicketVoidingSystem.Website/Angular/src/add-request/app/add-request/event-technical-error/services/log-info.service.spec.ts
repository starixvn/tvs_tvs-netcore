import * as _ from 'lodash';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { CommonService } from '../../../../../utility/services/common.service';
import { FilterModel } from '../../filter/filter.model';
import { RedCardGetLogInfoQuery } from '../../models/event-red-card.model';
import { GetLogInfoModel, GetLogInfoViewModel, Validation } from '../../models/get-log-info.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { FilterTechnicalErrorModel } from '../models/filter-wrong-market-offered.model';
import { LogInfoTechnicalError } from '../models/log-info-wrong-market-offered.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';
import { EventTechnicalErrorService } from './event-wrong-market-offfered.service';
import { LogInfoService } from './log-info.service';

class Helper {
  static readonly fromDate = '2021-12-18 12:08:49.737';
  static readonly toDate = '2021-12-21 12:08:49.737';
  static readonly fakeFilterTechnicalErrorModel: FilterTechnicalErrorModel = {
    fromDateTime: Helper.fromDate,
    toDateTime: Helper.toDate
  };
  static readonly fakeLogInfoTechnicalError: LogInfoTechnicalError = {
    matchId: 1,
    filterTechnicalErrorModel: Helper.fakeFilterTechnicalErrorModel,
    logInfoDetail: new LogInfoDetail(),
    messageValidationLogInfo: [],
    betTypeCount: [],
    betTeamsResult: [],
  } as LogInfoTechnicalError;

  static readonly fakeGetLogInfoModel: GetLogInfoModel = {
    matchId: 1,
    validation: {
      isInvalidTotalTickets: true,
      isExistedInOtherRequest: true,
      isPoolHouseAffected: false
    } as Validation,
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
    const logInfo = _.cloneDeep(Helper.fakeLogInfoTechnicalError);
    service.resetLogInfoOfEvent(logInfo);

    expect(logInfo.logInfoDetail).toBe(null);
    expect(logInfo.messageValidationLogInfo).toBe(null);
  });

  it('#getLogInfo should call #eventTechnicalErrorService.getTechnicalErrorGetLogInfoModel', async () => {
    const eventWrongOddsService = new EventTechnicalErrorService();
    eventWrongOddsService.getTechnicalErrorGetLogInfoModel = jest.fn().mockReturnValue(new RedCardGetLogInfoQuery());
    const commonService = new CommonService(null);
    commonService.getLogInfo = jest.fn().mockReturnValue(Helper.fakeGetLogInfoViewModel);

    const mockService = new LogInfoService(commonService, eventWrongOddsService);
    await mockService.getLogInfo(Helper.fakeLogInfoTechnicalError, false, 1, new FilterModel(), new PrimitivePropertyEvent());

    expect(eventWrongOddsService.getTechnicalErrorGetLogInfoModel).toHaveBeenCalledTimes(1);
    expect(commonService.getLogInfo).toHaveBeenCalledTimes(1);
  });

  it('#getLogInfo should call #eventTechnicalErrorService.getTechnicalErrorGetLogInfoModel when isEdit', async () => {
    const eventWrongOddsService = new EventTechnicalErrorService();
    eventWrongOddsService.getTechnicalErrorGetLogInfoModel = jest.fn().mockReturnValue(new RedCardGetLogInfoQuery());
    const commonService = new CommonService(null);
    commonService.getLogInfo = jest.fn().mockReturnValue(Helper.fakeGetLogInfoViewModel);

    const mockService = new LogInfoService(commonService, eventWrongOddsService);
    await mockService.getLogInfo(Helper.fakeLogInfoTechnicalError, true, 1, new FilterModel(), new PrimitivePropertyEvent());

    expect(eventWrongOddsService.getTechnicalErrorGetLogInfoModel).toHaveBeenCalledTimes(1);
    expect(commonService.getLogInfo).toHaveBeenCalledTimes(1);

  });
});
