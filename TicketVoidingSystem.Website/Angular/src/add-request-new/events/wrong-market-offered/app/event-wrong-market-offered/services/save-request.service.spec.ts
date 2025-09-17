import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';
import { LogInfoService } from './log-info.service';
import { PopupService } from '../../../../../services/popup.service';
import { SaveRequestService } from './save-request.service';
import { AddRequestStore } from '../../../../../services/add-request.store';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { LogInfoWrongMarketOffered } from '../models/log-info-wrong-market-offered.model';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { OthersModel } from '../../../../../component/others/others.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';
import { jest } from '@jest/globals';
import { CommonService } from '../../../../../../utility/services/common.service';
import { HttpService } from '../../../../../../utility/services/http.service';
import { EventWrongMarketOfferedService } from './event-wrong-market-offfered.service';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { EventLeagueComponent } from '../../../../../../utility/components/event-league/event-league.component';
import { FilterTimeComponent } from '../filter-time/filter-time.component';
import { AdvancedModeAddRequestComponent } from '../../../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.component';
import { TEXT } from '../../../../../../utility/constants/text';
import { AddRequestService } from '../../../../../services/add-request.service';
import { StaticService } from '../../../../../../utility/services/static.service';
import { ConfirmAddRequestModel, ExtraWarningModel } from '../../../../../component/confirm-add-request/confirm-add-request.model';
import { AddRequestQuery } from '../../../../../models/add-request.query';
import { WrongMarketOfferedModel } from '../../../../../models/event-wrong-market-offered.model';
import { LogInfoDetail } from '../../../../../../utility/models/log-info-detail.model';
import { ValidationMessage } from '../../../../../models/get-log-info.model';
import { TransInfoAddRequestModel } from '../../../../../models/trans-info-add-request.model';
import { FilterWrongMarketOfferedModel } from '../models/filter-wrong-market-offered.model';

