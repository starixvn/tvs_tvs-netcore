import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { AddRequestService } from '../../add-request.service';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { OthersModel } from '../../others/others.model';
import { PopupService } from '../../services/popup.service';
import { ReducedOverBetType } from '../models/bet-type-reduced-over-json.model';
import { LogInfoReducedOver } from '../models/log-info-reduced-over.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { EventReducedOverService } from './event-reduced-over.service';
import { LogInfoService } from './log-info.service';
import { SaveRequestService } from './save-request.service';
import { ValidationService } from './validation.service';

class Helper {
  static readonly fakeReducedOverBetTypes: ReducedOverBetType[] = [
    {
      betTypeId: 1,
      betTypeName: '',
      isHasOverWicket: true,
      isHasPlayer: true,
      isHasRuns: true,
      parentId: 0,
      items: []
    },
    {
      betTypeId: 2,
      betTypeName: '',
      isHasOverWicket: true,
      isHasPlayer: true,
      isHasRuns: true,
      parentId: 0,
      items: []
    }
  ];
  static readonly fakeLogInfoReducedOver: LogInfoReducedOver = {
    matchId: 1,
    filterReducedOvers: [],
    logInfoDetail: new LogInfoDetail(),
    messageValidationLogInfo: []
  };
}

describe('SaveRequestService', () => {
  let service: SaveRequestService;

  beforeEach(() => {
    service = new SaveRequestService(null, null, null, null, null);
  });

  it('#saveRequest should called #proceedSaveRequest', async () => {
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.addRequestStore = new AddRequestStore();
    saveRequestArg.addRequestStore.changeBlockingUiStatus = jest.fn();
    saveRequestArg.addRequestStore.changeSavingRequestStatus = jest.fn();
    saveRequestArg.filter = new FilterModel();
    saveRequestArg.filter.isVoided = true;
    service['proceedSaveRequest'] = jest.fn();

    await service.saveRequest(saveRequestArg);

    expect(saveRequestArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
    expect(service['proceedSaveRequest']).toHaveBeenCalledTimes(1);
  });

  it('#saveRequest should not called #proceedSaveRequest', async () => {
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.addRequestStore = new AddRequestStore();
    saveRequestArg.addRequestStore.changeBlockingUiStatus = jest.fn();
    saveRequestArg.addRequestStore.changeSavingRequestStatus = jest.fn();
    saveRequestArg.filter = new FilterModel();
    saveRequestArg.filter.isVoided = false;
    service['proceedSaveRequest'] = jest.fn();
    service['recheckLogInfoBeforeSaveRequest'] = jest.fn().mockImplementation(() => Promise.resolve(false));

    await service.saveRequest(saveRequestArg);

    expect(saveRequestArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
    expect(saveRequestArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
    expect(service['proceedSaveRequest']).toHaveBeenCalledTimes(0);
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

  it('#proceedSaveRequest should showConfirm', async () => {
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.addRequestStore = new AddRequestStore();
    saveRequestArg.addRequestStore.changeSavingRequestStatus = jest.fn();
    service['proceedSaveRequest'] = jest.fn();

    const validationService = new ValidationService();
    validationService.checkCanShowConfirmationReducedOver = jest.fn().mockImplementation(() => true);

    const popupService = new PopupService(null);
    const spyShowConfirm = jest.spyOn(popupService, 'showConfirm').mockImplementation(() => {});

    const saveRequestService = new SaveRequestService(validationService, null, popupService, null, null);
    saveRequestService['getMessageConfirmationReducedOver'] = jest.fn().mockImplementation(() => 'aaa');
    saveRequestService['onClickConfirmSave'] = jest.fn();

    saveRequestService['proceedSaveRequest'](saveRequestArg);

    expect(validationService.checkCanShowConfirmationReducedOver).toHaveBeenCalledTimes(1);
    expect(saveRequestService['getMessageConfirmationReducedOver']).toHaveBeenCalledTimes(1);

    expect(spyShowConfirm.mock.calls[0][0]).toEqual('aaa');
    expect(spyShowConfirm.mock.calls[0][1]).toBeInstanceOf(Function);
    expect(spyShowConfirm.mock.calls[0][2]).toBeInstanceOf(Function);

    spyShowConfirm.mock.calls[0][1]();
    expect(saveRequestService['onClickConfirmSave']).toHaveBeenCalledTimes(1);

    spyShowConfirm.mock.calls[0][2]();
    expect(saveRequestArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
  });

  it('#proceedSaveRequest should called #executeSaveRequestApi', async () => {
    const saveRequestArg = new SaveRequestArg();
    const validationService = new ValidationService();
    validationService.checkCanShowConfirmationReducedOver = jest.fn().mockImplementation(() => false);

    const saveRequestService = new SaveRequestService(validationService, null, null, null, null);
    saveRequestService['executeSaveRequestApi'] = jest.fn();

    saveRequestService['proceedSaveRequest'](saveRequestArg);

    expect(validationService.checkCanShowConfirmationReducedOver).toHaveBeenCalledTimes(1);
    expect(saveRequestService['executeSaveRequestApi']).toHaveBeenCalledTimes(1);
  });

  it('#getMessageConfirmation should return expected msg', async () => {
    const expected = '<div class=\"text-red\">The request has settled ticket(s).</div>'
    + '<div>There are some warnings in this request.'
    + '</div><div>Ticket(s) on request will be unmarked.</div>'
    + '<div style=\"color:red\">Please remind this request undefined is confirmed by undefined.</div><div class=\'mg-top-10\'>'
    + '<i class="fa fa-question-circle text-confirm"></i> ARE YOU SURE YOU WANT TO PROCESS WITH ABOVE INFO?</div>';
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.userId = 11111;
    saveRequestArg.isEdit = true;
    saveRequestArg.filter = new FilterModel();
    saveRequestArg.filter.action = '2';
    saveRequestArg.actionIdOfFirstTimeAccess = '5';
    saveRequestArg.logInfoEvent = Helper.fakeLogInfoReducedOver;
    saveRequestArg.logInfoEvent.logInfoDetail.settleCount = 1;
    saveRequestArg.logInfoEvent.messageValidationLogInfo.push({ isError: false, reason: 'aaa'});
    const element = document.createElement('section');
    element.setAttribute("user-id", "1");
    document.getElementById = jest.fn().mockImplementation(() => element);

    const actual = service['getMessageConfirmationReducedOver'](saveRequestArg);

    expect(actual).toBe(expected);
  });

  it('#getMessageConfirmationReducedOver should return expected msg', async () => {
    const expected = '<div class=\'mg-top-10\'><i class="fa fa-question-circle text-confirm"></i> ARE YOU SURE YOU WANT TO PROCESS WITH ABOVE INFO?</div>';
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.isEdit = false;
    saveRequestArg.logInfoEvent = new LogInfoReducedOver();
    saveRequestArg.logInfoEvent.messageValidationLogInfo = null;

    const actual = service['getMessageConfirmationReducedOver'](saveRequestArg);

    expect(actual).toBe(expected);
  });

  it('#executeSaveRequestApi should called #executeSaveRequest', async () => {
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.isEdit = false;
    saveRequestArg.logInfoEvent = new LogInfoReducedOver();
    saveRequestArg.filter = new FilterModel();
    saveRequestArg.filter.isVoided = true;
    saveRequestArg.primitiveProps = new PrimitivePropertyEvent();
    saveRequestArg.others = new OthersModel();
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

  it('#initAddRequestQuery should called #eventReducedOverService.getReducedOverModel', async () => {
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.isEdit = false;
    saveRequestArg.logInfoEvent = new LogInfoReducedOver();
    saveRequestArg.filter = new FilterModel();
    saveRequestArg.filter.isVoided = false;
    saveRequestArg.primitiveProps = new PrimitivePropertyEvent();
    saveRequestArg.primitiveProps.transInfoAddRequestModel = new TransInfoAddRequestModel();
    saveRequestArg.others = new OthersModel();
    const eventReducedOverService = new EventReducedOverService();
    const spyGetReducedOverModel = jest.spyOn(eventReducedOverService, 'getReducedOverModel').mockImplementation();
    const saveRequestService = new SaveRequestService(null, null, null, null, eventReducedOverService);

    saveRequestService['initAddRequestQuery'](saveRequestArg);

    expect(spyGetReducedOverModel).toHaveBeenCalledTimes(1);
  });
});
