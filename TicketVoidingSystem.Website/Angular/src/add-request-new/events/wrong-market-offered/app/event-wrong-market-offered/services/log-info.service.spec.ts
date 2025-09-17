import { TestBed } from '@angular/core/testing';
import { LogInfoService } from './log-info.service';
import { CommonService } from '../../../../../../utility/services/common.service';
import { EventWrongMarketOfferedService } from './event-wrong-market-offfered.service';
import { LogInfoWrongMarketOffered } from '../models/log-info-wrong-market-offered.model';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';
import { GetLogInfoModel } from '../../../../../models/get-log-info.model';
import { GetLogInfoViewModel } from '../../../../../models/get-log-info.model';
import { TransInfoAddRequestModel } from '../../../../../models/trans-info-add-request.model';
import { StaticService } from '../../../../../../utility/services/static.service';
import { FilterWrongMarketOfferedModel } from '../models/filter-wrong-market-offered.model';
import { LogInfoItem } from '../models/log-info-wrong-market-offered.model';

class Helper {
  static readonly fakeFilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1'
  } as FilterModel;

  static readonly fakeTransInfoAddRequestModel = {
    transInfoJson: null,
    unMarkTransIds: '',
    markTransIds: '',
    removeTransIds: ''
  } as TransInfoAddRequestModel;

  static readonly fakeGetLogInfoModel = {
    id: 1,
    logInfoDetail: {},
    betTypeCount: [],
    validation: {
      isInvalidTotalTickets: false,
      isExistsSecondAccept: false
    }
  } as GetLogInfoModel;

  static readonly fakeFilterWrongMarketOfferedModel = {
    id: 1,
    filterTime: new Date(),
    fromDateTime: new Date(),
    toDateTime: new Date(),
    severity: 1
  } as unknown as FilterWrongMarketOfferedModel;
}

describe('LogInfoService', () => {
  let service: LogInfoService;
  let commonService: jest.Mocked<CommonService>;
  let eventWrongMarketOfferedService: jest.Mocked<EventWrongMarketOfferedService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LogInfoService,
        { provide: CommonService, useValue: {
          getLogInfo: jest.fn()
        } },
        { provide: EventWrongMarketOfferedService, useValue: {
          getWrongMarketOfferedGetLogInfoModel: jest.fn()
        } },
        { provide: StaticService, useValue: {
          getValidationMessageList: jest.fn().mockReturnValue([])
        } }
      ]
    });

    service = TestBed.inject(LogInfoService);
    commonService = TestBed.inject(CommonService) as jest.Mocked<CommonService>;
    eventWrongMarketOfferedService = TestBed.inject(EventWrongMarketOfferedService) as jest.Mocked<EventWrongMarketOfferedService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLogInfo', () => {
    it('should get log info and assign results', async () => {
      // Arrange
      const logInfoEvent = {
        logInfoItems: [],
        filterWrongMarketOfferedModels: [Helper.fakeFilterWrongMarketOfferedModel]
      } as LogInfoWrongMarketOffered;
      const isEdit = false;
      const requestId = 1;
      const filter = Helper.fakeFilterModel;
      const primitiveProps = new PrimitivePropertyEvent();

      const mockResponse = {
        transInfoAddRequestModel: Helper.fakeTransInfoAddRequestModel,
        getLogInfoModels: [Helper.fakeGetLogInfoModel]
      } as GetLogInfoViewModel;

      commonService.getLogInfo.mockResolvedValue(mockResponse);
      eventWrongMarketOfferedService.getWrongMarketOfferedGetLogInfoModel.mockReturnValue([]);

      // Act
      await service.getLogInfo(logInfoEvent, isEdit, requestId, filter, primitiveProps);

      // Assert
      expect(commonService.getLogInfo).toHaveBeenCalled();
      expect(primitiveProps.transInfoAddRequestModel).toBeDefined();
      expect(primitiveProps.isShowBetTypeCount).toBe(false);
      expect(logInfoEvent.logInfoItems.length).toBe(1);
    });
  });

  describe('resetLogInfoOfEvent', () => {
    it('should reset log info items', () => {
      // Arrange
      const logInfoEvent = {
        logInfoItems: [{} as LogInfoItem]
      } as LogInfoWrongMarketOffered;

      // Act
      service.resetLogInfoOfEvent(logInfoEvent);

      // Assert
      expect(logInfoEvent.logInfoItems.length).toBe(0);
    });
  });

  describe('createLogInfoItem', () => {
    it('should create log info item with correct data', () => {
      // Arrange
      const logInfoModel = Helper.fakeGetLogInfoModel;
      const filterItems = [Helper.fakeFilterWrongMarketOfferedModel];

      // Act
      const result = (service as any).createLogInfoItem(logInfoModel, filterItems);

      // Assert
      expect(result.id).toBe(logInfoModel.id);
      expect(result.filterTime).toBeDefined();
      expect(result.logInfoDetail).toBeDefined();
      expect(result.messageValidationLogInfo).toBeDefined();
      expect(result.betTypeCount).toBeDefined();
    });
  });
});