describe('SaveRequestService', () => {
  let service: SaveRequestService;
  let validationService: ValidationService;
  let logInfoService: LogInfoService;
  let popupService: PopupService;
  let addRequestStore: AddRequestStore;
  let addRequestService: AddRequestService;
  let eventWrongMarketOfferedService: EventWrongMarketOfferedService;

  const mockLogInfoDetail: LogInfoDetail = {
    matchId: 1,
    liveScores: '1-0',
    voidFromTime: new Date('2023-01-01'),
    voidToTime: new Date('2023-01-02'),
    transVoidToTime: new Date('2023-01-02'),
    singleCount: 0,
    cashOutCount: 0,
    settleCount: 0,
    instantlySettleCount: 0,
    mainParlayCount: 0,
    cancelCashOutCount: 0,
    scoreNormalTicket: '',
    scoreOfMatch: '',
    minTransId: '',
    actionType: '',
    isHasWarningRangeTime: false
  } as LogInfoDetail;

  const mockLogInfoEvent: LogInfoWrongMarketOffered = {
    matchId: 1,
    filterWrongMarketOfferedModels: [],
    logInfoItems: [
      {
        id: 1,
        filterTime: {} as FilterWrongMarketOfferedModel,
        logInfoDetail: mockLogInfoDetail,
        messageValidationLogInfo: [],
        betTypeCount: []
      }
    ],
    betTeamsResult: [],
    allBetTypesSelection: []
  } as LogInfoWrongMarketOffered;

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
        EventWrongMarketOfferedService,
        AddRequestService
      ]
    });

    service = TestBed.inject(SaveRequestService);
    validationService = TestBed.inject(ValidationService);
    logInfoService = TestBed.inject(LogInfoService);
    popupService = TestBed.inject(PopupService);
    addRequestStore = TestBed.inject(AddRequestStore);
    addRequestService = TestBed.inject(AddRequestService);
    eventWrongMarketOfferedService = TestBed.inject(EventWrongMarketOfferedService);

    // Mock AddRequestStore methods
    jest.spyOn(addRequestStore, 'changeSavingRequestStatus');
    jest.spyOn(addRequestStore, 'changeBlockingUiStatus');
    jest.spyOn(validationService, 'validateCommonData').mockReturnValue(true);
    jest.spyOn(validationService, 'isValidLogInfoEvent').mockReturnValue(true);
    jest.spyOn(logInfoService, 'resetLogInfoOfEvent');
    jest.spyOn(logInfoService, 'getLogInfo').mockResolvedValue();
    jest.spyOn(popupService, 'showError');
    jest.spyOn(addRequestService, 'executeSaveRequest').mockResolvedValue();
    jest.spyOn(eventWrongMarketOfferedService, 'getExtraWarningModel').mockReturnValue({ title: '', messages: [] } as ExtraWarningModel);
    jest.spyOn(eventWrongMarketOfferedService, 'getWrongMarketOfferedModel').mockReturnValue([{
      id: 1,
      requestDetailId: 1,
      matchId: 1,
      subIssueTypeId: 1,
      filterFromTransTime: '2023-01-01',
      filterToTransTime: '2023-01-02',
      logInfoDetail: mockLogInfoDetail,
      betTypeCount: [],
      allBetTypesSelection: []
    }] as WrongMarketOfferedModel[]);
    jest.spyOn(StaticService, 'isHasWarningTakenNote').mockReturnValue(false);
    jest.spyOn(StaticService, 'isEditingByAnotherUser').mockReturnValue(false);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveRequest', () => {
    it('should show popup confirm save when data is valid', async () => {
      // Arrange
      const saveRequestArg = createSaveRequestArg();
      jest.spyOn(service as any, 'showPopupConfirmSave');

      // Act
      await service.saveRequest(saveRequestArg);

      // Assert
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(service['showPopupConfirmSave']).toHaveBeenCalledWith(saveRequestArg);
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    });

    it('should not show popup and set saving status to false when data is invalid', async () => {
      // Arrange
      const saveRequestArg = createSaveRequestArg();
      jest.spyOn(service as any, 'showPopupConfirmSave');
      jest.spyOn(service, 'recheckLogInfoBeforeSaveRequest').mockResolvedValue(false);

      // Act
      await service.saveRequest(saveRequestArg);

      // Assert
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(service['showPopupConfirmSave']).not.toHaveBeenCalled();
      expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(false);
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    });

    it('should skip validation when isVoided is true', async () => {
      // Arrange
      const saveRequestArg = createSaveRequestArg();
      saveRequestArg.filter.isVoided = true;
      const spyRecheckLogInfo = jest.spyOn(service, 'recheckLogInfoBeforeSaveRequest');
      jest.spyOn(service as any, 'showPopupConfirmSave');

      // Act
      await service.saveRequest(saveRequestArg);

      // Assert
      expect(spyRecheckLogInfo).not.toHaveBeenCalled();
      expect(service['showPopupConfirmSave']).toHaveBeenCalledWith(saveRequestArg);
    });
  });

  describe('recheckLogInfoBeforeSaveRequest', () => {
    it('should return true when validation passes', async () => {
      // Arrange
      const saveRequestArg = createSaveRequestArg();
      jest.spyOn(validationService, 'validateCommonData').mockReturnValue(true);
      jest.spyOn(validationService, 'isValidLogInfoEvent').mockReturnValue(true);

      // Act
      const result = await service.recheckLogInfoBeforeSaveRequest(saveRequestArg);

      // Assert
      expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
      expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalledWith(saveRequestArg.logInfoEvent);
      expect(validationService.validateCommonData).toHaveBeenCalledWith(
        saveRequestArg.eventLeagueComponent,
        saveRequestArg.filterTimeComponent,
        saveRequestArg.advancedModeComponent
      );
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
      expect(logInfoService.getLogInfo).toHaveBeenCalled();
      expect(validationService.isValidLogInfoEvent).toHaveBeenCalledWith(saveRequestArg.logInfoEvent);
      expect(result).toBe(true);
    });

    it('should return false when common data validation fails', async () => {
      // Arrange
      const saveRequestArg = createSaveRequestArg();
      jest.spyOn(validationService, 'validateCommonData').mockReturnValue(false);

      // Act
      const result = await service.recheckLogInfoBeforeSaveRequest(saveRequestArg);

      // Assert
      expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
      expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalledWith(saveRequestArg.logInfoEvent);
      expect(validationService.validateCommonData).toHaveBeenCalled();
      expect(logInfoService.getLogInfo).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should return false when log info validation fails', async () => {
      // Arrange
      const saveRequestArg = createSaveRequestArg();
      jest.spyOn(validationService, 'validateCommonData').mockReturnValue(true);
      jest.spyOn(validationService, 'isValidLogInfoEvent').mockReturnValue(false);

      // Act
      const result = await service.recheckLogInfoBeforeSaveRequest(saveRequestArg);

      // Assert
      expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
      expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalledWith(saveRequestArg.logInfoEvent);
      expect(validationService.validateCommonData).toHaveBeenCalled();
      expect(logInfoService.getLogInfo).toHaveBeenCalled();
      expect(validationService.isValidLogInfoEvent).toHaveBeenCalledWith(saveRequestArg.logInfoEvent);
      expect(result).toBe(false);
    });
  });

  describe('onClickConfirmSave', () => {
    it('should execute save request API when data is valid', async () => {
      // Arrange
      const saveRequestArg = createSaveRequestArg();
      jest.spyOn(service as any, 'executeSaveRequestApi');

      // Act
      await service.onClickConfirmSave(saveRequestArg);

      // Assert
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(service['executeSaveRequestApi']).toHaveBeenCalledWith(saveRequestArg);
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
      expect(popupService.showError).not.toHaveBeenCalled();
    });

    it('should show error when data is invalid', async () => {
      // Arrange
      const saveRequestArg = createSaveRequestArg();
      jest.spyOn(service, 'recheckLogInfoBeforeSaveRequest').mockResolvedValue(false);
      jest.spyOn(service as any, 'executeSaveRequestApi');

      // Act
      await service.onClickConfirmSave(saveRequestArg);

      // Assert
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(service['executeSaveRequestApi']).not.toHaveBeenCalled();
      expect(popupService.showError).toHaveBeenCalledWith(TEXT.INVALID_DATA_IN_REQUEST);
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    });

    it('should skip validation when isVoided is true', async () => {
      // Arrange
      const saveRequestArg = createSaveRequestArg();
      saveRequestArg.filter.isVoided = true;
      const spyRecheckLogInfo = jest.spyOn(service, 'recheckLogInfoBeforeSaveRequest');
      jest.spyOn(service as any, 'executeSaveRequestApi');

      // Act
      await service.onClickConfirmSave(saveRequestArg);

      // Assert
      expect(spyRecheckLogInfo).not.toHaveBeenCalled();
      expect(service['executeSaveRequestApi']).toHaveBeenCalledWith(saveRequestArg);
    });
  });

  describe('showPopupConfirmSave', () => {
    it('should set confirm add request properties correctly', () => {
      // Arrange
      const saveRequestArg = createSaveRequestArg();
      saveRequestArg.confirmAddRequest = new ConfirmAddRequestModel();
      saveRequestArg.logInfoEvent.logInfoItems = [
        {
          id: 1,
          filterTime: {} as FilterWrongMarketOfferedModel,
          logInfoDetail: {
            ...mockLogInfoDetail,
            settleCount: 1
          } as LogInfoDetail,
          messageValidationLogInfo: [{ isError: false, reason: 'test' }] as ValidationMessage[],
          betTypeCount: []
        }
      ];

      // Act
      service['showPopupConfirmSave'](saveRequestArg);

      // Assert
      expect(StaticService.isHasWarningTakenNote).toHaveBeenCalledWith(saveRequestArg.filter.action, saveRequestArg.actionIdOfFirstTimeAccess);
      expect(eventWrongMarketOfferedService.getExtraWarningModel).toHaveBeenCalledWith(saveRequestArg.logInfoEvent.logInfoItems);
      expect(saveRequestArg.confirmAddRequest.isOpen).toBe(true);
      expect(saveRequestArg.confirmAddRequest.requestId).toBe(saveRequestArg.requestId);
      expect(saveRequestArg.confirmAddRequest.requestedBy).toBe(saveRequestArg.requestedBy);
      expect(StaticService.isEditingByAnotherUser).toHaveBeenCalledWith(saveRequestArg.isEdit, saveRequestArg.userId);
    });

    it('should not set warning properties when isVoided is true', () => {
      // Arrange
      const saveRequestArg = createSaveRequestArg();
      saveRequestArg.filter.isVoided = true;
      saveRequestArg.confirmAddRequest = new ConfirmAddRequestModel();
      const spyWarningTakenNote = jest.spyOn(StaticService, 'isHasWarningTakenNote').mockClear();
      const spyExtraWarning = jest.spyOn(eventWrongMarketOfferedService, 'getExtraWarningModel').mockClear();

      // Act
      service['showPopupConfirmSave'](saveRequestArg);

      // Assert
      expect(spyWarningTakenNote).not.toHaveBeenCalled();
      expect(spyExtraWarning).not.toHaveBeenCalled();
      expect(saveRequestArg.confirmAddRequest.isOpen).toBe(true);
    });
  });

  describe('initAddRequestQuery', () => {
    it('should initialize query with correct properties', () => {
      // Arrange
      const saveRequestArg = createSaveRequestArg();
      saveRequestArg.primitiveProps.transInfoAddRequestModel = {
        transInfoJson: 'json',
        unMarkTransIds: '1,2',
        markTransIds: '3,4',
        removeTransIds: ''
      } as TransInfoAddRequestModel;
      saveRequestArg.filter.issueTypeId = '1';
      saveRequestArg.filter.isTest = true;
      saveRequestArg.filter.action = 'action';
      saveRequestArg.filter.isVoided = false;
      saveRequestArg.filter.subIssueTypeId = '2';
      saveRequestArg.others.mistakenBy = 'user1';
      saveRequestArg.others.decidedBy = 'user2';
      saveRequestArg.others.remark = 'remark';

      // Act
      const result = service['initAddRequestQuery'](saveRequestArg);

      // Assert
      expect(result).toBeInstanceOf(AddRequestQuery);
      expect(result.transInfoJson).toBe('json');
      expect(result.unMarkTransIds).toBe('1,2');
      expect(result.markTransIds).toBe('3,4');
      expect(result.issueTypeId).toBe('1');
      expect(result.isTest).toBe(true);
      expect(result.actionId).toBe('action');
      expect(result.isVoided).toBe(false);
      expect(result.mistakenBy).toBe('user1');
      expect(result.decidedBy).toBe('user2');
      expect(result.remark).toBe('remark');
      expect(eventWrongMarketOfferedService.getWrongMarketOfferedModel).toHaveBeenCalledWith(2, saveRequestArg.logInfoEvent);
    });

    it('should not set wrongMarketOfferedInfo when isVoided is true', () => {
      // Arrange
      const saveRequestArg = createSaveRequestArg();
      saveRequestArg.filter.isVoided = true;

      // Act
      const result = service['initAddRequestQuery'](saveRequestArg);

      // Assert
      expect(result.wrongMarketOfferedInfo).toBeUndefined();
      expect(eventWrongMarketOfferedService.getWrongMarketOfferedModel).not.toHaveBeenCalled();
    });
  });

  describe('executeSaveRequestApi', () => {
    it('should call addRequestService.executeSaveRequest with correct parameters', async () => {
      // Arrange
      const saveRequestArg = createSaveRequestArg();
      jest.spyOn(service as any, 'initAddRequestQuery').mockReturnValue(new AddRequestQuery());

      // Act
      await service['executeSaveRequestApi'](saveRequestArg);

      // Assert
      expect(service['initAddRequestQuery']).toHaveBeenCalledWith(saveRequestArg);
      expect(addRequestService.executeSaveRequest).toHaveBeenCalledWith(
        saveRequestArg.isEdit,
        saveRequestArg.requestId,
        expect.any(AddRequestQuery),
        saveRequestArg.addRequestStore
      );
    });
  });
});

