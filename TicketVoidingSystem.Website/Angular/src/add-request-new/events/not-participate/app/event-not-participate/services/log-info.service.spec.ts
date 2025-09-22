import { TestBed } from '@angular/core/testing';
import { LogInfoDetail } from '../../../../../../utility/models/log-info-detail.model';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { CommonService } from '../../../../../../utility/services/common.service';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { GetLogInfoViewModel, ValidationMessage } from '../../../../../models/get-log-info.model';
import { TransInfoAddRequestModel } from '../../../../../models/trans-info-add-request.model';
import { LogInfoNotParticipate } from '../models/log-info-not-participate.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';
import { EventNotParticipateService } from './event-not-participate.service';
import { LogInfoService } from './log-info.service';

describe('LogInfoService', () => {
  let service: LogInfoService;
  let commonService: CommonService;
  let eventNotParticipateService: EventNotParticipateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [LogInfoService, EventNotParticipateService]
    });

    service = TestBed.inject(LogInfoService);
    commonService = TestBed.inject(CommonService);
    eventNotParticipateService = TestBed.inject(EventNotParticipateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLogInfo', () => {
    it('should get log info and assign to events', async () => {
      // Arrange
      const mockLogInfoEvent = {
        matchId: 123,
        logInfoDetail: new LogInfoDetail(),
        messageValidationLogInfo: null,
        filterNotParticipates: []
      } as LogInfoNotParticipate;

      const mockFilter = {
        subIssueTypeId: '1',
        action: '1',
        issueTypeId: '1'
      } as FilterModel;

      const mockPrimitiveProps = {
        transInfoAddRequestModel: null
      } as PrimitivePropertyEvent;

      const mockLogInfoDetail = new LogInfoDetail();
      mockLogInfoDetail.matchId = 123;
      mockLogInfoDetail.liveScores = '1-0';
      mockLogInfoDetail.voidFromTime = new Date();
      mockLogInfoDetail.voidToTime = new Date();
      mockLogInfoDetail.transVoidToTime = new Date();
      mockLogInfoDetail.singleCount = 1;
      mockLogInfoDetail.cashOutCount = 0;
      mockLogInfoDetail.settleCount = 0;
      mockLogInfoDetail.instantlySettleCount = 0;
      mockLogInfoDetail.mainParlayCount = 0;
      mockLogInfoDetail.cancelCashOutCount = 0;
      mockLogInfoDetail.scoreNormalTicket = '1-0';
      mockLogInfoDetail.scoreOfMatch = '1-0';
      mockLogInfoDetail.minTransId = '123';
      mockLogInfoDetail.actionType = 'test';
      mockLogInfoDetail.isHasWarningRangeTime = false;

      const mockTransInfoAddRequestModel = new TransInfoAddRequestModel();
      mockTransInfoAddRequestModel.transInfoJson = '{}';
      mockTransInfoAddRequestModel.unMarkTransIds = '';
      mockTransInfoAddRequestModel.markTransIds = '';
      mockTransInfoAddRequestModel.removeTransIds = '';

      const mockValidationMessage: ValidationMessage = {
        isError: false,
        reason: 'test message',
        isShowPopup: false
      };

      const mockViewModel = {
        transInfoAddRequestModel: mockTransInfoAddRequestModel,
        getLogInfoModels: [{
          matchId: 123,
          logInfoDetail: mockLogInfoDetail,
          validation: {
            wrongScore: null,
            isInvalidTotalTickets: false,
            isExistedInOtherRequest: false,
            isExistsSecondAccept: false,
            isHasSettledTicket: false,
            isHasInstantlySettledTicket: false
          },
          ticketRequest: null
        }],
        infoSiteDBDownModel: null
      } as GetLogInfoViewModel;

      jest.spyOn(commonService, 'getLogInfo').mockResolvedValue(mockViewModel);
      jest.spyOn(eventNotParticipateService, 'getNotParticipateGetLogInfoModel').mockReturnValue([]);

      // Act
      await service.getLogInfo(mockLogInfoEvent, false, 0, mockFilter, mockPrimitiveProps);

      // Assert
      expect(commonService.getLogInfo).toHaveBeenCalled();
      expect(mockPrimitiveProps.transInfoAddRequestModel).toEqual(mockViewModel.transInfoAddRequestModel);
      expect(mockLogInfoEvent.logInfoDetail).toEqual(mockViewModel.getLogInfoModels[0].logInfoDetail);
    });
  });

  describe('resetLogInfoOfEvent', () => {
    it('should reset log info of event', () => {
      // Arrange
      const mockLogInfoEvent = {
        matchId: 123,
        logInfoDetail: new LogInfoDetail(),
        messageValidationLogInfo: [{
          isError: false,
          reason: 'test message',
          isShowPopup: false
        }],
        filterNotParticipates: []
      } as LogInfoNotParticipate;

      // Act
      service.resetLogInfoOfEvent(mockLogInfoEvent);

      // Assert
      expect(mockLogInfoEvent.logInfoDetail).toBeNull();
      expect(mockLogInfoEvent.messageValidationLogInfo).toBeNull();
    });
  });
});
