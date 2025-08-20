import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';
import { LogInfoService } from './log-info.service';
import { PopupService } from '../../../../../services/popup.service';
import { SaveRequestService } from './save-request.service';
import { AddRequestStore } from '../../../../../services/add-request.store';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { LogInfoWrongOu } from '../models/log-info-wrong-ou.model';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { OthersModel } from '../../../../../component/others/others.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { jest } from '@jest/globals';
import { CommonService } from '../../../../../../utility/services/common.service';
import { HttpService } from '../../../../../../utility/services/http.service';
import { EventWrongOuService } from './event-wrong-ou.service';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { EventLeagueComponent } from '../../../../../../utility/components/event-league/event-league.component';
import { LogInfoWrongOuComponent } from '../log-info-wrong-ou/log-info-wrong-ou.component';
import { StaticService } from '../../../../../../utility/services/static.service';
import { AddRequestService } from '../../../../../services/add-request.service';
import { WrongOuModel } from '../../../../../models/event-wrong-ou.model';
import { LinkedLogsViewModel } from '../../../../../component/pool-house-ticket/linked-log/linked-log.model';
import { LogInfoDetail } from '../../../../../../utility/models/log-info-detail.model';
import { GetLogInfoViewModel } from '../../../../../models/get-log-info.model';
import { FilterBetType } from '../../../../../events/wrong-hdp/app/event-wrong-hdp/models/filter-with-hdp.model';