// Helper function to create a SaveRequestArg object with default values
function createSaveRequestArg(): SaveRequestArg {
  const saveRequestArg = new SaveRequestArg();
  saveRequestArg.requestId = 1;
  saveRequestArg.userId = 1;
  saveRequestArg.requestedBy = 'test';
  saveRequestArg.isEdit = false;
  saveRequestArg.actionIdOfFirstTimeAccess = '1';
  saveRequestArg.filter = new FilterModel();
  saveRequestArg.filter.isVoided = false;
  saveRequestArg.others = new OthersModel();
  saveRequestArg.primitiveProps = new PrimitivePropertyEvent();
  saveRequestArg.primitiveProps.isShowValidation = true;
  saveRequestArg.primitiveProps.transInfoAddRequestModel = new TransInfoAddRequestModel();
  saveRequestArg.logInfoEvent = {
    matchId: 1,
    filterWrongMarketOfferedModels: [],
    logInfoItems: [
      {
        id: 1,
        filterTime: {} as FilterWrongMarketOfferedModel,
        logInfoDetail: {
          matchId: 1,
          liveScores: '1-0',
          voidFromTime: new Date('2023-01-01'),
          voidToTime: new Date('2023-01-02'),
          transVoidToTime: new Date('2023-01-02'),
          singleCount: 0,
          cashOutCount: 0,
          settleCount: 0,
          instantlySettleCount: 0,
          mainParlayCount: 0,
          cancelCashOutCount: 0,
          scoreNormalTicket: '',
          scoreOfMatch: '',
          minTransId: '',
          actionType: '',
          isHasWarningRangeTime: false
        } as LogInfoDetail,
        messageValidationLogInfo: [],
        betTypeCount: []
      }
    ],
    betTeamsResult: [],
    allBetTypesSelection: []
  } as LogInfoWrongMarketOffered;
  saveRequestArg.eventLeagueComponent = {} as EventLeagueComponent;
  saveRequestArg.filterTimeComponent = {} as FilterTimeComponent;
  saveRequestArg.advancedModeComponent = {} as AdvancedModeAddRequestComponent;
  saveRequestArg.addRequestStore = TestBed.inject(AddRequestStore);
  saveRequestArg.confirmAddRequest = new ConfirmAddRequestModel();
  
  return saveRequestArg;
}
