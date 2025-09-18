import { TestBed } from '@angular/core/testing';
import { jest } from '@jest/globals';
import { EventLeagueComponent } from '../../../../../../utility/components/event-league/event-league.component';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { CommonService } from '../../../../../../utility/services/common.service';
import { HttpService } from '../../../../../../utility/services/http.service';
import { StaticService } from '../../../../../../utility/services/static.service';
import { ConfirmAddRequestModel } from '../../../../../component/confirm-add-request/confirm-add-request.model';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { OthersModel } from '../../../../../component/others/others.model';
import { AddRequestStore } from '../../../../../services/add-request.store';
import { PopupService } from '../../../../../services/popup.service';
import { LogInfoWrongHdpComponent } from '../log-info-wrong-hdp/log-info-wrong-hdp.component';
import { LogInfoWrongHdp } from '../models/log-info-wrong-hdp.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { EventWrongHdpService } from './event-wrong-hdp.service';
import { LogInfoService } from './log-info.service';
import { SaveRequestService } from './save-request.service';
import { ValidationService } from './validation.service';

describe('SaveRequestService', () => {
  let service: SaveRequestService;
  let validationService: ValidationService;
  let logInfoService: LogInfoService;
  let popupService: PopupService;
  let addRequestStore: AddRequestStore;

  const mockEventLeagueComponent = {
    isMatchIdValid: () => true
  };

  const mockLogInfoWrongHdpComponent = {
    filterWithHdpComponent: {
      isValid: () => true
    },
    logInfo: new LogInfoWrongHdp()
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
        EventWrongHdpService
      ]
    });

    service = TestBed.inject(SaveRequestService);
    validationService = TestBed.inject(ValidationService);
    logInfoService = TestBed.inject(LogInfoService);
    popupService = TestBed.inject(PopupService);
    addRequestStore = TestBed.inject(AddRequestStore);

    jest.spyOn(addRequestStore, 'changeSavingRequestStatus');
    jest.spyOn(addRequestStore, 'changeBlockingUiStatus');
    jest.spyOn(validationService, 'validateCommonData').mockReturnValue(true);
    jest.spyOn(validationService, 'isAllEventsValid').mockReturnValue(true);
    jest.spyOn(validationService, 'checkCanShowConfirmation').mockReturnValue(true);
    jest.spyOn(StaticService, 'isEditingByAnotherUser').mockReturnValue(false);
  });

  it('should be created', () => {
    // Arrange & Act
    const service = TestBed.inject(SaveRequestService);

    // Assert
    expect(service).toBeTruthy();
  });

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
    
    const event = new LogInfoWrongHdp();
    event.messageValidationLogInfo = [];
    saveRequestArg.allEvents = [event];
    
    const mainEvent = new LogInfoWrongHdp();
    mainEvent.messageValidationLogInfo = [];
    saveRequestArg.mainEvent = mainEvent;
    
    saveRequestArg.eventLeagueComponent = mockEventLeagueComponent as EventLeagueComponent;
    saveRequestArg.logInfoComponents = [mockLogInfoWrongHdpComponent as LogInfoWrongHdpComponent];
    saveRequestArg.addRequestStore = addRequestStore;

    jest.spyOn(logInfoService, 'getLogInfo').mockResolvedValue();

    // Act
    await service.recheckLogInfoBeforeSaveRequest(saveRequestArg);

    // Assert
    expect(validationService.validateCommonData).toHaveBeenCalled();
    expect(validationService.isAllEventsValid).toHaveBeenCalled();
    expect(logInfoService.getLogInfo).toHaveBeenCalled();
  });

  it('should save request', async () => {
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
    
    const event = new LogInfoWrongHdp();
    event.messageValidationLogInfo = [];
    saveRequestArg.allEvents = [event];
    
    const mainEvent = new LogInfoWrongHdp();
    mainEvent.messageValidationLogInfo = [];
    saveRequestArg.mainEvent = mainEvent;
    
    saveRequestArg.eventLeagueComponent = mockEventLeagueComponent as EventLeagueComponent;
    saveRequestArg.logInfoComponents = [mockLogInfoWrongHdpComponent as LogInfoWrongHdpComponent];
    saveRequestArg.addRequestStore = addRequestStore;
    saveRequestArg.confirmAddRequest = new ConfirmAddRequestModel();

    jest.spyOn(logInfoService, 'getLogInfo').mockResolvedValue();
    jest.spyOn(popupService, 'showConfirm');

    // Act
    await service.saveRequest(saveRequestArg);

    // Assert
    expect(validationService.validateCommonData).toHaveBeenCalled();
    expect(validationService.isAllEventsValid).toHaveBeenCalled();
    expect(logInfoService.getLogInfo).toHaveBeenCalled();
  });
});
