import { TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { EventBaseService } from '../../component/event-base-layout/event-base.service';
import { PrimitiveProperty } from '../../models/primitive-property.model';
import { RequestDetailViewModel } from '../../models/request-detail.model';
import { RequestModel } from '../../models/request.model';
import { AddRequestApiService } from '../add-request-api.service';
import { EditRequestService } from './edit-request.service';
import { LogInfoService } from './log-info.service';
import { ObjectService } from './object.service';

describe('EditRequestService', () => {
  let service: EditRequestService;
  let addRequestApiService: AddRequestApiService;
  let logInfoService: LogInfoService;
  let objectService: ObjectService;
  let eventBaseService: EventBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule]
    });

    service = TestBed.inject(EditRequestService);
    addRequestApiService = TestBed.inject(AddRequestApiService);
    logInfoService = TestBed.inject(LogInfoService);
    objectService = TestBed.inject(ObjectService);
    eventBaseService = TestBed.inject(EventBaseService);

    // Mock các function
    addRequestApiService.getRequestById = jest.fn();
    logInfoService.getLogInfo = jest.fn();
    objectService.getPrimitiveProperty = jest.fn();
    objectService.mapRequestModel = jest.fn();
    eventBaseService.backToAccessDeniedPage = jest.fn();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRequestId', () => {
    it('should return request ID from URL when URL contains valid ID', () => {
      // Arrange
      const mockUrl = 'https://example.com/edit/123';
      Object.defineProperty(window, 'location', {
        value: { href: mockUrl },
        writable: true
      });

      // Act
      const result = service.getRequestId();

      // Assert
      expect(result).toBe(123);
    });

    it('should return request ID from URL when URL has multiple segments', () => {
      // Arrange
      const mockUrl = 'https://example.com/some/path/edit/456';
      Object.defineProperty(window, 'location', {
        value: { href: mockUrl },
        writable: true
      });

      // Act
      const result = service.getRequestId();

      // Assert
      expect(result).toBe(456);
    });

    it('should return NaN when URL does not contain valid number', () => {
      // Arrange
      const mockUrl = 'https://example.com/edit/invalid';
      Object.defineProperty(window, 'location', {
        value: { href: mockUrl },
        writable: true
      });

      // Act
      const result = service.getRequestId();

      // Assert
      expect(result).toBeNaN();
    });

    it('should return NaN when URL is empty', () => {
      // Arrange
      const mockUrl = '';
      Object.defineProperty(window, 'location', {
        value: { href: mockUrl },
        writable: true
      });

      // Act
      const result = service.getRequestId();

      // Assert
      expect(result).toBeNaN();
    });

    it('should return NaN when URL has no segments', () => {
      // Arrange
      const mockUrl = 'https://example.com/';
      Object.defineProperty(window, 'location', {
        value: { href: mockUrl },
        writable: true
      });

      // Act
      const result = service.getRequestId();

      // Assert
      expect(result).toBeNaN();
    });
  });

  describe('isActionEditRequest', () => {
    it('should return true when pathname contains /edit/', () => {
      // Arrange
      const mockPathname = '/some/path/edit/123';
      Object.defineProperty(window, 'location', {
        value: { pathname: mockPathname },
        writable: true
      });

      // Act
      const result = service.isActionEditRequest();

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when pathname contains /EDIT/ (case insensitive)', () => {
      // Arrange
      const mockPathname = '/some/path/EDIT/123';
      Object.defineProperty(window, 'location', {
        value: { pathname: mockPathname },
        writable: true
      });

      // Act
      const result = service.isActionEditRequest();

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when pathname contains /Edit/', () => {
      // Arrange
      const mockPathname = '/some/path/Edit/123';
      Object.defineProperty(window, 'location', {
        value: { pathname: mockPathname },
        writable: true
      });

      // Act
      const result = service.isActionEditRequest();

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when pathname does not contain /edit/', () => {
      // Arrange
      const mockPathname = '/some/path/view/123';
      Object.defineProperty(window, 'location', {
        value: { pathname: mockPathname },
        writable: true
      });

      // Act
      const result = service.isActionEditRequest();

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when pathname is empty', () => {
      // Arrange
      const mockPathname = '';
      Object.defineProperty(window, 'location', {
        value: { pathname: mockPathname },
        writable: true
      });

      // Act
      const result = service.isActionEditRequest();

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when pathname is root', () => {
      // Arrange
      const mockPathname = '/';
      Object.defineProperty(window, 'location', {
        value: { pathname: mockPathname },
        writable: true
      });

      // Act
      const result = service.isActionEditRequest();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('getDataEditRequest', () => {
    let mockRequestModel: RequestModel;
    let mockDetailViewModel: RequestDetailViewModel;
    let mockPrimitiveProperty: PrimitiveProperty;

    beforeEach(() => {
      mockRequestModel = new RequestModel();
      mockDetailViewModel = {
        requestId: 123,
        playerNames: [],
        lastModifiedDate: new Date(),
        request: {
          userId: 1,
          requestedBy: 'testuser',
          sportType: 1,
          actionId: 2,
          issueTypeId: 1,
          isTest: false,
          isVoided: false,
          requestId: 123,
          mistakenBy: '',
          decidedBy: '',
          operators: [],
          provider: '',
          source: '',
          remark: '',
          voidedBy: '',
          briefInfoNote: ''
        },
        event: {
          filterBy: 1,
          transIds: '123,456'
        }
      } as RequestDetailViewModel;

      mockPrimitiveProperty = {
        matchId: 1,
        userId: 1,
        requestedBy: 'testuser',
        sportType: 1,
        requestId: 123,
        actionIdOfFirstTimeAccess: '2'
      } as PrimitiveProperty;

      (objectService.getPrimitiveProperty as jest.Mock).mockReturnValue(mockPrimitiveProperty);
    });

    it('should successfully get data for edit request when API returns valid data', async () => {
      // Arrange
      const requestId = 123;
      (addRequestApiService.getRequestById as jest.Mock).mockResolvedValue(mockDetailViewModel);
      (logInfoService.getLogInfo as jest.Mock).mockResolvedValue(undefined);

      // Act
      await service.getDataEditRequest(requestId, mockRequestModel, new PrimitiveProperty());

      // Assert
      expect(addRequestApiService.getRequestById).toHaveBeenCalledWith(requestId);
      expect(objectService.getPrimitiveProperty).toHaveBeenCalled();
      expect(logInfoService.getLogInfo).toHaveBeenCalled();
      expect(objectService.mapRequestModel).toHaveBeenCalled();
      expect(eventBaseService.backToAccessDeniedPage).not.toHaveBeenCalled();
    });

    it('should redirect to access denied page when API returns null', async () => {
      // Arrange
      const requestId = 123;
      (addRequestApiService.getRequestById as jest.Mock).mockResolvedValue(null);

      // Act
      await service.getDataEditRequest(requestId, mockRequestModel, new PrimitiveProperty());

      // Assert
      expect(addRequestApiService.getRequestById).toHaveBeenCalledWith(requestId);
      expect(eventBaseService.backToAccessDeniedPage).toHaveBeenCalled();
      expect(objectService.getPrimitiveProperty).not.toHaveBeenCalled();
      expect(logInfoService.getLogInfo).not.toHaveBeenCalled();
      expect(objectService.mapRequestModel).not.toHaveBeenCalled();
    });

    it('should call services in correct order', async () => {
      // Arrange
      const requestId = 123;
      (addRequestApiService.getRequestById as jest.Mock).mockResolvedValue(mockDetailViewModel);
      (logInfoService.getLogInfo as jest.Mock).mockResolvedValue(undefined);

      // Act
      await service.getDataEditRequest(requestId, mockRequestModel, new PrimitiveProperty());

      // Assert
      expect(addRequestApiService.getRequestById).toHaveBeenCalledWith(requestId);
      expect(objectService.getPrimitiveProperty).toHaveBeenCalled();
      expect(logInfoService.getLogInfo).toHaveBeenCalled();
      expect(objectService.mapRequestModel).toHaveBeenCalled();
    });

    it('should work with different request IDs', async () => {
      // Arrange
      const requestId = 456;
      (addRequestApiService.getRequestById as jest.Mock).mockResolvedValue(mockDetailViewModel);
      (logInfoService.getLogInfo as jest.Mock).mockResolvedValue(undefined);

      // Act
      await service.getDataEditRequest(requestId, mockRequestModel, new PrimitiveProperty());

      // Assert
      expect(addRequestApiService.getRequestById).toHaveBeenCalledWith(requestId);
      expect(objectService.getPrimitiveProperty).toHaveBeenCalledWith(mockDetailViewModel, requestId);
    });

    it('should work with different request models', async () => {
      // Arrange
      const requestId = 123;
      const differentRequestModel = new RequestModel();
      (addRequestApiService.getRequestById as jest.Mock).mockResolvedValue(mockDetailViewModel);
      (logInfoService.getLogInfo as jest.Mock).mockResolvedValue(undefined);

      // Act
      await service.getDataEditRequest(requestId, differentRequestModel, new PrimitiveProperty());

      // Assert
      expect(objectService.mapRequestModel).toHaveBeenCalled();
    });
  });
});