describe('SaveRequestService', () => {
  let service: SaveRequestService;
  let validationService: ValidationService;
  let logInfoService: LogInfoService;
  let popupService: PopupService;
  let addRequestStore: AddRequestStore;
  let eventWrongOuService: EventWrongOuService;
  let addRequestService: AddRequestService;
  let staticService: StaticService;
  let commonService: CommonService;

  const mockEventLeagueComponent = {
    isMatchIdValid: () => true
  };

  const mockLogInfoWrongOuComponent = {
    filterWrongOuComponent: {
      isValid: () => true
    },
    logInfo: new LogInfoWrongOu()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule
      ],
      providers: [
        SaveRequestService,
        ValidationService,
        LogInfoService,
        PopupService,
        AddRequestStore,
        CommonService,
        HttpService,
        EventWrongOuService,
        AddRequestService,
        StaticService
      ]
    });

    service = TestBed.inject(SaveRequestService);
    validationService = TestBed.inject(ValidationService);
    logInfoService = TestBed.inject(LogInfoService);
    popupService = TestBed.inject(PopupService);
    addRequestStore = TestBed.inject(AddRequestStore);
    eventWrongOuService = TestBed.inject(EventWrongOuService);
    addRequestService = TestBed.inject(AddRequestService);
    staticService = TestBed.inject(StaticService);
    commonService = TestBed.inject(CommonService);

    staticService['isWrongOU'] = jest.fn().mockReturnValue(true);
    jest.spyOn(addRequestStore, 'changeSavingRequestStatus');
    jest.spyOn(addRequestStore, 'changeBlockingUiStatus');
    jest.spyOn(validationService, 'validateCommonData').mockReturnValue(true);
    jest.spyOn(validationService, 'isAllEventsValid').mockReturnValue(true);
    jest.spyOn(validationService, 'checkCanShowConfirmationWrongOu').mockReturnValue(true);
    jest.spyOn(commonService, 'getLogInfo').mockResolvedValue({
      transInfoAddRequestModel: {},
      getLogInfoModels: []
    } as GetLogInfoViewModel);
  });

  it('should be created', () => {
    // Arrange & Act
    const service = TestBed.inject(SaveRequestService);

    // Assert
    expect(service).toBeTruthy();
  });

  describe('recheckLogInfoBeforeSaveRequest', () => {
    it('should recheck log info before save request', async () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.requestId = 1;
      saveRequestArg.userId = 1;
      saveRequestArg.requestedBy = 'test';
      saveRequestArg.isEdit = false;
      saveRequestArg.actionIdOfFirstTimeAccess = '1';
      saveRequestArg.filter = new FilterModel();
      saveRequestArg.others = new OthersModel();
      saveRequestArg.primitiveProps = new PrimitiveProperty();
      
      const event = new LogInfoWrongOu();
      event.messageValidationLogInfo = [];
      event.filterWrongOu = {
        filterFromTransTime: '2024-03-20T00:00:00',
        filterToTransTime: '2024-03-20T23:59:59',
        liveIndicator: 1,
        wrongMarket: '1',
        actualMarket: '2',
        filterBetType: new FilterBetType('X', 'Y', '1')
      };
      saveRequestArg.allEvents = [event];
      
      const mainEvent = new LogInfoWrongOu();
      mainEvent.messageValidationLogInfo = [];
      mainEvent.filterWrongOu = {
        filterFromTransTime: '2024-03-20T00:00:00',
        filterToTransTime: '2024-03-20T23:59:59',
        liveIndicator: 1,
        wrongMarket: '1',
        actualMarket: '2',
        filterBetType: new FilterBetType('X', 'Y', '1')
      };
      saveRequestArg.mainEvent = mainEvent;
      
      saveRequestArg.eventLeagueComponent = mockEventLeagueComponent as EventLeagueComponent;
      saveRequestArg.logInfoComponents = [mockLogInfoWrongOuComponent as LogInfoWrongOuComponent];
      saveRequestArg.addRequestStore = addRequestStore;

      jest.spyOn(logInfoService, 'getLogInfo').mockResolvedValue();
      jest.spyOn(eventWrongOuService, 'getLinkedLog').mockResolvedValue({} as LinkedLogsViewModel);

      // Act
      await service.recheckLogInfoBeforeSaveRequest(saveRequestArg);

      // Assert
      expect(validationService.validateCommonData).toHaveBeenCalled();
      expect(validationService.isAllEventsValid).toHaveBeenCalled();
      expect(logInfoService.getLogInfo).toHaveBeenCalled();
      expect(eventWrongOuService.getLinkedLog).toHaveBeenCalled();
    });

    it('should return false when common data validation fails', async () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.requestId = 1;
      saveRequestArg.userId = 1;
      saveRequestArg.requestedBy = 'test';
      saveRequestArg.isEdit = false;
      saveRequestArg.actionIdOfFirstTimeAccess = '1';
      saveRequestArg.filter = new FilterModel();
      saveRequestArg.others = new OthersModel();
      saveRequestArg.primitiveProps = new PrimitiveProperty();
      
      const event = new LogInfoWrongOu();
      event.messageValidationLogInfo = [];
      event.filterWrongOu = {
        filterFromTransTime: '2024-03-20T00:00:00',
        filterToTransTime: '2024-03-20T23:59:59',
        liveIndicator: 1,
        wrongMarket: '1',
        actualMarket: '2',
        filterBetType: new FilterBetType('X', 'Y', '1')
      };
      saveRequestArg.allEvents = [event];
      
      const mainEvent = new LogInfoWrongOu();
      mainEvent.messageValidationLogInfo = [];
      mainEvent.filterWrongOu = {
        filterFromTransTime: '2024-03-20T00:00:00',
        filterToTransTime: '2024-03-20T23:59:59',
        liveIndicator: 1,
        wrongMarket: '1',
        actualMarket: '2',
        filterBetType: new FilterBetType('X', 'Y', '1')
      };
      saveRequestArg.mainEvent = mainEvent;
      
      saveRequestArg.eventLeagueComponent = mockEventLeagueComponent as EventLeagueComponent;
      saveRequestArg.logInfoComponents = [mockLogInfoWrongOuComponent as LogInfoWrongOuComponent];
      saveRequestArg.addRequestStore = addRequestStore;

      jest.spyOn(validationService, 'validateCommonData').mockReturnValue(false);

      // Act
      const result = await service.recheckLogInfoBeforeSaveRequest(saveRequestArg);

      // Assert
      expect(result).toBe(false);
      expect(validationService.validateCommonData).toHaveBeenCalled();
    });

    it('should return false when events validation fails', async () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.requestId = 1;
      saveRequestArg.userId = 1;
      saveRequestArg.requestedBy = 'test';
      saveRequestArg.isEdit = false;
      saveRequestArg.actionIdOfFirstTimeAccess = '1';
      saveRequestArg.filter = new FilterModel();
      saveRequestArg.others = new OthersModel();
      saveRequestArg.primitiveProps = new PrimitiveProperty();
      
      const event = new LogInfoWrongOu();
      event.messageValidationLogInfo = [];
      event.filterWrongOu = {
        filterFromTransTime: '2024-03-20T00:00:00',
        filterToTransTime: '2024-03-20T23:59:59',
        liveIndicator: 1,
        wrongMarket: '1',
        actualMarket: '2',
        filterBetType: new FilterBetType('X', 'Y', '1')
      };
      saveRequestArg.allEvents = [event];
      
      const mainEvent = new LogInfoWrongOu();
      mainEvent.messageValidationLogInfo = [];
      mainEvent.filterWrongOu = {
        filterFromTransTime: '2024-03-20T00:00:00',
        filterToTransTime: '2024-03-20T23:59:59',
        liveIndicator: 1,
        wrongMarket: '1',
        actualMarket: '2',
        filterBetType: new FilterBetType('X', 'Y', '1')
      };
      saveRequestArg.mainEvent = mainEvent;
      
      saveRequestArg.eventLeagueComponent = mockEventLeagueComponent as EventLeagueComponent;
      saveRequestArg.logInfoComponents = [mockLogInfoWrongOuComponent as LogInfoWrongOuComponent];
      saveRequestArg.addRequestStore = addRequestStore;

      jest.spyOn(logInfoService, 'getLogInfo').mockResolvedValue();
      jest.spyOn(eventWrongOuService, 'getLinkedLog').mockResolvedValue({} as LinkedLogsViewModel);
      jest.spyOn(validationService, 'isAllEventsValid').mockReturnValue(false);

      // Act
      const result = await service.recheckLogInfoBeforeSaveRequest(saveRequestArg);

      // Assert
      expect(result).toBe(false);
      expect(validationService.isAllEventsValid).toHaveBeenCalled();
    });
  });

  describe('saveRequest', () => {
    it('should save request when data is valid', async () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.requestId = 1;
      saveRequestArg.userId = 1;
      saveRequestArg.requestedBy = 'test';
      saveRequestArg.isEdit = false;
      saveRequestArg.actionIdOfFirstTimeAccess = '1';
      saveRequestArg.filter = new FilterModel();
      saveRequestArg.others = new OthersModel();
      saveRequestArg.primitiveProps = new PrimitiveProperty();
      
      const event = new LogInfoWrongOu();
      event.messageValidationLogInfo = [];
      event.filterWrongOu = {
        filterFromTransTime: '2024-03-20T00:00:00',
        filterToTransTime: '2024-03-20T23:59:59',
        liveIndicator: 1,
        wrongMarket: '1',
        actualMarket: '2',
        filterBetType: new FilterBetType('X', 'Y', '1')
      };
      saveRequestArg.allEvents = [event];
      
      const mainEvent = new LogInfoWrongOu();
      mainEvent.messageValidationLogInfo = [];
      mainEvent.filterWrongOu = {
        filterFromTransTime: '2024-03-20T00:00:00',
        filterToTransTime: '2024-03-20T23:59:59',
        liveIndicator: 1,
        wrongMarket: '1',
        actualMarket: '2',
        filterBetType: new FilterBetType('X', 'Y', '1')
      };
      saveRequestArg.mainEvent = mainEvent;
      
      saveRequestArg.eventLeagueComponent = mockEventLeagueComponent as EventLeagueComponent;
      saveRequestArg.logInfoComponents = [mockLogInfoWrongOuComponent as LogInfoWrongOuComponent];
      saveRequestArg.addRequestStore = addRequestStore;

      jest.spyOn(logInfoService, 'getLogInfo').mockResolvedValue();
      jest.spyOn(eventWrongOuService, 'getLinkedLog').mockResolvedValue({} as LinkedLogsViewModel);
      jest.spyOn(popupService, 'showConfirm');
      jest.spyOn(addRequestService, 'executeSaveRequest').mockResolvedValue();

      // Act
      await service.saveRequest(saveRequestArg);

      // Assert
      expect(validationService.validateCommonData).toHaveBeenCalled();
      expect(validationService.isAllEventsValid).toHaveBeenCalled();
      expect(validationService.checkCanShowConfirmationWrongOu).toHaveBeenCalled();
      expect(logInfoService.getLogInfo).toHaveBeenCalled();
      expect(popupService.showConfirm).toHaveBeenCalled();
    });

    it('should not save request when data is invalid', async () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.requestId = 1;
      saveRequestArg.userId = 1;
      saveRequestArg.requestedBy = 'test';
      saveRequestArg.isEdit = false;
      saveRequestArg.actionIdOfFirstTimeAccess = '1';
      saveRequestArg.filter = new FilterModel();
      saveRequestArg.others = new OthersModel();
      saveRequestArg.primitiveProps = new PrimitiveProperty();
      
      const event = new LogInfoWrongOu();
      event.messageValidationLogInfo = [];
      event.filterWrongOu = {
        filterFromTransTime: '2024-03-20T00:00:00',
        filterToTransTime: '2024-03-20T23:59:59',
        liveIndicator: 1,
        wrongMarket: '1',
        actualMarket: '2',
        filterBetType: new FilterBetType('X', 'Y', '1')
      };
      saveRequestArg.allEvents = [event];
      
      const mainEvent = new LogInfoWrongOu();
      mainEvent.messageValidationLogInfo = [];
      mainEvent.filterWrongOu = {
        filterFromTransTime: '2024-03-20T00:00:00',
        filterToTransTime: '2024-03-20T23:59:59',
        liveIndicator: 1,
        wrongMarket: '1',
        actualMarket: '2',
        filterBetType: new FilterBetType('X', 'Y', '1')
      };
      saveRequestArg.mainEvent = mainEvent;
      
      saveRequestArg.eventLeagueComponent = mockEventLeagueComponent as EventLeagueComponent;
      saveRequestArg.logInfoComponents = [mockLogInfoWrongOuComponent as LogInfoWrongOuComponent];
      saveRequestArg.addRequestStore = addRequestStore;

      jest.spyOn(validationService, 'isAllEventsValid').mockReturnValue(false);
      jest.spyOn(addRequestService, 'executeSaveRequest');

      // Act
      await service.saveRequest(saveRequestArg);

      // Assert
      expect(addRequestService.executeSaveRequest).not.toHaveBeenCalled();
      expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(false);
    });

    it('should save request directly when confirmation is not needed', async () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.requestId = 1;
      saveRequestArg.userId = 1;
      saveRequestArg.requestedBy = 'test';
      saveRequestArg.isEdit = false;
      saveRequestArg.actionIdOfFirstTimeAccess = '1';
      saveRequestArg.filter = new FilterModel();
      saveRequestArg.others = new OthersModel();
      saveRequestArg.primitiveProps = new PrimitiveProperty();
      
      const event = new LogInfoWrongOu();
      event.messageValidationLogInfo = [];
      event.filterWrongOu = {
        filterFromTransTime: '2024-03-20T00:00:00',
        filterToTransTime: '2024-03-20T23:59:59',
        liveIndicator: 1,
        wrongMarket: '1',
        actualMarket: '2',
        filterBetType: new FilterBetType('X', 'Y', '1')
      };
      saveRequestArg.allEvents = [event];
      
      const mainEvent = new LogInfoWrongOu();
      mainEvent.messageValidationLogInfo = [];
      mainEvent.filterWrongOu = {
        filterFromTransTime: '2024-03-20T00:00:00',
        filterToTransTime: '2024-03-20T23:59:59',
        liveIndicator: 1,
        wrongMarket: '1',
        actualMarket: '2',
        filterBetType: new FilterBetType('X', 'Y', '1')
      };
      saveRequestArg.mainEvent = mainEvent;
      
      saveRequestArg.eventLeagueComponent = mockEventLeagueComponent as EventLeagueComponent;
      saveRequestArg.logInfoComponents = [mockLogInfoWrongOuComponent as LogInfoWrongOuComponent];
      saveRequestArg.addRequestStore = addRequestStore;

      jest.spyOn(validationService, 'checkCanShowConfirmationWrongOu').mockReturnValue(false);
      jest.spyOn(addRequestService, 'executeSaveRequest').mockResolvedValue();
      jest.spyOn(popupService, 'showConfirm');

      // Act
      await service.saveRequest(saveRequestArg);

      // Assert
      expect(addRequestService.executeSaveRequest).toHaveBeenCalled();
      expect(popupService.showConfirm).not.toHaveBeenCalled();
    });
  });

  describe('getWrongOuInfo', () => {
    it('should create WrongOuModel with correct data', () => {
      // Arrange
      const logInfoWrongOu = new LogInfoWrongOu();
      logInfoWrongOu.matchId = 123;
      logInfoWrongOu.isMainMatch = true;
      logInfoWrongOu.logInfoDetail = { matchId: 123 } as LogInfoDetail;
      logInfoWrongOu.poolHouseCheckedBetTypes = 'All';
      logInfoWrongOu.filterWrongOu = {
        filterFromTransTime: '2024-03-20T00:00:00',
        filterToTransTime: '2024-03-20T23:59:59',
        liveIndicator: 1,
        wrongMarket: '1',
        actualMarket: '2',
        filterBetType: new FilterBetType('X', 'Y', '1')
      };
      logInfoWrongOu.linkedLogsViewModel = {
        isLinkGroup1X2: true,
        isLinkGroupAIO: false
      } as LinkedLogsViewModel;

      const subIssueTypeId = '1';

      // Act
      const result = service.getWrongOuInfo(logInfoWrongOu, subIssueTypeId);

      // Assert
      expect(result).toBeInstanceOf(WrongOuModel);
      expect(result.matchId).toBe(123);
      expect(result.isMainMatch).toBe(true);
      expect(result.logInfoDetail).toEqual({ matchId: 123 });
      expect(result.subIssueTypeId).toBe(1);
      expect(result.poolHouseCheckedBetTypes).toBe('All');
      expect(result.filterFromTransTime).toBe('2024-03-20T00:00:00');
      expect(result.filterToTransTime).toBe('2024-03-20T23:59:59');
      expect(result.liveIndicator).toBe(1);
      expect(result.wrongMarket).toBe('1');
      expect(result.actualMarket).toBe('2');
      expect(result.filterBetIdX).toBe('X');
      expect(result.filterBetIdY).toBe('Y');
      expect(result.filterBetTypeId).toBe('1');
      expect(result.isLinkGroup1X2).toBe(true);
      expect(result.isLinkGroupAIO).toBe(false);
    });

    it('should not set link group properties for non-main match', () => {
      // Arrange
      const logInfoWrongOu = new LogInfoWrongOu();
      logInfoWrongOu.matchId = 123;
      logInfoWrongOu.isMainMatch = false;
      logInfoWrongOu.logInfoDetail = { matchId: 123 } as LogInfoDetail;
      logInfoWrongOu.poolHouseCheckedBetTypes = 'All';
      logInfoWrongOu.filterWrongOu = {
        filterFromTransTime: '2024-03-20T00:00:00',
        filterToTransTime: '2024-03-20T23:59:59',
        liveIndicator: 1,
        wrongMarket: '1',
        actualMarket: '2',
        filterBetType: new FilterBetType('X', 'Y', '1')
      };
      logInfoWrongOu.linkedLogsViewModel = {
        isLinkGroup1X2: true,
        isLinkGroupAIO: false
      } as LinkedLogsViewModel;

      const subIssueTypeId = '1';

      // Act
      const result = service.getWrongOuInfo(logInfoWrongOu, subIssueTypeId);

      // Assert
      expect(result.isLinkGroup1X2).toBeUndefined();
      expect(result.isLinkGroupAIO).toBeUndefined();
    });
  });
});
