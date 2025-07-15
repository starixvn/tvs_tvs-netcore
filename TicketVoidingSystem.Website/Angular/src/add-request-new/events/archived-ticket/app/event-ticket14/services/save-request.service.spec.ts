import { TestBed } from '@angular/core/testing';
import { SaveRequestService } from './save-request.service';
import { AddRequestService } from '../../add-request.service';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { SaveRequestArg } from '../models/save-request-arg.model';

describe('SaveRequestService', () => {
  let service: SaveRequestService;
  let addRequestService: AddRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [SaveRequestService]
    });

    service = TestBed.inject(SaveRequestService);
    addRequestService = TestBed.inject(AddRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('executeSave', () => {
    it('should call addRequestService.executeSaveRequest with correct parameters', async () => {
      // Arrange
      const mockArgs: SaveRequestArg = {
        isEdit: true,
        requestId: 123,
        transIds: '123,456',
        primitiveProps: {
          transInfoJson: '{"key": "value"}',
          isBlockBetIds: false,
          permission: {} as any
        } as any,
        filter: {
          issueTypeId: 1,
          subIssueTypeId: 2,
          action: 1,
          isTest: true,
          isVoided: false,
          isAbnormal: false,
          actions: []
        } as any,
        filterBy: 1,
        others: {
          decidedBy: 'user1',
          remark: 'test remark'
        },
        addRequestStore: {} as any,
        eventTicket14Model: {} as any
      };

      addRequestService.executeSaveRequest = jest.fn().mockResolvedValue(Promise.resolve());

      // Act
      await service.executeSave(mockArgs);

      // Assert
      expect(addRequestService.executeSaveRequest).toHaveBeenCalledWith(
        mockArgs.isEdit,
        mockArgs.requestId,
        expect.any(AddRequestQuery),
        mockArgs.addRequestStore
      );
    });
  });

  describe('initAddRequestQuery', () => {
    it('should initialize query with correct values', () => {
      // Arrange
      const mockArgs: SaveRequestArg = {
        isEdit: true,
        requestId: 123,
        transIds: '123,456',
        primitiveProps: {
          transInfoJson: '{"key": "value"}',
          isBlockBetIds: false,
          permission: {} as any
        } as any,
        filter: {
          issueTypeId: 1,
          subIssueTypeId: 2,
          action: 1,
          isTest: true,
          isVoided: false,
          isAbnormal: false,
          actions: []
        } as any,
        filterBy: 1,
        others: {
          decidedBy: 'user1',
          remark: 'test remark'
        },
        addRequestStore: {} as any,
        eventTicket14Model: {} as any
      };

      // Act
      const result = (service as any).initAddRequestQuery(mockArgs);

      // Assert
      expect(result).toEqual({
        transInfoJson: mockArgs.primitiveProps.transInfoJson,
        transIds: mockArgs.transIds,
        issueTypeId: mockArgs.filter.issueTypeId,
        subIssueTypeId: mockArgs.filter.subIssueTypeId,
        actionId: mockArgs.filter.action,
        isTest: mockArgs.filter.isTest,
        isVoided: mockArgs.filter.isVoided,
        filterBy: mockArgs.filterBy,
        decidedBy: mockArgs.others.decidedBy,
        remark: mockArgs.others.remark
      });
    });

    it('should handle empty or undefined values', () => {
      // Arrange
      const mockArgs: SaveRequestArg = {
        isEdit: true,
        requestId: 0,
        transIds: '',
        primitiveProps: {
          transInfoJson: '',
          isBlockBetIds: false,
          permission: {} as any
        } as any,
        filter: {
          issueTypeId: 0,
          subIssueTypeId: 0,
          action: 0,
          isTest: false,
          isVoided: false,
          isAbnormal: false,
          actions: []
        } as any,
        filterBy: 0,
        others: {
          decidedBy: '',
          remark: ''
        },
        addRequestStore: {} as any,
        eventTicket14Model: {} as any
      };

      // Act
      const result = (service as any).initAddRequestQuery(mockArgs);

      // Assert
      expect(result).toEqual({
        transInfoJson: '',
        transIds: '',
        issueTypeId: 0,
        subIssueTypeId: 0,
        actionId: 0,
        isTest: false,
        isVoided: false,
        filterBy: 0,
        decidedBy: '',
        remark: ''
      });
    });
  });
});
