import { TestBed } from '@angular/core/testing';
import { LogInfoDetail } from '../../../../../../utility/models/log-info-detail.model';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { CommonService } from '../../../../../../utility/services/common.service';
import { StaticService } from '../../../../../../utility/services/static.service';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { LogInfoRelatedEvent } from '../../../../../component/log-info-related-event/log-info-related-event.model';
import { PrimitiveProperty } from '../../../../../component/log-info-related-event/primitive-property.model';
import { GetLogInfoModel, GetLogInfoViewModel, ValidationMessage } from '../../../../models/get-log-info.model';
import { FilterTimeWithAllowance } from '../../../../red-card/app/event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { LogInfoService } from './log-info.service';
import { ValidationService } from './validation.service';

class Helper {
  static readonly fakeLogInfoRelatedEvent = {
    matchId: 1,
    subIssueTypeId: 1,
    voidTimeArea: {
      fromDateTime: '2024-01-01 10:00:00',
      toDateTime: '2024-01-01 11:00:00',
      aaTime: 5,
      paTime: 5,
      saTime: 5
    }
  } as LogInfoRelatedEvent;

  static readonly fakeFilterTimeWithAllowance = {
    fromDateTime: '2024-01-01 10:00:00',
    toDateTime: '2024-01-01 11:00:00',
    aaTime: 5,
    paTime: 5,
    saTime: 5
  } as FilterTimeWithAllowance

