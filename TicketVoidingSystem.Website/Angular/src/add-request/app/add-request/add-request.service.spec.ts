import { Result } from '../../../utility/models/result';
import { CommonService } from '../../../utility/services/common.service';
import { AddRequestApiService } from './add-request-api.service';
import { AddRequestService } from './add-request.service';
import { AddRequestStore } from './add-request.store';
import { AddRequestQuery } from './models/add-request.query';
import { AddRequestResultModel } from './models/request.model';
import { PopupService } from './services/popup.service';
import { HttpService } from '../../../utility/services/http.service';

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
    let addRequestStore = new AddRequestStore();
    let httpService = new HttpService(null);
    addRequestStore.changeSavingRequestStatus = jest.fn();
    let query = new AddRequestQuery();
    const fakeFunctionGetTimeFilterTicket = jest.fn().mockReturnValue(1);
    let addRequestApiService = new AddRequestApiService(httpService);
    addRequestApiService.addRequest = jest.fn().mockReturnValue(new Result<AddRequestResultModel>());
    const fakeFunctionHandleAfterAddRequest = jest.fn();
    let service = new AddRequestService(addRequestApiService, null, null);
    service['getTimeFilterTicket'] = fakeFunctionGetTimeFilterTicket;
    service['handleAfterAddRequest'] = fakeFunctionHandleAfterAddRequest;

    await service['addRequest'](query, addRequestStore);

    expect(fakeFunctionGetTimeFilterTicket).toHaveBeenCalledTimes(1);
    expect(fakeFunctionHandleAfterAddRequest).toHaveBeenCalledTimes(1);
  });

  it('#addRequest should call getAddResultCache when AddedRequest not Successful', async () => {
    let addRequestStore = new AddRequestStore();
    let httpService = new HttpService(null);
    addRequestStore.changeSavingRequestStatus = jest.fn();
    let query = new AddRequestQuery();
    const fakeFunctionGetTimeFilterTicket = jest.fn().mockReturnValue(1);
    let addRequestApiService = new AddRequestApiService(httpService);
    addRequestApiService.addRequest = jest.fn().mockReturnValue(null);
    const fakeFunctionHandleAfterAddRequest = jest.fn();
    const fakeFunctionGetAddResultCache = jest.fn();
    let service = new AddRequestService(addRequestApiService, null, null);
    service['getTimeFilterTicket'] = fakeFunctionGetTimeFilterTicket;
    service['getAddResultCache'] = fakeFunctionGetTimeFilterTicket;
    service['handleAfterAddRequest'] = fakeFunctionHandleAfterAddRequest;
    service['getAddResultCache'] = fakeFunctionGetAddResultCache;

    await service['addRequest'](query, addRequestStore);

    expect(fakeFunctionGetAddResultCache).toHaveBeenCalledTimes(1);
    expect(fakeFunctionHandleAfterAddRequest).toHaveBeenCalledTimes(0);
  });

  it('#editRequest should call #showEditedRequestSuccessful', async () => {
    let addRequestStore = new AddRequestStore();
    let httpService = new HttpService(null);
    addRequestStore.changeSavingRequestStatus = jest.fn();
    let query = new AddRequestQuery();
    query.issueTypeId = "11";
    let addRequestApiService = new AddRequestApiService(httpService);
    addRequestApiService.editRequest = jest.fn().mockReturnValue({isSuccessful: true} as Result<AddRequestResultModel>);
    let popupService = new PopupService(null);
    const fakeShowEditedRequestSuccessful = jest.fn();
    popupService.showEditedRequestSuccessful = fakeShowEditedRequestSuccessful;
    const fakeFunctionHandleAfterAddRequest = jest.fn();
    let service = new AddRequestService(addRequestApiService, popupService, null);

    service['handleAfterAddRequest'] = fakeFunctionHandleAfterAddRequest;

    await service['editRequest'](query, addRequestStore);

    expect(fakeShowEditedRequestSuccessful).toHaveBeenCalledTimes(1);
  });

  it('#editRequest should call #showSaveRequestError when editRequest has error', async () => {
    let addRequestStore = new AddRequestStore();
    let httpService = new HttpService(null);
    addRequestStore.changeSavingRequestStatus = jest.fn();
    let query = new AddRequestQuery();
    query.issueTypeId = "11";
    let addRequestApiService = new AddRequestApiService(httpService);
    addRequestApiService.editRequest = jest.fn().mockReturnValue({isSuccessful: false} as Result<AddRequestResultModel>);
    let popupService = new PopupService(null);
    const fakeShowEditedRequestSuccessful = jest.fn();
    popupService.showEditedRequestSuccessful = fakeShowEditedRequestSuccessful;
    const fakeShowSaveRequestError = jest.fn();
    popupService.showSaveRequestError = fakeShowSaveRequestError;
    const fakeFunctionHandleAfterAddRequest = jest.fn();
    let service = new AddRequestService(addRequestApiService, popupService, null);

    service['handleAfterAddRequest'] = fakeFunctionHandleAfterAddRequest;

    await service['editRequest'](query, addRequestStore);

    expect(fakeShowEditedRequestSuccessful).toHaveBeenCalledTimes(0);
    expect(fakeShowSaveRequestError).toHaveBeenCalledTimes(1);
  });
});
