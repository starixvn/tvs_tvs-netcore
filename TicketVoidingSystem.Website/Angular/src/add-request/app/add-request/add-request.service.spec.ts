import { LABELS } from '../../../utility/constants/labels';
import { Result } from '../../../utility/models/result';
import { CommonService } from '../../../utility/services/common.service';
import { AddRequestApiService } from './add-request-api.service';
import { AddRequestService, EarlyKickOffService } from './add-request.service';
import { AddRequestStore } from './add-request.store';
import { FilterModel } from './filter/filter.model';
import { AddRequestQuery } from './models/add-request.query';
import { EventDetailModel } from './models/event-detail.model';
import { AddRequestResultModel, RequestModel } from './models/request.model';
import { OthersModel } from './others/others.model';
import { PopupService } from './services/popup.service';

class Helper {
  static readonly url = 'http://localhost:60196/';
  static readonly fakeAddRequestResultModel: AddRequestResultModel = {
    requestId: 1111,
    matchId: ''
  };
  static readonly fakeResultSuccessful: Result<AddRequestResultModel> = {
    isSuccessful: true,
    errorCode: null,
    errorMsg: 'Error...',
    data: Helper.fakeAddRequestResultModel,
  };
  static readonly fakeResultError: Result<AddRequestResultModel> = {
    isSuccessful: false,
    errorCode: 1,
    errorMsg: 'Error',
  };
}

