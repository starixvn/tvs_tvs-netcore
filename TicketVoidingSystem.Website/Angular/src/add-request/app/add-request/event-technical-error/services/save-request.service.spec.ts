import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { MatchModel } from '../../../../../utility/models/match.model';
import { AddRequestService } from '../../add-request.service';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { OthersModel } from '../../others/others.model';
import { PopupService } from '../../services/popup.service';
import { LogInfoTechnicalError } from '../models/log-info-technical-error.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { EventTechnicalErrorService } from './event-technical-error.service';
import { LogInfoService } from './log-info.service';
import { SaveRequestService } from './save-request.service';
import { ValidationService } from './validation.service';

describe('SaveRequestService', () => {
  let service: SaveRequestService;

  beforeEach(() => {
    service = new SaveRequestService(null, null, null, null, null);
  });

  it('#saveRequest should not called #changeSavingRequestStatus', async () => {
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.addRequestStore = new AddRequestStore();
    saveRequestArg.addRequestStore.changeBlockingUiStatus = jest.fn();
    saveRequestArg.addRequestStore.changeSavingRequestStatus = jest.fn();
    saveRequestArg.filter = new FilterModel();
    saveRequestArg.filter.isVoided = false;
    service['recheckLogInfoBeforeSaveRequest'] = jest.fn().mockImplementation(() => Promise.resolve(false));

    await service.saveRequest(saveRequestArg);

    expect(saveRequestArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
    expect(saveRequestArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
  });

  it('#recheckLogInfoBeforeSaveRequest should return false when does not pass validation', async () => {
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.addRequestStore = new AddRequestStore();
    saveRequestArg.addRequestStore.changeSavingRequestStatus = jest.fn();
    const logInfoService = new LogInfoService(null, null);
    logInfoService.resetLogInfoOfEvent = jest.fn();
    const validationService = new ValidationService();
    validationService.validateCommonData = jest.fn().mockImplementation(() => false);

    const saveRequestService = new SaveRequestService(validationService, logInfoService, null, null, null);

    const actual = await saveRequestService.recheckLogInfoBeforeSaveRequest(saveRequestArg);

    expect(saveRequestArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
    expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(validationService.validateCommonData).toHaveBeenCalledTimes(1);
    expect(actual).toBeFalsy();
  });

  it('#recheckLogInfoBeforeSaveRequest should return true when #validationService.isValidLogInfoEvent true', async () => {
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.primitiveProps = new PrimitivePropertyEvent();
    saveRequestArg.addRequestStore = new AddRequestStore();
    saveRequestArg.addRequestStore.changeSavingRequestStatus = jest.fn();

    const logInfoService = new LogInfoService(null, null);
    logInfoService.resetLogInfoOfEvent = jest.fn();
    logInfoService.getLogInfo = jest.fn();

    const validationService = new ValidationService();
    validationService.validateCommonData = jest.fn().mockImplementation(() => true);
    validationService.isValidLogInfoEvent = jest.fn().mockImplementation(() => true);
    const saveRequestService = new SaveRequestService(validationService, logInfoService, null, null, null);

    const actual = await saveRequestService.recheckLogInfoBeforeSaveRequest(saveRequestArg);

    expect(saveRequestArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
    expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(validationService.validateCommonData).toHaveBeenCalledTimes(1);
    expect(logInfoService.getLogInfo).toHaveBeenCalledTimes(1);
    expect(actual).toBeTruthy();
  });

  it('#recheckLogInfoBeforeSaveRequest should return false when #validationService.isValidLogInfoEvent false', async () => {
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.primitiveProps = new PrimitivePropertyEvent();
    saveRequestArg.addRequestStore = new AddRequestStore();
    saveRequestArg.addRequestStore.changeSavingRequestStatus = jest.fn();

    const logInfoService = new LogInfoService(null, null);
    logInfoService.resetLogInfoOfEvent = jest.fn();
    logInfoService.getLogInfo = jest.fn();

    const validationService = new ValidationService();
    validationService.validateCommonData = jest.fn().mockImplementation(() => true);
    validationService.isValidLogInfoEvent = jest.fn().mockImplementation(() => false);
    const saveRequestService = new SaveRequestService(validationService, logInfoService, null, null, null);

    const actual = await saveRequestService.recheckLogInfoBeforeSaveRequest(saveRequestArg);

    expect(saveRequestArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
    expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(validationService.validateCommonData).toHaveBeenCalledTimes(1);
    expect(logInfoService.getLogInfo).toHaveBeenCalledTimes(1);
    expect(actual).toBeFalsy();
  });

  it('#executeSaveRequestApi should called #executeSaveRequest', async () => {
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.isEdit = false;
    saveRequestArg.logInfoEvent = new LogInfoTechnicalError();
    saveRequestArg.filter = new FilterModel();
    saveRequestArg.filter.isVoided = true;
    saveRequestArg.primitiveProps = new PrimitivePropertyEvent();
    saveRequestArg.others = new OthersModel();
    saveRequestArg.eventLeagueComponent = new EventLeagueComponent(null, null, null);
    saveRequestArg.eventLeagueComponent.selectedMatch = new MatchModel();
    const addRequestService = new AddRequestService(null, null, null);
    const spyExecuteSaveRequest = jest.spyOn(addRequestService, 'executeSaveRequest').mockImplementation();
    const saveRequestService = new SaveRequestService(null, null, null, addRequestService, null);

    await saveRequestService['executeSaveRequestApi'](saveRequestArg);

    expect(spyExecuteSaveRequest).toHaveBeenCalledTimes(1);
  });

  it('#onClickConfirmSave should not called #executeSaveRequestApi', async () => {
    const arg = new SaveRequestArg();
    arg.filter = new FilterModel();
    arg.filter.isVoided = false;
    arg.addRequestStore = new AddRequestStore();
    arg.addRequestStore.changeBlockingUiStatus = jest.fn();
    const popupService = new PopupService(null);
    const spyShowError = jest.spyOn(popupService, 'showError').mockImplementation(() => {});
    const saveRequestService = new SaveRequestService(null, null, popupService, null, null);
    saveRequestService['recheckLogInfoBeforeSaveRequest'] = jest.fn().mockImplementation(() => Promise.resolve(false));

    await saveRequestService['onClickConfirmSave'](arg);

    expect(spyShowError).toHaveBeenCalledTimes(1);
    expect(arg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
  });

  it('#onClickConfirmSave should called #executeSaveRequestApi', async () => {
    const arg = new SaveRequestArg();
    arg.filter = new FilterModel();
    arg.filter.isVoided = true;
    arg.addRequestStore = new AddRequestStore();
    arg.addRequestStore.changeBlockingUiStatus = jest.fn();
    service['executeSaveRequestApi'] = jest.fn();

    await service['onClickConfirmSave'](arg);

    expect(arg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
  });

  it('#initAddRequestQuery should called #eventTechnicalErrorService.getTechnicalErrorModel', async () => {
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.isEdit = false;
    saveRequestArg.logInfoEvent = new LogInfoTechnicalError();
    saveRequestArg.filter = new FilterModel();
    saveRequestArg.filter.isVoided = false;
    saveRequestArg.primitiveProps = new PrimitivePropertyEvent();
    saveRequestArg.primitiveProps.transInfoAddRequestModel = new TransInfoAddRequestModel();
    saveRequestArg.others = new OthersModel();
    saveRequestArg.eventLeagueComponent = new EventLeagueComponent(null, null, null);
    saveRequestArg.eventLeagueComponent.selectedMatch = new MatchModel();
    const eventTechnicalErrorService = new EventTechnicalErrorService();
    const spyGetTechnicalErrorModel = jest.spyOn(eventTechnicalErrorService, 'getTechnicalErrorModel').mockImplementation();
    const saveRequestService = new SaveRequestService(null, null, null, null, eventTechnicalErrorService);

    saveRequestService['initAddRequestQuery'](saveRequestArg);

    expect(spyGetTechnicalErrorModel).toHaveBeenCalledTimes(1);
  });
});
