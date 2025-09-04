import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';
import { LogInfoService } from './log-info.service';
import { PopupService } from '../../services/popup.service';
import { SaveRequestService } from './save-request.service';
import { AddRequestStore } from '../../add-request.store';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { LogInfoEarlyKickOff } from '../models/log-info-eko.model';
import { FilterModel } from '../../filter/filter.model';
import { OthersModel } from '../../others/others.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { jest } from '@jest/globals';
import { CommonService } from '../../../../../utility/services/common.service';
import { HttpService } from '../../../../../utility/services/http.service';
import { EventEarlyKickOffService } from './event-eko.service';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { AddRequestService } from '../../add-request.service';
import { CheckAddPermissionService } from '../../services/check-permission.service';
import { GetLogInfoViewModel } from '../../models/get-log-info.model';
import { GetLogInfoModel } from '../../models/get-log-info.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { Validation } from '../../models/get-log-info.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { TEXT } from '../../../../../utility/constants/text';
import { OperatorType } from '../../others/others.model';
import { ConfirmEarlyKickOffModel } from '../confirm-eko/confirm-eko.model';

describe('SaveRequestService', () => {
  let service: SaveRequestService;
  let validationService: ValidationService;
  let logInfoService: LogInfoService;
  let popupService: PopupService;
  let addRequestStore: AddRequestStore;
  let addRequestService: AddRequestService;
  let checkPermissionService: CheckAddPermissionService;

  const mockEventLeagueComponent = {
    isMatchIdValid: () => true
  };

  const mockConfirmEarlyKickOff = {
    isOpenDialog: false,
    issueTypeName: 'Test Issue',
    actionName: 'Test Action',
    requestId: 0,
    requestedBy: '',
    isHasWarningEvent: false,
    isHasWarningEditTakeNoteRequest: false,
    isEditingByAnotherUser: false,
    isHasSettledTicket: false,
    warningRelatedEvents: []
  } as unknown as ConfirmEarlyKickOffModel;

  const mockIssueTypes = {
    issueTypes: [
      { issueTypeId: 1, issueTypeName: 'Test Issue' }
    ],
    subIssueTypes: [],
    issueId: 1,
    selectedSubIssueTypes: [],
    subIssueId: 1
  };

  const mockDateFullTimeNewComponent = {
    date: new Date(),
    dateFormat: 'yyyy-MM-dd',
    timeFormat: 'HH:mm:ss'
  } as any;

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
        EventEarlyKickOffService,
        AddRequestService,
        CheckAddPermissionService
      ]
    });

    service = TestBed.inject(SaveRequestService);
    validationService = TestBed.inject(ValidationService);
    logInfoService = TestBed.inject(LogInfoService);
    popupService = TestBed.inject(PopupService);
    addRequestStore = TestBed.inject(AddRequestStore);
    addRequestService = TestBed.inject(AddRequestService);
    checkPermissionService = TestBed.inject(CheckAddPermissionService);

    jest.spyOn(addRequestStore, 'changeSavingRequestStatus');
    jest.spyOn(addRequestStore, 'changeBlockingUiStatus');
    jest.spyOn(validationService, 'validateCommonData').mockReturnValue(true);
    jest.spyOn(validationService, 'isAllEventsValid').mockReturnValue(true);
    validationService['checkCanShowConfirmation'] = jest.fn().mockReturnValue(true);
    jest.spyOn(validationService, 'isEditingByAnotherUser').mockReturnValue(false);
    jest.spyOn(checkPermissionService, 'isAccountHasAddRequestPermission').mockReturnValue(true);
    jest.spyOn(popupService, 'showConfirm');
    jest.spyOn(popupService, 'showError');
    jest.spyOn(addRequestService, 'executeSaveRequest').mockResolvedValue();

    // Mock document.getElementById
    const mockElement = document.createElement('div');
    mockElement.setAttribute('user-id', '100');
    jest.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (id === 'body') {
        return mockElement;
      }
      return null;
    });
  });

  it('should be created', () => {
    // Arrange & Act
    const service = TestBed.inject(SaveRequestService);

    // Assert
    expect(service).toBeTruthy();
  });

  describe('saveRequest', () => {
    it('should call recheckLogInfoBeforeSaveRequest and show popup when data is valid', async () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.requestId = 1;
      saveRequestArg.userId = 1;
      saveRequestArg.requestedBy = 'test';
      saveRequestArg.isEdit = false;
      saveRequestArg.actionIdOfFirstTimeAccess = '1';
      saveRequestArg.filter = new FilterModel();
      saveRequestArg.filter.issueTypeId = '1';
      saveRequestArg.filter.action = TVSRequestActionType.TAKE_NOTE_ID.toString();
      saveRequestArg.filter.isVoided = false;
      saveRequestArg.others = new OthersModel();
      saveRequestArg.primitiveProps = new PrimitiveProperty();
      saveRequestArg.confirmEarlyKickOff = mockConfirmEarlyKickOff;
      saveRequestArg.issueTypes = mockIssueTypes;
      
      const event = new LogInfoEarlyKickOff();
      event.messageValidationLogInfo = [{ isError: false, reason: 'test reason' }];
      saveRequestArg.allEvents = [event];
      
      const mainEvent = new LogInfoEarlyKickOff();
      mainEvent.messageValidationLogInfo = [{ isError: false, reason: 'test reason' }];
      saveRequestArg.mainEvent = mainEvent;
      
      saveRequestArg.eventLeagueComponent = mockEventLeagueComponent as EventLeagueComponent;
      saveRequestArg.addRequestStore = addRequestStore;

      jest.spyOn(service, 'recheckLogInfoBeforeSaveRequest').mockResolvedValue(true);
      jest.spyOn(service as any, 'showPopupConfirmSave');

      // Act
      await service.saveRequest(saveRequestArg);

      // Assert
      expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
      expect(service.recheckLogInfoBeforeSaveRequest).toHaveBeenCalledWith(saveRequestArg);
      expect(service['showPopupConfirmSave']).toHaveBeenCalledWith(saveRequestArg);
    });

    it('should not show popup when data is invalid', async () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.requestId = 1;
      saveRequestArg.userId = 1;
      saveRequestArg.requestedBy = 'test';
      saveRequestArg.isEdit = false;
      saveRequestArg.actionIdOfFirstTimeAccess = '1';
      saveRequestArg.filter = new FilterModel();
      saveRequestArg.filter.issueTypeId = '1';
      saveRequestArg.filter.action = TVSRequestActionType.TAKE_NOTE_ID.toString();
      saveRequestArg.filter.isVoided = false;
      saveRequestArg.others = new OthersModel();
      saveRequestArg.primitiveProps = new PrimitiveProperty();
      saveRequestArg.confirmEarlyKickOff = mockConfirmEarlyKickOff;
      saveRequestArg.issueTypes = mockIssueTypes;
      
      const event = new LogInfoEarlyKickOff();
      event.messageValidationLogInfo = [{ isError: true, reason: 'test reason' }];
      saveRequestArg.allEvents = [event];
      
      const mainEvent = new LogInfoEarlyKickOff();
      mainEvent.messageValidationLogInfo = [{ isError: true, reason: 'test reason' }];
      saveRequestArg.mainEvent = mainEvent;
      
      saveRequestArg.eventLeagueComponent = mockEventLeagueComponent as EventLeagueComponent;
      saveRequestArg.addRequestStore = addRequestStore;

      jest.spyOn(service, 'recheckLogInfoBeforeSaveRequest').mockResolvedValue(false);
      jest.spyOn(service as any, 'showPopupConfirmSave');

      // Act
      await service.saveRequest(saveRequestArg);

      // Assert
      expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
      expect(service.recheckLogInfoBeforeSaveRequest).toHaveBeenCalledWith(saveRequestArg);
      expect(service['showPopupConfirmSave']).not.toHaveBeenCalled();
      expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(false);
    });

    it('should skip validation when filter.isVoided is true', async () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.requestId = 1;
      saveRequestArg.userId = 1;
      saveRequestArg.requestedBy = 'test';
      saveRequestArg.isEdit = false;
      saveRequestArg.actionIdOfFirstTimeAccess = '1';
      saveRequestArg.filter = new FilterModel();
      saveRequestArg.filter.issueTypeId = '1';
      saveRequestArg.filter.action = TVSRequestActionType.TAKE_NOTE_ID.toString();
      saveRequestArg.filter.isVoided = true;
      saveRequestArg.others = new OthersModel();
      saveRequestArg.primitiveProps = new PrimitiveProperty();
      saveRequestArg.confirmEarlyKickOff = mockConfirmEarlyKickOff;
      saveRequestArg.issueTypes = mockIssueTypes;
      
      const event = new LogInfoEarlyKickOff();
      event.messageValidationLogInfo = [{ isError: false, reason: 'test reason' }];
      saveRequestArg.allEvents = [event];
      
      const mainEvent = new LogInfoEarlyKickOff();
      mainEvent.messageValidationLogInfo = [{ isError: false, reason: 'test reason' }];
      saveRequestArg.mainEvent = mainEvent;
      
      saveRequestArg.eventLeagueComponent = mockEventLeagueComponent as EventLeagueComponent;
      saveRequestArg.addRequestStore = addRequestStore;

      jest.spyOn(service, 'recheckLogInfoBeforeSaveRequest').mockResolvedValue(false);
      jest.spyOn(service as any, 'showPopupConfirmSave');

      // Act
      await service.saveRequest(saveRequestArg);

      // Assert
      expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
      expect(service['showPopupConfirmSave']).toHaveBeenCalledWith(saveRequestArg);
    });
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
      
      const event = new LogInfoEarlyKickOff();
      event.messageValidationLogInfo = [{ isError: false, reason: 'test reason' }];
      saveRequestArg.allEvents = [event];
      
      const mainEvent = new LogInfoEarlyKickOff();
      mainEvent.messageValidationLogInfo = [{ isError: false, reason: 'test reason' }];
      saveRequestArg.mainEvent = mainEvent;
      
      saveRequestArg.eventLeagueComponent = mockEventLeagueComponent as EventLeagueComponent;
      saveRequestArg.addRequestStore = addRequestStore;
      saveRequestArg.kickOffTimeComponent = mockDateFullTimeNewComponent;

      const mockLogInfoResponse = {
        getLogInfoModels: [{
          matchId: 123,
          logInfoDetail: {} as LogInfoDetail,
          validation: {} as Validation
        } as GetLogInfoModel],
        transInfoAddRequestModel: {} as TransInfoAddRequestModel
      } as GetLogInfoViewModel;

      jest.spyOn(logInfoService, 'getLogInfo').mockResolvedValue(mockLogInfoResponse);
      jest.spyOn(logInfoService, 'assignResultLogInfoToEvents');
      jest.spyOn(logInfoService, 'resetLogInfoOfEvent');

      // Act
      const result = await service.recheckLogInfoBeforeSaveRequest(saveRequestArg);

      // Assert
      expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
      expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalledWith(saveRequestArg.allEvents);
      expect(validationService.validateCommonData).toHaveBeenCalledWith(
        saveRequestArg.eventLeagueComponent,
        saveRequestArg.kickOffTimeComponent
      );
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(logInfoService.getLogInfo).toHaveBeenCalled();
      expect(logInfoService.assignResultLogInfoToEvents).toHaveBeenCalled();
      expect(checkPermissionService.isAccountHasAddRequestPermission).toHaveBeenCalled();
      expect(saveRequestArg.primitiveProps.isShowLogInfoEvents).toBe(true);
      expect(validationService.isAllEventsValid).toHaveBeenCalledWith(saveRequestArg.allEvents);
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
      expect(result).toBe(true);
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
      
      const event = new LogInfoEarlyKickOff();
      event.messageValidationLogInfo = [{ isError: true, reason: 'test reason' }];
      saveRequestArg.allEvents = [event];
      
      const mainEvent = new LogInfoEarlyKickOff();
      mainEvent.messageValidationLogInfo = [{ isError: true, reason: 'test reason' }];
      saveRequestArg.mainEvent = mainEvent;
      
      saveRequestArg.eventLeagueComponent = mockEventLeagueComponent as EventLeagueComponent;
      saveRequestArg.addRequestStore = addRequestStore;
      saveRequestArg.kickOffTimeComponent = mockDateFullTimeNewComponent;

      jest.spyOn(validationService, 'validateCommonData').mockReturnValue(false);

      // Act
      const result = await service.recheckLogInfoBeforeSaveRequest(saveRequestArg);

      // Assert
      expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
      expect(validationService.validateCommonData).toHaveBeenCalledWith(
        saveRequestArg.eventLeagueComponent,
        saveRequestArg.kickOffTimeComponent
      );
      expect(result).toBe(false);
    });

    it('should return false when permission check fails', async () => {
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
      
      const event = new LogInfoEarlyKickOff();
      event.messageValidationLogInfo = [{ isError: false, reason: 'test reason' }];
      saveRequestArg.allEvents = [event];
      
      const mainEvent = new LogInfoEarlyKickOff();
      mainEvent.messageValidationLogInfo = [{ isError: false, reason: 'test reason' }];
      saveRequestArg.mainEvent = mainEvent;
      
      saveRequestArg.eventLeagueComponent = mockEventLeagueComponent as EventLeagueComponent;
      saveRequestArg.addRequestStore = addRequestStore;
      saveRequestArg.kickOffTimeComponent = mockDateFullTimeNewComponent;

      const mockLogInfoResponse = {
        getLogInfoModels: [{
          matchId: 123,
          logInfoDetail: {} as LogInfoDetail,
          validation: {} as Validation
        } as GetLogInfoModel],
        transInfoAddRequestModel: {} as TransInfoAddRequestModel
      } as GetLogInfoViewModel;

      jest.spyOn(logInfoService, 'getLogInfo').mockResolvedValue(mockLogInfoResponse);
      jest.spyOn(logInfoService, 'assignResultLogInfoToEvents');
      jest.spyOn(logInfoService, 'resetLogInfoOfEvent');
      jest.spyOn(checkPermissionService, 'isAccountHasAddRequestPermission').mockReturnValue(false);

      // Act
      const result = await service.recheckLogInfoBeforeSaveRequest(saveRequestArg);

      // Assert
      expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
      expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalledWith(saveRequestArg.allEvents);
      expect(validationService.validateCommonData).toHaveBeenCalledWith(
        saveRequestArg.eventLeagueComponent,
        saveRequestArg.kickOffTimeComponent
      );
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(logInfoService.getLogInfo).toHaveBeenCalled();
      expect(logInfoService.assignResultLogInfoToEvents).toHaveBeenCalled();
      expect(checkPermissionService.isAccountHasAddRequestPermission).toHaveBeenCalled();
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
      expect(result).toBe(false);
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
      
      const event = new LogInfoEarlyKickOff();
      event.messageValidationLogInfo = [{ isError: true, reason: 'test reason' }];
      saveRequestArg.allEvents = [event];
      
      const mainEvent = new LogInfoEarlyKickOff();
      mainEvent.messageValidationLogInfo = [{ isError: true, reason: 'test reason' }];
      saveRequestArg.mainEvent = mainEvent;
      
      saveRequestArg.eventLeagueComponent = mockEventLeagueComponent as EventLeagueComponent;
      saveRequestArg.addRequestStore = addRequestStore;
      saveRequestArg.kickOffTimeComponent = mockDateFullTimeNewComponent;

      const mockLogInfoResponse = {
        getLogInfoModels: [{
          matchId: 123,
          logInfoDetail: {} as LogInfoDetail,
          validation: {} as Validation
        } as GetLogInfoModel],
        transInfoAddRequestModel: {} as TransInfoAddRequestModel
      } as GetLogInfoViewModel;

      jest.spyOn(logInfoService, 'getLogInfo').mockResolvedValue(mockLogInfoResponse);
      jest.spyOn(logInfoService, 'assignResultLogInfoToEvents');
      jest.spyOn(logInfoService, 'resetLogInfoOfEvent');
      jest.spyOn(validationService, 'isAllEventsValid').mockReturnValue(false);

      // Act
      const result = await service.recheckLogInfoBeforeSaveRequest(saveRequestArg);

      // Assert
      expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
      expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalledWith(saveRequestArg.allEvents);
      expect(validationService.validateCommonData).toHaveBeenCalledWith(
        saveRequestArg.eventLeagueComponent,
        saveRequestArg.kickOffTimeComponent
      );
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(logInfoService.getLogInfo).toHaveBeenCalled();
      expect(logInfoService.assignResultLogInfoToEvents).toHaveBeenCalled();
      expect(checkPermissionService.isAccountHasAddRequestPermission).toHaveBeenCalled();
      expect(saveRequestArg.primitiveProps.isShowLogInfoEvents).toBe(true);
      expect(validationService.isAllEventsValid).toHaveBeenCalledWith(saveRequestArg.allEvents);
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
      expect(result).toBe(false);
    });
  });

  describe('onClickConfirmSave', () => {
    it('should execute save request when data is valid', async () => {
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
      
      const event = new LogInfoEarlyKickOff();
      event.messageValidationLogInfo = [{ isError: false, reason: 'test reason' }];
      saveRequestArg.allEvents = [event];
      
      const mainEvent = new LogInfoEarlyKickOff();
      mainEvent.messageValidationLogInfo = [{ isError: false, reason: 'test reason' }];
      saveRequestArg.mainEvent = mainEvent;
      saveRequestArg.confirmEarlyKickOff = mockConfirmEarlyKickOff;
      saveRequestArg.eventLeagueComponent = mockEventLeagueComponent as EventLeagueComponent;
      saveRequestArg.addRequestStore = addRequestStore;

      jest.spyOn(service, 'recheckLogInfoBeforeSaveRequest').mockResolvedValue(true);
      jest.spyOn(service as any, 'executeSaveRequestApi');

      // Act
      await service.onClickConfirmSave(saveRequestArg);

      // Assert
      expect(service.recheckLogInfoBeforeSaveRequest).toHaveBeenCalledWith(saveRequestArg);
      expect(service['executeSaveRequestApi']).toHaveBeenCalledWith(saveRequestArg);
    });

    it('should show error when data is invalid', async () => {
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
      
      const event = new LogInfoEarlyKickOff();
      event.messageValidationLogInfo = [{ isError: true, reason: 'test reason' }];
      saveRequestArg.allEvents = [event];
      
      const mainEvent = new LogInfoEarlyKickOff();
      mainEvent.messageValidationLogInfo = [{ isError: true, reason: 'test reason' }];
      saveRequestArg.mainEvent = mainEvent;
      
      saveRequestArg.eventLeagueComponent = mockEventLeagueComponent as EventLeagueComponent;
      saveRequestArg.addRequestStore = addRequestStore;

      jest.spyOn(service, 'recheckLogInfoBeforeSaveRequest').mockResolvedValue(false);
      jest.spyOn(service as any, 'executeSaveRequestApi');

      // Act
      await service.onClickConfirmSave(saveRequestArg);

      // Assert
      expect(service.recheckLogInfoBeforeSaveRequest).toHaveBeenCalledWith(saveRequestArg);
      expect(service['executeSaveRequestApi']).not.toHaveBeenCalled();
      expect(popupService.showError).toHaveBeenCalledWith(TEXT.INVALID_DATA_IN_REQUEST);
    });

    it('should skip validation when filter.isVoided is true', async () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.requestId = 1;
      saveRequestArg.userId = 1;
      saveRequestArg.requestedBy = 'test';
      saveRequestArg.isEdit = false;
      saveRequestArg.actionIdOfFirstTimeAccess = '1';
      saveRequestArg.filter = new FilterModel();
      saveRequestArg.filter.isVoided = true;
      saveRequestArg.others = new OthersModel();
      saveRequestArg.primitiveProps = new PrimitiveProperty();
      
      const event = new LogInfoEarlyKickOff();
      event.messageValidationLogInfo = [{ isError: false, reason: 'test reason' }];
      saveRequestArg.allEvents = [event];
      
      const mainEvent = new LogInfoEarlyKickOff();
      mainEvent.messageValidationLogInfo = [{ isError: false, reason: 'test reason' }];
      saveRequestArg.mainEvent = mainEvent;
      
      saveRequestArg.eventLeagueComponent = mockEventLeagueComponent as EventLeagueComponent;
      saveRequestArg.addRequestStore = addRequestStore;

      jest.spyOn(service, 'recheckLogInfoBeforeSaveRequest').mockResolvedValue(false);
      jest.spyOn(service as any, 'executeSaveRequestApi');

      // Act
      await service.onClickConfirmSave(saveRequestArg);

      // Assert
      expect(service['executeSaveRequestApi']).toHaveBeenCalledWith(saveRequestArg);
    });
  });

  describe('executeSaveRequestApi', () => {
    it('should execute save request API', async () => {
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
      
      const event = new LogInfoEarlyKickOff();
      event.messageValidationLogInfo = [{ isError: false, reason: 'test reason' }];
      saveRequestArg.allEvents = [event];
      
      const mainEvent = new LogInfoEarlyKickOff();
      mainEvent.messageValidationLogInfo = [{ isError: false, reason: 'test reason' }];
      saveRequestArg.mainEvent = mainEvent;
      
      saveRequestArg.eventLeagueComponent = mockEventLeagueComponent as EventLeagueComponent;
      saveRequestArg.addRequestStore = addRequestStore;

      jest.spyOn(service as any, 'initAddRequestQuery').mockReturnValue({});

      // Act
      await service['executeSaveRequestApi'](saveRequestArg);

      // Assert
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(service['initAddRequestQuery']).toHaveBeenCalledWith(saveRequestArg);
      expect(addRequestService.executeSaveRequest).toHaveBeenCalledWith(
        saveRequestArg.isEdit,
        saveRequestArg.requestId,
        {},
        saveRequestArg.addRequestStore
      );
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    });
  });

  describe('initAddRequestQuery', () => {
    it('should initialize add request query with correct values', () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.requestId = 1;
      saveRequestArg.userId = 1;
      saveRequestArg.requestedBy = 'test';
      saveRequestArg.isEdit = false;
      saveRequestArg.actionIdOfFirstTimeAccess = '1';
      saveRequestArg.filter = new FilterModel();
      saveRequestArg.filter.issueTypeId = '1';
      saveRequestArg.filter.action = '2';
      saveRequestArg.filter.isTest = true;
      saveRequestArg.filter.isVoided = false;
      saveRequestArg.filter.subIssueTypeId = '11';
      saveRequestArg.others = new OthersModel();
      saveRequestArg.others.mistakenBy = 'user1';
      saveRequestArg.others.operatorsList = [
        { matchId: 1, operatorId: 1, operatorType: OperatorType.TRADER, userName: 'Operator 1', groupName: 'Trader' },
        { matchId: 2, operatorId: 2, operatorType: OperatorType.SUSPENDER, userName: 'Operator 2', groupName: 'Suspender' }
      ];
      saveRequestArg.others.provider = 'provider1';
      saveRequestArg.others.source = 'source1';
      saveRequestArg.others.decidedBy = 'user2';
      saveRequestArg.others.remark = 'test remark';
      saveRequestArg.primitiveProps = new PrimitiveProperty();
      saveRequestArg.primitiveProps.transInfoAddRequestModel = {
        unMarkTransIds: '1,2,3',
        markTransIds: '4,5,6',
        removeTransIds: '7,8,9',
        transInfoJson: '{"key": "value"}'
      } as TransInfoAddRequestModel;
      
      const event = new LogInfoEarlyKickOff();
      event.messageValidationLogInfo = [{ isError: false, reason: 'test reason' }];
      event.isInvalidTotalTickets = false;
      event.matchId = 123;
      event.isMainMatch = true;
      event.kickOffTime = '2024-03-20T10:00:00';
      saveRequestArg.allEvents = [event];
      
      const mainEvent = new LogInfoEarlyKickOff();
      mainEvent.messageValidationLogInfo = [{ isError: false, reason: 'test reason' }];
      saveRequestArg.mainEvent = mainEvent;
      saveRequestArg.confirmEarlyKickOff = mockConfirmEarlyKickOff;
      saveRequestArg.eventLeagueComponent = mockEventLeagueComponent as EventLeagueComponent;
      saveRequestArg.addRequestStore = addRequestStore;

      // Act
      const result = service['initAddRequestQuery'](saveRequestArg);

      // Assert
      expect(result.issueTypeId).toBe('1');
      expect(result.unMarkTransIds).toBe('1,2,3');
      expect(result.markTransIds).toBe('4,5,6');
      expect(result.removeTransIds).toBe('7,8,9');
      expect(result.actionId).toBe('2');
      expect(result.isTest).toBe(true);
      expect(result.isVoided).toBe(false);
      expect(result.mistakenBy).toBe('user1');
      expect(result.operatorsList).toEqual([
        { matchId: 1, operatorId: 1, operatorType: OperatorType.TRADER, userName: 'Operator 1', groupName: 'Trader' },
        { matchId: 2, operatorId: 2, operatorType: OperatorType.SUSPENDER, userName: 'Operator 2', groupName: 'Suspender' }
      ]);
      expect(result.provider).toBe('provider1');
      expect(result.source).toBe('source1');
      expect(result.decidedBy).toBe('user2');
      expect(result.remark).toBe('test remark');
      expect(result.transInfoJson).toBe('{"key": "value"}');
      expect(result.earlyKickOffInfo).toHaveLength(1);
      expect(result.earlyKickOffInfo[0].matchId).toBe(123);
      expect(result.earlyKickOffInfo[0].isMainMatch).toBe(true);
      expect(result.earlyKickOffInfo[0].subIssueTypeId).toBe(11);
      expect(result.earlyKickOffInfo[0].kickOffTime).toBe('2024-03-20T10:00:00');
    });

    it('should not include earlyKickOffInfo when filter.isVoided is true', () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.requestId = 1;
      saveRequestArg.userId = 1;
      saveRequestArg.requestedBy = 'test';
      saveRequestArg.isEdit = false;
      saveRequestArg.actionIdOfFirstTimeAccess = '1';
      saveRequestArg.filter = new FilterModel();
      saveRequestArg.filter.issueTypeId = '1';
      saveRequestArg.filter.action = '2';
      saveRequestArg.filter.isTest = true;
      saveRequestArg.filter.isVoided = true;
      saveRequestArg.others = new OthersModel();
      saveRequestArg.primitiveProps = new PrimitiveProperty();
      saveRequestArg.primitiveProps.transInfoAddRequestModel = {
        unMarkTransIds: '1,2,3',
        markTransIds: '4,5,6',
        removeTransIds: '7,8,9',
        transInfoJson: '{"key": "value"}'
      } as TransInfoAddRequestModel;
      
      const event = new LogInfoEarlyKickOff();
      event.messageValidationLogInfo = [{ isError: false, reason: 'test reason' }];
      event.isInvalidTotalTickets = false;
      event.matchId = 123;
      event.isMainMatch = true;
      event.kickOffTime = '2024-03-20T10:00:00';
      saveRequestArg.allEvents = [event];
      
      const mainEvent = new LogInfoEarlyKickOff();
      mainEvent.messageValidationLogInfo = [{ isError: false, reason: 'test reason' }];
      saveRequestArg.mainEvent = mainEvent;
      
      saveRequestArg.eventLeagueComponent = mockEventLeagueComponent as EventLeagueComponent;
      saveRequestArg.addRequestStore = addRequestStore;

      // Act
      const result = service['initAddRequestQuery'](saveRequestArg);

      // Assert
      expect(result.issueTypeId).toBe('1');
      expect(result.unMarkTransIds).toBe('1,2,3');
      expect(result.markTransIds).toBe('4,5,6');
      expect(result.removeTransIds).toBe('7,8,9');
      expect(result.actionId).toBe('2');
      expect(result.isTest).toBe(true);
      expect(result.isVoided).toBe(true);
      expect(result.earlyKickOffInfo).toBeUndefined();
    });

    it('should filter out events with isInvalidTotalTickets', () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.requestId = 1;
      saveRequestArg.userId = 1;
      saveRequestArg.requestedBy = 'test';
      saveRequestArg.isEdit = false;
      saveRequestArg.actionIdOfFirstTimeAccess = '1';
      saveRequestArg.filter = new FilterModel();
      saveRequestArg.filter.issueTypeId = '1';
      saveRequestArg.filter.action = '2';
      saveRequestArg.filter.isTest = true;
      saveRequestArg.filter.isVoided = false;
      saveRequestArg.filter.subIssueTypeId = '11';
      saveRequestArg.others = new OthersModel();
      saveRequestArg.primitiveProps = new PrimitiveProperty();
      saveRequestArg.primitiveProps.transInfoAddRequestModel = {
        unMarkTransIds: '1,2,3',
        markTransIds: '4,5,6',
        removeTransIds: '7,8,9',
        transInfoJson: '{"key": "value"}'
      } as TransInfoAddRequestModel;
      
      const event1 = new LogInfoEarlyKickOff();
      event1.messageValidationLogInfo = [{ isError: false, reason: 'test reason' }];
      event1.isInvalidTotalTickets = false;
      event1.matchId = 123;
      event1.isMainMatch = true;
      event1.kickOffTime = '2024-03-20T10:00:00';
      
      const event2 = new LogInfoEarlyKickOff();
      event2.messageValidationLogInfo = [{ isError: true, reason: 'test reason' }];
      event2.isInvalidTotalTickets = true;
      event2.matchId = 456;
      event2.isMainMatch = false;
      event2.kickOffTime = '2024-03-20T11:00:00';
      
      saveRequestArg.allEvents = [event1, event2];
      
      const mainEvent = new LogInfoEarlyKickOff();
      mainEvent.messageValidationLogInfo = [{ isError: false, reason: 'test reason' }];
      saveRequestArg.mainEvent = mainEvent;
      
      saveRequestArg.eventLeagueComponent = mockEventLeagueComponent as EventLeagueComponent;
      saveRequestArg.addRequestStore = addRequestStore;
      saveRequestArg.confirmEarlyKickOff = mockConfirmEarlyKickOff;
      // Act
      const result = service['initAddRequestQuery'](saveRequestArg);

      // Assert
      expect(result.earlyKickOffInfo).toHaveLength(1);
      expect(result.earlyKickOffInfo[0].matchId).toBe(123);
      expect(result.earlyKickOffInfo[0].isMainMatch).toBe(true);
      expect(result.earlyKickOffInfo[0].subIssueTypeId).toBe(11);
      expect(result.earlyKickOffInfo[0].kickOffTime).toBe('2024-03-20T10:00:00');
    });
  });

  describe('getEarlyKickOffModel', () => {
    it('should create early kick off model with correct values', () => {
      // Arrange
      const event = new LogInfoEarlyKickOff();
      event.matchId = 123;
      event.isMainMatch = true;
      event.kickOffTime = '2024-03-20T10:00:00';
      const subIssueTypeId = '11';

      // Act
      const result = service.getEarlyKickOffModel(event, subIssueTypeId);

      // Assert
      expect(result.matchId).toBe(123);
      expect(result.isMainMatch).toBe(true);
      expect(result.subIssueTypeId).toBe(11);
      expect(result.kickOffTime).toBe('2024-03-20T10:00:00');
    });
  });

  describe('showPopupConfirmSave', () => {
    it('should show popup confirm save with correct values', () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.requestId = 1;
      saveRequestArg.userId = 1;
      saveRequestArg.requestedBy = 'test';
      saveRequestArg.isEdit = false;
      saveRequestArg.actionIdOfFirstTimeAccess = '1';
      saveRequestArg.filter = new FilterModel();
      saveRequestArg.filter.action = TVSRequestActionType.TAKE_NOTE_ID.toString();
      saveRequestArg.filter.isVoided = false;
      saveRequestArg.filter.issueTypeId = '1';
      saveRequestArg.others = new OthersModel();
      saveRequestArg.primitiveProps = new PrimitiveProperty();
      saveRequestArg.confirmEarlyKickOff = mockConfirmEarlyKickOff;
      saveRequestArg.issueTypes = mockIssueTypes;
      
      const event1 = new LogInfoEarlyKickOff();
      event1.messageValidationLogInfo = [{ isError: false, reason: 'test reason' }];
      event1.isInvalidTotalTickets = false;
      event1.matchId = 123;
      event1.isMainMatch = true;
      event1.kickOffTime = '2024-03-20T10:00:00';
      event1.eventName = 'Event 1';
      event1.isHasSettledTicket = false;
      
      const event2 = new LogInfoEarlyKickOff();
      event2.messageValidationLogInfo = [{ isError: false, reason: 'test reason' }];
      event2.isInvalidTotalTickets = true;
      event2.matchId = 456;
      event2.isMainMatch = false;
      event2.kickOffTime = '2024-03-20T11:00:00';
      event2.eventName = 'Event 2';
      event2.isHasSettledTicket = true;
      
      saveRequestArg.allEvents = [event1, event2];
      
      const mainEvent = new LogInfoEarlyKickOff();
      mainEvent.messageValidationLogInfo = [{ isError: false, reason: 'test reason' }];
      mainEvent.isInvalidTotalTickets = false;
      saveRequestArg.mainEvent = mainEvent;
      
      saveRequestArg.eventLeagueComponent = mockEventLeagueComponent as EventLeagueComponent;
      saveRequestArg.addRequestStore = addRequestStore;

      // Mock document.getElementById
      document.body.setAttribute('user-id', '100');

      // Act
      service['showPopupConfirmSave'](saveRequestArg);

      // Assert
      expect(saveRequestArg.confirmEarlyKickOff.warningRelatedEvents).toContain('Event 2');
      expect(saveRequestArg.confirmEarlyKickOff.isHasWarningEvent).toBe(true);
      expect(saveRequestArg.confirmEarlyKickOff.issueTypeName).toBe('Test Issue');
      expect(saveRequestArg.confirmEarlyKickOff.actionName).toBe('Take note');
      expect(saveRequestArg.confirmEarlyKickOff.requestId).toBe(1);
      expect(saveRequestArg.confirmEarlyKickOff.requestedBy).toBe('test');
      expect(saveRequestArg.confirmEarlyKickOff.isEditingByAnotherUser).toBe(false);
      expect(saveRequestArg.confirmEarlyKickOff.isHasSettledTicket).toBe(true);
      expect(saveRequestArg.confirmEarlyKickOff.isOpenDialog).toBe(true);
    });

    it('should set isHasWarningEditTakeNoteRequest to true when action is TAKE_NOTE_ID and different from actionIdOfFirstTimeAccess', () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.requestId = 1;
      saveRequestArg.userId = 1;
      saveRequestArg.requestedBy = 'test';
      saveRequestArg.isEdit = false;
      saveRequestArg.actionIdOfFirstTimeAccess = '1';
      saveRequestArg.filter = new FilterModel();
      saveRequestArg.filter.action = TVSRequestActionType.TAKE_NOTE_ID.toString();
      saveRequestArg.filter.isVoided = false;
      saveRequestArg.filter.issueTypeId = '1';
      saveRequestArg.others = new OthersModel();
      saveRequestArg.primitiveProps = new PrimitiveProperty();
      saveRequestArg.confirmEarlyKickOff = mockConfirmEarlyKickOff;
      saveRequestArg.issueTypes = mockIssueTypes;
      
      const event = new LogInfoEarlyKickOff();
      event.messageValidationLogInfo = [{ isError: false, reason: 'test reason' }];
      event.isInvalidTotalTickets = false;
      event.matchId = 123;
      event.isMainMatch = true;
      event.kickOffTime = '2024-03-20T10:00:00';
      event.eventName = 'Event 1';
      event.isHasSettledTicket = false;
      
      saveRequestArg.allEvents = [event];
      
      const mainEvent = new LogInfoEarlyKickOff();
      mainEvent.messageValidationLogInfo = [{ isError: false, reason: 'test reason' }];
      mainEvent.isInvalidTotalTickets = false;
      saveRequestArg.mainEvent = mainEvent;
      
      saveRequestArg.eventLeagueComponent = mockEventLeagueComponent as EventLeagueComponent;
      saveRequestArg.addRequestStore = addRequestStore;

      // Mock document.getElementById
      document.body.setAttribute('user-id', '100');

      // Act
      service['showPopupConfirmSave'](saveRequestArg);

      // Assert
      expect(saveRequestArg.confirmEarlyKickOff.isHasWarningEditTakeNoteRequest).toBe(true);
    });

    it('should not set warningRelatedEvents when filter.isVoided is true', () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.requestId = 1;
      saveRequestArg.userId = 1;
      saveRequestArg.requestedBy = 'test';
      saveRequestArg.isEdit = false;
      saveRequestArg.actionIdOfFirstTimeAccess = '1';
      saveRequestArg.filter = new FilterModel();
      saveRequestArg.filter.action = TVSRequestActionType.TAKE_NOTE_ID.toString();
      saveRequestArg.filter.isVoided = true;
      saveRequestArg.filter.issueTypeId = '1';
      saveRequestArg.others = new OthersModel();
      saveRequestArg.primitiveProps = new PrimitiveProperty();
      saveRequestArg.confirmEarlyKickOff = mockConfirmEarlyKickOff;
      saveRequestArg.issueTypes = mockIssueTypes;
      
      const event = new LogInfoEarlyKickOff();
      event.messageValidationLogInfo = [{ isError: false, reason: 'test reason' }];
      event.isInvalidTotalTickets = true;
      event.matchId = 123;
      event.isMainMatch = false;
      event.kickOffTime = '2024-03-20T10:00:00';
      event.eventName = 'Event 1';
      event.isHasSettledTicket = false;
      
      saveRequestArg.allEvents = [event];
      
      const mainEvent = new LogInfoEarlyKickOff();
      mainEvent.messageValidationLogInfo = [{ isError: false, reason: 'test reason' }];
      mainEvent.isInvalidTotalTickets = false;
      saveRequestArg.mainEvent = mainEvent;
      
      saveRequestArg.eventLeagueComponent = mockEventLeagueComponent as EventLeagueComponent;
      saveRequestArg.addRequestStore = addRequestStore;

      // Mock document.getElementById
      document.body.setAttribute('user-id', '100');

      // Act
      service['showPopupConfirmSave'](saveRequestArg);

      // Assert
      expect(saveRequestArg.confirmEarlyKickOff.warningRelatedEvents).toHaveLength(0);
    });
  });
});
