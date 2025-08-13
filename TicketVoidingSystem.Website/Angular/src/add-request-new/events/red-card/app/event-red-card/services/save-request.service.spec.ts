import { QueryList } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { jest } from '@jest/globals';
import moment from 'moment-timezone';
import { EventLeagueComponent } from '../../../../../../utility/components/event-league/event-league.component';
import { DateTimeFormat } from '../../../../../../utility/constants/config';
import { TEXT } from '../../../../../../utility/constants/text';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { CommonService } from '../../../../../../utility/services/common.service';
import { HttpService } from '../../../../../../utility/services/http.service';
import { ConfirmAddRequestModel } from '../../../../../component/confirm-add-request/confirm-add-request.model';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { LogInfoRelatedEventComponent } from '../../../../../component/log-info-related-event/log-info-related-event.component';
import { LogInfoRelatedEvent } from '../../../../../component/log-info-related-event/log-info-related-event.model';
import { PrimitiveProperty } from '../../../../../component/log-info-related-event/primitive-property.model';
import { OthersModel } from '../../../../../component/others/others.model';
import { TvDetectionComponent } from '../../../../../component/tv-detection/tv-detection.component';
import { AddRequestService } from '../../../../services/add-request.service';
import { AddRequestStore } from '../../../../services/add-request.store';
import { PopupService } from '../../../../services/popup.service';
import { FilterTimeWithAllowance } from '../filter-time-with-allowance/filter-time-with-allowance.model';
import { LogInfoService } from './log-info.service';
import { SaveRequestArg } from './save-request.model';
import { SaveRequestService } from './save-request.service';
import { ValidationService } from './validation.service';

// Mock StaticService
jest.mock('../../../../../utility/services/static.service', () => ({
  StaticService: {
    isEditingByAnotherUser: jest.fn().mockReturnValue(false),
    isHasWarningTakenNote: jest.fn().mockReturnValue(false),
    isShowVarCheck: jest.fn().mockReturnValue(false)
  }
}));

describe('SaveRequestService', () => {
  let service: SaveRequestService;
  let validationService: ValidationService;
  let logInfoService: LogInfoService;
  let popupService: PopupService;
  let addRequestStore: AddRequestStore;
  let addRequestService: AddRequestService;

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
        AddRequestService
      ]
    });

    service = TestBed.inject(SaveRequestService);
    validationService = TestBed.inject(ValidationService);
    logInfoService = TestBed.inject(LogInfoService);
    popupService = TestBed.inject(PopupService);
    addRequestStore = TestBed.inject(AddRequestStore);
    addRequestService = TestBed.inject(AddRequestService);

    addRequestStore.changeSavingRequestStatus = jest.fn();
    addRequestStore.changeBlockingUiStatus = jest.fn();

    jest.spyOn(validationService, 'validateCommonData').mockReturnValue(true);
    jest.spyOn(validationService, 'isAllEventsValid').mockReturnValue(true);
    jest.spyOn(logInfoService, 'getLogInfo').mockResolvedValue();
    jest.spyOn(logInfoService, 'resetLogInfoOfEvent');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('recheckLogInfoBeforeSaveRequest', () => {
    it('should return true when all validations pass', async () => {
      // Arrange
      const saveRequestArg = createSaveRequestArg();

      // Act
      const result = await service.recheckLogInfoBeforeSaveRequest(saveRequestArg);

      // Assert
      expect(result).toBeTruthy();
      expect(validationService.validateCommonData).toHaveBeenCalled();
      expect(validationService.isAllEventsValid).toHaveBeenCalled();
      expect(logInfoService.getLogInfo).toHaveBeenCalled();
      expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
    });

    it('should return false when common data validation fails', async () => {
      // Arrange
      const saveRequestArg = createSaveRequestArg();
      jest.spyOn(validationService, 'validateCommonData').mockReturnValue(false);

      // Act
      const result = await service.recheckLogInfoBeforeSaveRequest(saveRequestArg);

      // Assert
      expect(result).toBeFalsy();
      expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
    });

    it('should return false when events validation fails', async () => {
      // Arrange
      const saveRequestArg = createSaveRequestArg();
      jest.spyOn(validationService, 'isAllEventsValid').mockReturnValue(false);

      // Act
      const result = await service.recheckLogInfoBeforeSaveRequest(saveRequestArg);

      // Assert
      expect(result).toBeFalsy();
      expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
    });
  });

  describe('saveRequest', () => {
    it('should show popup confirm when data is valid', async () => {
      // Arrange
      const saveRequestArg = createSaveRequestArg();
      jest.spyOn(service as any, 'showPopupConfirmSave');

      // Act
      await service.saveRequest(saveRequestArg);

      // Assert
      expect(service['showPopupConfirmSave']).toHaveBeenCalledWith(saveRequestArg);
    });

    it('should not show popup when data is invalid', async () => {
      // Arrange
      const saveRequestArg = createSaveRequestArg();
      jest.spyOn(service as any, 'recheckLogInfoBeforeSaveRequest').mockResolvedValue(false);
      jest.spyOn(service as any, 'showPopupConfirmSave');

      // Act
      await service.saveRequest(saveRequestArg);

      // Assert
      expect(service['showPopupConfirmSave']).not.toHaveBeenCalled();
      expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(false);
    });
  });

  describe('onClickConfirmSave', () => {
    it('should execute save request when data is valid', async () => {
      // Arrange
      const saveRequestArg = createSaveRequestArg();
      jest.spyOn(service as any, 'executeSaveRequestApi');

      // Act
      await service.onClickConfirmSave(saveRequestArg);

      // Assert
      expect(service['executeSaveRequestApi']).toHaveBeenCalledWith(saveRequestArg);
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    });

    it('should show error when data is invalid', async () => {
      // Arrange
      const saveRequestArg = createSaveRequestArg();
      jest.spyOn(service as any, 'recheckLogInfoBeforeSaveRequest').mockResolvedValue(false);
      jest.spyOn(popupService, 'showError');

      // Act
      await service.onClickConfirmSave(saveRequestArg);

      // Assert
      expect(popupService.showError).toHaveBeenCalledWith(TEXT.INVALID_DATA_IN_REQUEST);
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    });
  });

  describe('executeSaveRequestApi', () => {
    it('should call addRequestService.executeSaveRequest with correct parameters', async () => {
      // Arrange
      const saveRequestArg = createSaveRequestArg();
      jest.spyOn(addRequestService, 'executeSaveRequest');

      // Act
      await service['executeSaveRequestApi'](saveRequestArg);

      // Assert
      expect(addRequestService.executeSaveRequest).toHaveBeenCalledWith(
        saveRequestArg.isEdit,
        saveRequestArg.requestId,
        expect.any(Object),
        saveRequestArg.addRequestStore
      );
    });
  });
});