  static readonly fakeLogInfoDetail = {
    matchId: 1,
    voidFromTime: new Date('2024-01-01 10:00:00'),
    voidToTime: new Date('2024-01-01 11:00:00'),
  } as LogInfoDetail;


}
describe('LogInfoService', () => {
  let service: LogInfoService;
  let validationService: ValidationService;
  let commonService: CommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ LogInfoService, ValidationService, CommonService ]
    });

    service = TestBed.inject(LogInfoService);
    validationService = TestBed.inject(ValidationService);
    commonService = TestBed.inject(CommonService);
  });

  describe('getLogInfo', () => {
    it('should call getLogInfo with correct parameters and update events', async () => {
      const allEvents = [ Helper.fakeLogInfoRelatedEvent ] as LogInfoRelatedEvent[];
      const primitiveProps = { filterBy: 1 } as PrimitiveProperty;
      const isEdit = false;
      const requestId = 1;
      const filter = {
        action: '1',
        issueTypeId: '1'
      } as FilterModel;

      const mockLogInfoResponse = {
        transInfoAddRequestModel: {},
        getLogInfoModels: [
          {
            matchId: 1,
            logInfoDetail: Helper.fakeLogInfoDetail,
            validation: {},
            ticketRequest: []
          }
        ]
      } as GetLogInfoViewModel;

      jest.spyOn(validationService, 'isHasAllowanceTime').mockReturnValue(true);
      jest.spyOn(validationService, 'isHasWarningRangeTime').mockReturnValue(false);
      jest.spyOn(commonService, 'getLogInfo').mockResolvedValue(mockLogInfoResponse);
      jest.spyOn(StaticService, 'isDangerAccepted').mockReturnValue(true);
      jest.spyOn(StaticService, 'getValidationMessageList').mockReturnValue([]);

      await service.getLogInfo(allEvents, primitiveProps, isEdit, requestId, filter, Helper.fakeFilterTimeWithAllowance);

      expect(commonService.getLogInfo).toHaveBeenCalled();
      expect(primitiveProps.transInfoAddRequestModel).toEqual(mockLogInfoResponse.transInfoAddRequestModel);
      expect(allEvents[0].logInfoDetail).toEqual(mockLogInfoResponse.getLogInfoModels[0].logInfoDetail);
    });
  });

  describe('resetLogInfoOfEvent', () => {
    it('should reset logInfoDetail and messageValidationLogInfo of all events', () => {
      const events = [
        {
          matchId: 1,
            logInfoDetail: Helper.fakeLogInfoDetail,
          messageValidationLogInfo: [
            {
              message: 'message1',
              type: 'error',
              isError: true,
              reason: 'error1'
            } as ValidationMessage,
            {
              message: 'message2',
              type: 'warning',
              isError: false,
              reason: 'warning1'
            } as ValidationMessage
          ],
          leagueName: 'Test League',
          isMainMatch: true,
          eventName: 'Test Event',
          subIssueTypeId: 1,
          sportType: 1,
          eventDate: new Date('2024-01-01'),
          voidTimeArea: {
            fromDateTime: '2024-01-01 10:00:00',
            toDateTime: '2024-01-01 11:00:00',
            aaTime: 5,
            paTime: 5,
            saTime: 5
          },
          tvDetectionModel: null
        }
      ] as LogInfoRelatedEvent[];

      service.resetLogInfoOfEvent(events);

      expect(events[0].logInfoDetail).toBeNull();
      expect(events[0].messageValidationLogInfo).toBeNull();
    });
  });

  describe('updateIsCheckedVar', () => {
    it('should update isCheckedVar and isHighLightVarCheck based on StaticService.isShowVarCheck', () => {
      const events = [
        Helper.fakeLogInfoRelatedEvent
      ] as LogInfoRelatedEvent[];
      events[0].isCheckedVar = false;
      events[0].isHighLightVarCheck = true;

      jest.spyOn(StaticService, 'isShowVarCheck').mockReturnValue(true);

      service.updateIsCheckedVar(events, true);

      expect(events[0].isCheckedVar).toBe(true);
      expect(events[0].isHighLightVarCheck).toBe(false);
    });

    it('should set isCheckedVar to null when StaticService.isShowVarCheck returns false', () => {
      const events = [ Helper.fakeLogInfoRelatedEvent ] as LogInfoRelatedEvent[];
      events[0].isCheckedVar = false;
      events[0].isHighLightVarCheck = true;

      jest.spyOn(StaticService, 'isShowVarCheck').mockReturnValue(false);

      service.updateIsCheckedVar(events, true);

      expect(events[0].isCheckedVar).toBeNull();
      expect(events[0].isHighLightVarCheck).toBe(false);
    });
  });

  describe('initGetLogInfoRedCardQuery', () => {
    it('should return query with dangerAcceptedModels when isEdit is true and issueTypeId is danger accepted', () => {
      const filterBy = 1;
      const isEdit = true;
      const requestId = 1;
      const filter = {
        action: '1',
        issueTypeId: '1'
      } as FilterModel;
      const events = [ Helper.fakeLogInfoRelatedEvent ] as LogInfoRelatedEvent[];
      const defaultFilterTimeWithAllowance = Helper.fakeFilterTimeWithAllowance;

      jest.spyOn(StaticService, 'isDangerAccepted').mockReturnValue(true);
      jest.spyOn(validationService, 'isHasAllowanceTime').mockReturnValue(true);

      const result = service['initGetLogInfoRedCardQuery'](filterBy, isEdit, requestId, filter, events, defaultFilterTimeWithAllowance);

      expect(result.requestId).toBe(1);
      expect(result.actionId).toBe(1);
      expect(result.issueTypeId).toBe(1);
      expect(result.dangerAcceptedModels).toBeDefined();
      expect(result.dangerAcceptedModels.length).toBe(1);
      expect(result.dangerAcceptedModels[0].matchId).toBe(1);
      expect(result.dangerAcceptedModels[0].filterBy).toBe(1);
      expect(result.dangerAcceptedModels[0].subIssueTypeId).toBe(1);
      expect(result.dangerAcceptedModels[0].aaTime).toBe(5);
      expect(result.dangerAcceptedModels[0].paTime).toBe(5);
      expect(result.dangerAcceptedModels[0].saTime).toBe(5);
    });

    it('should return query with null requestId when isEdit is false and issueTypeId is danger accepted', () => {
      const filterBy = 1;
      const isEdit = false;
      const requestId = 1;
      const filter = {
        action: '1',
        issueTypeId: '1'
      } as FilterModel;
      const events = [ Helper.fakeLogInfoRelatedEvent ] as LogInfoRelatedEvent[];
      const defaultFilterTimeWithAllowance = Helper.fakeFilterTimeWithAllowance;

      jest.spyOn(StaticService, 'isDangerAccepted').mockReturnValue(true);
      jest.spyOn(validationService, 'isHasAllowanceTime').mockReturnValue(true);

      const result = service['initGetLogInfoRedCardQuery'](filterBy, isEdit, requestId, filter, events, defaultFilterTimeWithAllowance);

      expect(result.requestId).toBeNull();
      expect(result.actionId).toBe(1);
      expect(result.issueTypeId).toBe(1);
      expect(result.dangerAcceptedModels).toBeDefined();
    });

    it('should return query without dangerAcceptedModels when issueTypeId is not danger accepted', () => {
      const filterBy = 1;
      const isEdit = true;
      const requestId = 1;
      const filter = {
        action: '1',
        issueTypeId: '2'
      } as FilterModel;
      const events = [ Helper.fakeLogInfoRelatedEvent ] as LogInfoRelatedEvent[];
      const defaultFilterTimeWithAllowance = Helper.fakeFilterTimeWithAllowance;

      jest.spyOn(StaticService, 'isDangerAccepted').mockReturnValue(false);
      jest.spyOn(validationService, 'isHasAllowanceTime').mockReturnValue(true);

      const result = service['initGetLogInfoRedCardQuery'](filterBy, isEdit, requestId, filter, events, defaultFilterTimeWithAllowance);

      expect(result.requestId).toBe(1);
      expect(result.actionId).toBe(1);
      expect(result.issueTypeId).toBe(2);
      expect(result.dangerAcceptedModels).toBeUndefined();
    });
  });

  describe('getLogInfoModel', () => {
    it('should use defaultFilterTimeWithAllowance when event has allowance time', () => {
      const filterBy = 1;
      const events = [ Helper.fakeLogInfoRelatedEvent ] as LogInfoRelatedEvent[];
      const defaultFilterTimeWithAllowance = Helper.fakeFilterTimeWithAllowance;

      jest.spyOn(validationService, 'isHasAllowanceTime').mockReturnValue(true);

      const result = service['getLogInfoModel'](filterBy, events, defaultFilterTimeWithAllowance);

      expect(result.length).toBe(1);
      expect(result[0].filterFromTransTime).toBe('2024-01-01 10:00:00');
      expect(result[0].filterToTransTime).toBe('2024-01-01 11:00:00');
      expect(result[0].matchId).toBe(1);
      expect(result[0].filterBy).toBe(1);
      expect(result[0].subIssueTypeId).toBe(1);
      expect(result[0].aaTime).toBe(5);
      expect(result[0].paTime).toBe(5);
      expect(result[0].saTime).toBe(5);
    });

    it('should use voidTimeArea when event does not have allowance time', () => {
      const filterBy = 1;
      const events = [ Helper.fakeLogInfoRelatedEvent ] as LogInfoRelatedEvent[];
      const defaultFilterTimeWithAllowance = Helper.fakeFilterTimeWithAllowance;

      jest.spyOn(validationService, 'isHasAllowanceTime').mockReturnValue(false);

      const result = service['getLogInfoModel'](filterBy, events, defaultFilterTimeWithAllowance);

      expect(result.length).toBe(1);
      expect(result[0].filterFromTransTime).toBe('2024/01/01 10:00:00.000 AM');
      expect(result[0].filterToTransTime).toBe('2024/01/01 11:00:00.000 AM');
      expect(result[0].matchId).toBe(1);
      expect(result[0].filterBy).toBe(1);
      expect(result[0].subIssueTypeId).toBe(1);
      expect(result[0].aaTime).toBe(5);
      expect(result[0].paTime).toBe(5);
      expect(result[0].saTime).toBe(5);
    });
  });

  describe('assignResultLogInfoToEvents', () => {
    it('should assign logInfoDetail and update voidTimeArea when event has allowance time', () => {
      const allEvents = [ Helper.fakeLogInfoRelatedEvent ] as LogInfoRelatedEvent[];

      const logInfoModels = [
        {
          matchId: 1,
          logInfoDetail: {
            matchId: 1,
            voidFromTime: new Date('2024-01-01 12:00:00'),
            voidToTime: new Date('2024-01-01 13:00:00'),
            transVoidToTime: new Date('2024-01-01 13:00:00')
          } as LogInfoDetail
        }
      ] as GetLogInfoModel[];

      const defaultFilterTimeWithAllowance = Helper.fakeFilterTimeWithAllowance;

      validationService.isHasAllowanceTime = jest.fn().mockReturnValue(true);
      validationService.isHasWarningRangeTime = jest.fn().mockReturnValue(false);
      StaticService.getValidationMessageList = jest.fn().mockReturnValue([]);

      service['assignResultLogInfoToEvents'](allEvents, logInfoModels, defaultFilterTimeWithAllowance);

      expect(allEvents[0].logInfoDetail).toEqual(logInfoModels[0].logInfoDetail);
      expect(allEvents[0].voidTimeArea.fromDateTime).toBe('2024/01/01 12:00:00.000 PM');
      expect(allEvents[0].voidTimeArea.toDateTime).toBe('2024/01/01 01:00:00.000 PM');
    });
  });
});
