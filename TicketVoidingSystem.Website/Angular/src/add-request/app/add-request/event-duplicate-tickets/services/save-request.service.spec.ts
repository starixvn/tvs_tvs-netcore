import { AddRequestService } from '../../add-request.service';
import { AddRequestStore } from '../../add-request.store';
import { LeagueEventAbnormalComponent } from '../../event-abnormal-bet/league-event-abnormal/league-event-abnormal.component';
import { FilterModel } from '../../filter/filter.model';
import { DuplicateTicketsModel } from '../../models/event-duplicate-tickets.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { OthersModel } from '../../others/others.model';
import { PopupService } from '../../services/popup.service';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { SaveRequestService } from './save-request.service';
import { ValidationService } from './validation.service';

describe('SaveRequestService', () => {
  let service: SaveRequestService;

  beforeEach(() => {
    service = new SaveRequestService(null, null, null);
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

    expect(saveRequestArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
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
    service['recheckBeforeSaveRequest'] = jest.fn().mockImplementation(() => Promise.resolve(false));

    await service.saveRequest(saveRequestArg);

    expect(saveRequestArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(2);
    expect(service['proceedSaveRequest']).toHaveBeenCalledTimes(0);
  });

  it('#recheckBeforeSaveRequest should return false when does not pass validation', async () => {
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.addRequestStore = new AddRequestStore();
    saveRequestArg.addRequestStore.changeBlockingUiStatus = jest.fn();
    const validationService = new ValidationService(null);
    validationService.checkValidBusinessRule = jest.fn().mockImplementation(() => false);

    const saveRequestService = new SaveRequestService(null, null, validationService);

    const actual = await saveRequestService['recheckBeforeSaveRequest'](saveRequestArg);

    expect(saveRequestArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
    expect(validationService.checkValidBusinessRule).toHaveBeenCalledTimes(1);
    expect(actual).toBeFalsy();
  });

  it('#proceedSaveRequest should showConfirm', async () => {
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.addRequestStore = new AddRequestStore();
    saveRequestArg.addRequestStore.changeSavingRequestStatus = jest.fn();
    service['proceedSaveRequest'] = jest.fn();

    const validationService = new ValidationService(null);
    validationService.checkCanShowConfirmation = jest.fn().mockImplementation(() => true);

    const popupService = new PopupService(null);
    const spyShowConfirm = jest.spyOn(popupService, 'showConfirm').mockImplementation(() => {});

    const saveRequestService = new SaveRequestService(null, popupService, validationService);
    saveRequestService['getMessageConfirmation'] = jest.fn().mockImplementation(() => 'aaa');
    saveRequestService['onClickConfirmSave'] = jest.fn();

    saveRequestService['proceedSaveRequest'](saveRequestArg);

    expect(validationService.checkCanShowConfirmation).toHaveBeenCalledTimes(1);
    expect(saveRequestService['getMessageConfirmation']).toHaveBeenCalledTimes(1);

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
    const validationService = new ValidationService(null);
    validationService.checkCanShowConfirmation = jest.fn().mockImplementation(() => false);

    const saveRequestService = new SaveRequestService(null, null, validationService);
    saveRequestService['executeSaveRequestApi'] = jest.fn();

    saveRequestService['proceedSaveRequest'](saveRequestArg);

    expect(validationService.checkCanShowConfirmation).toHaveBeenCalledTimes(1);
    expect(saveRequestService['executeSaveRequestApi']).toHaveBeenCalledTimes(1);
  });

  it('#getMessageConfirmation should return expected msg when edit take note', async () => {
    const expected = `<div>Ticket(s) on request will be unmarked.</div><div class='mg-top-10'>`
    + `<i class="fa fa-question-circle text-confirm"></i> ARE YOU SURE YOU WANT TO PROCESS WITH ABOVE INFO?</div>`;
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.isEdit = true;
    saveRequestArg.filter = new FilterModel();
    saveRequestArg.filter.action = '2';
    saveRequestArg.actionIdOfFirstTimeAccess = '5';

    const actual = service['getMessageConfirmation'](saveRequestArg);

    expect(actual).toBe(expected);
  });

  it('#getMessageConfirmation should return expected msg when add request', async () => {
    const expected = `<div class='mg-top-10'><i class="fa fa-question-circle text-confirm"></i> ARE YOU SURE YOU WANT TO PROCESS WITH ABOVE INFO?</div>`;
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.isEdit = false;
    saveRequestArg.filter = new FilterModel();
    const actual = service['getMessageConfirmation'](saveRequestArg);

    expect(actual).toBe(expected);
  });

  it('#executeSaveRequestApi should called #executeSaveRequest', async () => {
    const addRequestStore = new AddRequestStore();
    addRequestStore.changeBlockingUiStatus = jest.fn();
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.duplicateTicketsModel = new DuplicateTicketsModel();
    saveRequestArg.duplicateTicketsModel.filterBy = 1;
    saveRequestArg.isEdit = false;
    saveRequestArg.filter = new FilterModel();
    saveRequestArg.filter.isVoided = true;
    saveRequestArg.primitiveProps = new PrimitiveProperty();
    saveRequestArg.others = new OthersModel();
    saveRequestArg.addRequestStore = addRequestStore;
    const validationService = new ValidationService(null);
    const addRequestService = new AddRequestService(null, null, null);
    validationService.isFilterMixParlay = jest.fn().mockReturnValue(true);
    const spyExecuteSaveRequest = jest.spyOn(addRequestService, 'executeSaveRequest').mockImplementation();
    const saveRequestService = new SaveRequestService(addRequestService, null, validationService);
    await saveRequestService['executeSaveRequestApi'](saveRequestArg);

    expect(spyExecuteSaveRequest).toHaveBeenCalledTimes(1);
  });

  it('#onClickConfirmSave should call #popupService.showError', async () => {
    const arg = new SaveRequestArg();
    arg.filter = new FilterModel();
    arg.filter.isVoided = false;
    arg.addRequestStore = new AddRequestStore();
    arg.addRequestStore.changeBlockingUiStatus = jest.fn();
    const popupService = new PopupService(null);
    const spyShowError = jest.spyOn(popupService, 'showError').mockImplementation(() => {});
    const saveRequestService = new SaveRequestService(null, popupService, null);
    saveRequestService['recheckBeforeSaveRequest'] = jest.fn().mockImplementation(() => Promise.resolve(false));

    await saveRequestService['onClickConfirmSave'](arg);

    expect(spyShowError).toHaveBeenCalledTimes(1);
  });

  it('#onClickConfirmSave should called #executeSaveRequestApi', async () => {
    const arg = new SaveRequestArg();
    arg.filter = new FilterModel();
    arg.filter.isVoided = true;
    arg.addRequestStore = new AddRequestStore();
    arg.addRequestStore.changeBlockingUiStatus = jest.fn();
    service['executeSaveRequestApi'] = jest.fn();

    await service['onClickConfirmSave'](arg);

    expect(service['executeSaveRequestApi']).toHaveBeenCalledTimes(1);
  });

  it('#initAddRequestQuery should return model has markTransIds', async () => {
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.isEdit = false;
    saveRequestArg.filter = new FilterModel();
    saveRequestArg.filter.isVoided = false;
    saveRequestArg.duplicateTicketsModel = new DuplicateTicketsModel();
    saveRequestArg.leagueEventComponent = new LeagueEventAbnormalComponent(null, null);
    saveRequestArg.primitiveProps = new PrimitiveProperty();
    saveRequestArg.primitiveProps.transInfoAddRequestModel = new TransInfoAddRequestModel();
    saveRequestArg.primitiveProps.transInfoAddRequestModel.markTransIds = '123,12';
    saveRequestArg.others = new OthersModel();
    const validationService = new ValidationService(null);
    const spyIsFilterMixParlay = jest.spyOn(validationService, 'isFilterMixParlay').mockReturnValue(false);
    const saveRequestService = new SaveRequestService(null, null, validationService);
    const query = saveRequestService['initAddRequestQuery'](saveRequestArg);

    expect(spyIsFilterMixParlay).toHaveBeenCalledTimes(5);
    expect(query.markTransIds).toBe('123,12');
  });
});