function createSaveRequestArg(): SaveRequestArg {
  const saveRequestArg = new SaveRequestArg();
  saveRequestArg.requestId = 1;
  saveRequestArg.userId = 1;
  saveRequestArg.requestedBy = 'test';
  saveRequestArg.isEdit = false;
  saveRequestArg.actionIdOfFirstTimeAccess = '1';
  saveRequestArg.filter = new FilterModel();
  saveRequestArg.others = new OthersModel();
  saveRequestArg.primitiveProps = new PrimitiveProperty();

  const event = new LogInfoRelatedEvent();
  event.messageValidationLogInfo = [];
  event.isMainMatch = true;
  event.voidTimeArea = {
    fromDateTime: moment().format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
    toDateTime: moment().format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
    aaTime: 0,
    paTime: 0,
    saTime: 0
  };
  saveRequestArg.allEvents = [event];

  saveRequestArg.eventLeagueComponent = {} as EventLeagueComponent;
  saveRequestArg.tvDetectionComponent = {} as TvDetectionComponent;
  saveRequestArg.logInfoComponents = new QueryList<LogInfoRelatedEventComponent>();
  const mockLogInfoComponent = {
    filterTimeWithAllowanceComponent: {
      updateData: jest.fn()
    },
    showValidationDetail: jest.fn()
  } as unknown as LogInfoRelatedEventComponent;
  saveRequestArg.logInfoComponents.reset([mockLogInfoComponent]);
  saveRequestArg.addRequestStore = TestBed.inject(AddRequestStore);
  saveRequestArg.defaultFilterTimeWithAllowance = {
    fromDateTime: moment().format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
    toDateTime: moment().format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
    aaTime: 0,
    paTime: 0,
    saTime: 0
  } as FilterTimeWithAllowance;
  saveRequestArg.confirmRedCard = {
    isOpen: false,
    requestId: 1,
    userId: 1,
    requestedBy: 'test',
    extraWarningModel: {},
    isEditingByAnotherUser: false,
    isHasWarningTakenNote: false,
    isHasSettledTicket: false,
    isHasWarningTicket: false,
    isShowSubIssueType: false
  } as ConfirmAddRequestModel;

  return saveRequestArg;
}
