import { TestBed } from '@angular/core/testing';
import { TEXT } from '../../utility/constants/text';
import { Result } from '../../utility/models/result';
import { TestingModule } from '../../utility/modules/testing.module';
import { CommonService } from '../../utility/services/common.service';
import { AddRequestQuery } from '../models/add-request.query';
import { AddRequestResultModel } from '../models/request.model';
import { AddRequestApiService } from './add-request-api.service';
import { AddRequestService } from './add-request.service';
import { AddRequestStore } from './add-request.store';
import { PopupService } from './popup.service';

describe('AddRequestService', () => {
  let service: AddRequestService;
  let addRequestApiService: AddRequestApiService;
  let popupService: PopupService;
  let commonService: CommonService;
  let addRequestStore: AddRequestStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        AddRequestService,
        AddRequestApiService,
        PopupService,
        CommonService,
        AddRequestStore
      ]
    });

    service = TestBed.inject(AddRequestService);
    addRequestApiService = TestBed.inject(AddRequestApiService);
    popupService = TestBed.inject(PopupService);
    commonService = TestBed.inject(CommonService);
    addRequestStore = TestBed.inject(AddRequestStore);

    // Mock các function
    addRequestStore.changeSavingRequestStatus = jest.fn();
    commonService.getResultCache = jest.fn();
    popupService.showSaveRequestError = jest.fn();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('executeSaveRequest', () => {
    it('should call editRequest when isEdit is true', async () => {
      // Arrange
      const isEdit = true;
      const requestId = 123;
      const query = {} as AddRequestQuery;
      service['editRequest'] = jest.fn();

      // Act
      await service.executeSaveRequest(isEdit, requestId, query, addRequestStore);

      // Assert
      expect(service['editRequest']).toHaveBeenCalledWith(query, addRequestStore);
      expect(query.requestId).toBe(requestId);
    });

    it('should call addRequest when isEdit is false', async () => {
      // Arrange
      const isEdit = false;
      const requestId = 123;
      const query = {} as AddRequestQuery;
      service['addRequest'] = jest.fn();

      // Act
      await service.executeSaveRequest(isEdit, requestId, query, addRequestStore);

      // Assert
      expect(service['addRequest']).toHaveBeenCalledWith(query, addRequestStore);
    });
  });

  describe('addRequest', () => {
    it('should handle successful add request', async () => {
      // Arrange
      const query = {} as AddRequestQuery;
      const mockResult = {
        isSuccessful: true,
        data: {} as AddRequestResultModel,
        errorCode: '',
        errorMsg: '',
        severity: 0
      } as unknown as Result<AddRequestResultModel>;
      addRequestApiService['addRequest'] = jest.fn().mockResolvedValue(mockResult);
      service['handleAfterAddRequest'] = jest.fn();

      // Act
      await service['addRequest'](query, addRequestStore);

      // Assert
      expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
      expect(query.guid).toMatch(/^AddRequest-/);
      expect(service['handleAfterAddRequest']).toHaveBeenCalledWith(query, mockResult, addRequestStore);
    });

    it('should get result from cache when API returns null', async () => {
      // Arrange
      const query = {} as AddRequestQuery;
      addRequestApiService['addRequest'] = jest.fn().mockResolvedValue(null);
      service['getAddResultCache'] = jest.fn();

      // Act
      await service['addRequest'](query, addRequestStore);

      // Assert
      expect(service['getAddResultCache']).toHaveBeenCalledWith(query, addRequestStore);
    });
  });

  describe('getAddResultCache', () => {
    it('should clear interval when result is found', async () => {
      // Arrange
      const query = { guid: 'test-guid' } as AddRequestQuery;
      const mockResult = {
        isSuccessful: true,
        data: {} as AddRequestResultModel,
        errorCode: '',
        errorMsg: '',
        severity: 0
      } as unknown as Result<AddRequestResultModel>;
      commonService['getResultCache'] = jest.fn().mockResolvedValue(mockResult);
      jest.useFakeTimers();

      // Act
      service['getAddResultCache'](query, addRequestStore);
      jest.advanceTimersByTime(2000);

      // Assert
      expect(commonService.getResultCache).toHaveBeenCalledWith(query.guid);
    });
  });

  it('should show error popup when unsuccessful', () => {
    // Arrange
    const query = {} as AddRequestQuery;
    const result = {
      isSuccessful: false,
      data: {} as AddRequestResultModel,
      errorCode: 'ERROR',
      errorMsg: 'Error message',
      severity: 1
    } as unknown as Result<AddRequestResultModel>;
    popupService['showSaveRequestError'] = jest.fn();

    // Act
    service['handleAfterAddRequest'](query, result, addRequestStore);

    // Assert
    expect(popupService['showSaveRequestError']).toHaveBeenCalledWith(
      query,
      result,
      TEXT.ADD_REQUEST_RESULT_TITLE
    );
    expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalled();
  });

  it('should handle failed edit request', async () => {
    // Arrange
    const query = {} as AddRequestQuery;
    const mockResult = {
      isSuccessful: false,
      data: {} as AddRequestResultModel,
      errorCode: 'ERROR',
      errorMsg: 'Error message',
      severity: 1
    } as unknown as Result<AddRequestResultModel>;
    addRequestApiService['editRequest'] = jest.fn().mockResolvedValue(mockResult);
    popupService['showSaveRequestError'] = jest.fn();
    addRequestStore.changeSavingRequestStatus = jest.fn();
    // Act
    await service['editRequest'](query, addRequestStore);

    // Assert
    expect(popupService['showSaveRequestError']).toHaveBeenCalledWith(
      query,
      mockResult,
      TEXT.EDIT_REQUEST_RESULT_TITLE
    );
    expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalled();
  });
});