jest.mock('../../../utility/services/http.service');
describe('AppService', () => {
  let mockAddRequestApiService: AddRequestApiService;
  let mockAddRequestService: AddRequestService;
  let mockPopupService: PopupService;
  let mockCommonService: CommonService;

  beforeEach(() => {
    mockAddRequestApiService = new AddRequestApiService(null);
    mockPopupService = new PopupService(null);
    mockCommonService = new CommonService(null);
    mockAddRequestService = new AddRequestService(mockAddRequestApiService, mockPopupService, mockCommonService);
  });

  it('#executeSaveRequest should call #editRequest', async () => {
    mockAddRequestService['editRequest'] = jest.fn();
    await mockAddRequestService.executeSaveRequest(true, 111, new AddRequestQuery(), null);

    expect(mockAddRequestService['editRequest']).toHaveBeenCalledTimes(1);
  });

  it('#executeSaveRequest should call #addRequest', async () => {
    mockAddRequestService['addRequest'] = jest.fn();
    await mockAddRequestService.executeSaveRequest(false, 111, new AddRequestQuery(), null);

    expect(mockAddRequestService['addRequest']).toHaveBeenCalledTimes(1);
  });

  it('#addRequest should call #showAddedRequestSuccessful', async () => {
    const mockAddRequestStore = new AddRequestStore();
    mockAddRequestStore.changeSavingRequestStatus = jest.fn();
    const spyAddRequestServiceAddRequest = jest.spyOn(mockAddRequestApiService, 'addRequest').mockImplementation(() => Promise.resolve(Helper.fakeResultSuccessful));
    const spyPopupServiceShowAddedRequestSuccessful = jest.spyOn(mockPopupService, 'showAddedRequestSuccessful').mockImplementation();
    Object.defineProperty(window, 'location', {
      value: new URL(Helper.url)
    });
    window.location.reload = jest.fn();
    window.location.assign = jest.fn();
    mockAddRequestService = new AddRequestService(mockAddRequestApiService, mockPopupService, mockCommonService);
    await mockAddRequestService['addRequest'](new AddRequestQuery(), '17', mockAddRequestStore);

    expect(spyAddRequestServiceAddRequest).toHaveBeenCalledTimes(1);
    expect(spyPopupServiceShowAddedRequestSuccessful).toHaveBeenCalledTimes(1);
    expect(spyPopupServiceShowAddedRequestSuccessful.mock.calls[0][0]).toEqual(Helper.fakeResultSuccessful.data.requestId);
    expect(spyPopupServiceShowAddedRequestSuccessful.mock.calls[0][1]).toBeInstanceOf(Function);
    spyPopupServiceShowAddedRequestSuccessful.mock.calls[0][1]();
    expect(window.location.assign).toHaveBeenCalledTimes(1);
  });

  it('#addRequest should call #showSaveRequestError', async () => {
    const mockAddRequestStore = new AddRequestStore();
    mockAddRequestStore.changeSavingRequestStatus = jest.fn();
    const spyAddRequestServiceAddRequest = jest.spyOn(mockAddRequestApiService, 'addRequest').mockImplementation(() => Promise.resolve(Helper.fakeResultError));
    const spyPopupServiceShowSaveRequestError = jest.spyOn(mockPopupService, 'showSaveRequestError').mockImplementation();
    Object.defineProperty(window, 'location', {
      value: new URL(Helper.url)
    });
    window.location.reload = jest.fn();
    mockAddRequestService = new AddRequestService(mockAddRequestApiService, mockPopupService, mockCommonService);

    await mockAddRequestService['addRequest'](new AddRequestQuery(), '1', mockAddRequestStore);

    expect(spyAddRequestServiceAddRequest).toHaveBeenCalledTimes(1);
    expect(spyPopupServiceShowSaveRequestError).toHaveBeenCalledTimes(1);
    expect(spyPopupServiceShowSaveRequestError.mock.calls[0][0]).toEqual(Helper.fakeResultError.errorMsg);
    expect(spyPopupServiceShowSaveRequestError.mock.calls[0][1]).toEqual(LABELS.ADD_REQUEST_RESULT_TITLE);
  });

  it('#editRequest should call #showEditedRequestSuccessful', async () => {
    const fakeAddRequestQuery = new AddRequestQuery();
    fakeAddRequestQuery.requestId = 1111;
    const mockAddRequestStore = new AddRequestStore();
    mockAddRequestStore.changeSavingRequestStatus = jest.fn();
    const spyAddRequestServiceEditRequest = jest.spyOn(mockAddRequestApiService, 'editRequest').mockImplementation(() => Promise.resolve(Helper.fakeResultSuccessful));
    const spyPopupServiceShowEditedRequestSuccessful = jest.spyOn(mockPopupService, 'showEditedRequestSuccessful').mockImplementation();
    Object.defineProperty(window, 'location', {
      value: new URL(Helper.url)
    });
    window.location.reload = jest.fn();
    window.location.assign = jest.fn();
    mockAddRequestService = new AddRequestService(mockAddRequestApiService, mockPopupService, mockCommonService);

    await mockAddRequestService['editRequest'](fakeAddRequestQuery, mockAddRequestStore);

    expect(spyAddRequestServiceEditRequest).toHaveBeenCalledTimes(1);
    expect(spyPopupServiceShowEditedRequestSuccessful).toHaveBeenCalledTimes(1);
    expect(spyPopupServiceShowEditedRequestSuccessful.mock.calls[0][0]).toEqual(Helper.fakeResultSuccessful.data.requestId);
    expect(spyPopupServiceShowEditedRequestSuccessful.mock.calls[0][1]).toBeInstanceOf(Function);
    spyPopupServiceShowEditedRequestSuccessful.mock.calls[0][1]();
    expect(window.location.assign).toHaveBeenCalledTimes(1);
  });

  it('#editRequest should call #showSaveRequestError', async () => {
    const mockAddRequestStore = new AddRequestStore();
    mockAddRequestStore.changeSavingRequestStatus = jest.fn();
    const spyAddRequestServiceEditRequest = jest.spyOn(mockAddRequestApiService, 'editRequest').mockImplementation(() => Promise.resolve(Helper.fakeResultError));
    const spyPopupServiceShowError = jest.spyOn(mockPopupService, 'showSaveRequestError').mockImplementation();
    mockAddRequestService = new AddRequestService(mockAddRequestApiService, mockPopupService, mockCommonService);

    await mockAddRequestService['editRequest'](new AddRequestQuery(), mockAddRequestStore);

    expect(spyAddRequestServiceEditRequest).toHaveBeenCalledTimes(1);
    expect(spyPopupServiceShowError).toHaveBeenCalledTimes(1);
    expect(spyPopupServiceShowError.mock.calls[0][0]).toEqual(Helper.fakeResultError.errorMsg);
    expect(spyPopupServiceShowError.mock.calls[0][1]).toEqual(LABELS.EDIT_REQUEST_RESULT_TITLE);
  });

  it('#EarlyKickOffService.initAddRequestQuery should return correct model', async () => {
    const fakeRequestModel = new RequestModel();
    fakeRequestModel.filter = new FilterModel();
    fakeRequestModel.eventDetail = new EventDetailModel();
    fakeRequestModel.others = new OthersModel();

    const actual = EarlyKickOffService.initAddRequestQuery(fakeRequestModel, null);

    expect(actual.issueTypeId).toBe(fakeRequestModel.filter.issueTypeId);
    expect(actual.subIssueTypeId).toBe(fakeRequestModel.filter.subIssueTypeId);
    expect(actual.actionId).toBe(fakeRequestModel.filter.action);
    expect(actual.decidedBy).toBe(fakeRequestModel.others.decidedBy);
    expect(actual.remark).toBe(fakeRequestModel.others.remark);
    expect(actual.mistakenBy).toBe(fakeRequestModel.others.mistakenBy);
  });
});
