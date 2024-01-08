import { AddRequestService } from '../../add-request.service';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { RecoverTicketModel } from '../../models/recover-ticket.model';
import { OthersModel } from '../../others/others.model';
import { PopupService } from '../../services/popup.service';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { ValidationBusinessRuleOutput } from '../models/validation.model';
import { SaveRequestService } from './save-request.service';
import { ValidationService } from './validation.service';

class Helper {
  static readonly fakeFilterModel: FilterModel = {
    sportType: 1,
    eventDate: '',
    issueTypeId: '11',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isChangeSubTypeManual: true,
    isAbnormal: false
  };
  static readonly fakeSaveRequestArg: SaveRequestArg = {
    requestId: 1111,
    isEdit: false,
    transIds: '',
    filter: Helper.fakeFilterModel,
    recoverTicketModel: new RecoverTicketModel(),
    others: new OthersModel(),
    addRequestStore: new AddRequestStore(),
    filterBy: null,
    primitiveProps: new PrimitiveProperty,
    betIdsComponent: null
  };
}
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

  it('#proceedSaveRequest should showConfirm', async () => {
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.addRequestStore = new AddRequestStore();
    saveRequestArg.addRequestStore.changeSavingRequestStatus = jest.fn();
    service['proceedSaveRequest'] = jest.fn();

    const validationService = new ValidationService(null);
    const popupService = new PopupService(null);
    const spyShowConfirm = jest.spyOn(popupService, 'showConfirm').mockImplementation(() => {});

    const saveRequestService = new SaveRequestService(null, validationService, popupService);
    saveRequestService['getMessageConfirmation'] = jest.fn().mockImplementation(() => 'aaa');
    saveRequestService['onClickConfirmSave'] = jest.fn();

    saveRequestService['proceedSaveRequest'](saveRequestArg);

    expect(saveRequestService['getMessageConfirmation']).toHaveBeenCalledTimes(1);

    expect(spyShowConfirm.mock.calls[0][0]).toEqual('aaa');
    expect(spyShowConfirm.mock.calls[0][1]).toBeInstanceOf(Function);
    expect(spyShowConfirm.mock.calls[0][2]).toBeInstanceOf(Function);

    spyShowConfirm.mock.calls[0][1]();
    expect(saveRequestService['onClickConfirmSave']).toHaveBeenCalledTimes(1);

    spyShowConfirm.mock.calls[0][2]();
    expect(saveRequestArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
  });

  it('#getMessageConfirmation should return expected msg when add request', async () => {
    const expected = 'Bet ticket(s) will be recovered and resettled immediately.'
    + `<div class='mg-top-10'><i class="fa fa-question-circle text-confirm"></i> ARE YOU SURE YOU WANT TO PROCESS WITH ABOVE INFO?</div>`;
    const actual = service['getMessageConfirmation']();

    expect(actual).toBe(expected);
  });

  it('#executeSaveRequestApi should called #executeSaveRequest', async () => {
    const addRequestStore = new AddRequestStore();
    addRequestStore.changeBlockingUiStatus = jest.fn();
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.recoverTicketModel = new RecoverTicketModel();
    saveRequestArg.isEdit = false;
    saveRequestArg.filter = new FilterModel();
    saveRequestArg.filter.isVoided = true;
    saveRequestArg.primitiveProps = new PrimitiveProperty();
    saveRequestArg.others = new OthersModel();
    saveRequestArg.addRequestStore = addRequestStore;
    const validationService = new ValidationService(null);
    const addRequestService = new AddRequestService(null, null, null);
    const spyExecuteSaveRequest = jest.spyOn(addRequestService, 'executeSaveRequest').mockImplementation();
    const saveRequestService = new SaveRequestService(addRequestService, validationService, null);
    await saveRequestService.executeSaveRequestApi(saveRequestArg);

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
    const saveRequestService = new SaveRequestService(null, null, popupService);
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


  it('#initAddRequestQuery should return expected model', async () => {
    const args = Helper.fakeSaveRequestArg;
    args.filter.isVoided = false;
    args.recoverTicketModel = new RecoverTicketModel();
    const result = service['initAddRequestQuery'](args);

    expect(result.issueTypeId).toEqual(args.filter.issueTypeId);
    expect(result.actionId).toEqual(args.filter.action);
    expect(result.isTest).toEqual(args.filter.isTest);
    expect(result.isVoided).toEqual(args.filter.isVoided);
    expect(result.mistakenBy).toEqual(args.others.mistakenBy);
  });

  it('#recheckBeforeSaveRequest should called #validationService.checkBusinessRule', async () => {
    const addRequestStore = new AddRequestStore();
    addRequestStore.changeBlockingUiStatus = jest.fn();
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.addRequestStore = addRequestStore;
    saveRequestArg.primitiveProps = new PrimitiveProperty();
    const mockValidationResult = new ValidationBusinessRuleOutput();
    mockValidationResult.isValid = true;
    const validationService = new ValidationService(null);
    validationService.checkBusinessRule = jest.fn().mockReturnValue(mockValidationResult);
    const saveRequestService = new SaveRequestService(null, validationService, null);

    const actual = await saveRequestService['recheckBeforeSaveRequest'](saveRequestArg);

    expect(validationService.checkBusinessRule).toHaveBeenCalledTimes(1);
    expect(actual).toBeTruthy();
  });
});
