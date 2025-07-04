import { TestBed } from '@angular/core/testing';
import { SaveRequestService } from './save-request.service';
import { AddRequestService } from '../../add-request.service';
import { StaticService } from '../../../../../utility/services/static.service';
import { SaveRequestArg } from './save-request.model';
import { AddRequestQuery } from '../../models/add-request.query';
import { AbnormalBetModel } from '../../models/abnormal-bet.model';
import { ConfirmAbnormalBetModel } from '../confirm-abnormal-bet/confirm-abnormal-bet.model';
import { ConfirmAbnormalBetComponent } from '../confirm-abnormal-bet/confirm-abnormal-bet.component';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { OthersModel } from '../../others/others.model';
import { TestingModule } from '../../../../../utility/modules/testing.module';

jest.mock('../../../../../utility/services/static.service', () => ({
  StaticService: {
    isAbnormalBet: jest.fn(),
    isFilterByMixOrSystemParlay: jest.fn()
  }
}));

describe('SaveRequestService', () => {
  let service: SaveRequestService;
  let addRequestService: AddRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        SaveRequestService,
        AddRequestService
      ]
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
      const mockAddRequestStore = new AddRequestStore();
      const mockTransInfoAddRequestModel = new TransInfoAddRequestModel();
      mockTransInfoAddRequestModel.unMarkTransIds = '1,2,3';
      mockTransInfoAddRequestModel.markTransIds = '4,5,6';
      mockTransInfoAddRequestModel.removeTransIds = '7,8,9';
      mockTransInfoAddRequestModel.transInfoJson = '{}';

      const mockFilterModel = new FilterModel();
      mockFilterModel.issueTypeId = "1";
      mockFilterModel.subIssueTypeId = '2';
      mockFilterModel.action = 'action1';
      mockFilterModel.isTest = false;
      mockFilterModel.isVoided = false;
      mockFilterModel.isAbnormal = true;
      mockFilterModel.actions = [];
      mockFilterModel.subIssueTypes = [{
        issueTypeId: 1,
        subIssueTypeId: 2,
        subIssueTypeName: 'Test Sub Issue',
        subIssueTypeNameCS: 'Test Sub Issue CS'
      }];

      const mockAbnormalBetModel = new AbnormalBetModel();
      mockAbnormalBetModel.transIds = '1,2,3,4,5,6,7,8,9';
      mockAbnormalBetModel.filterBy = 1;

      const mockArgs = {
        isEdit: false,
        requestId: 1,
        addRequestStore: mockAddRequestStore,
        primitiveProps: {
          isBlockBetIds: false,
          isShowButtonRemoveInvalid: false,
          invalidTransIds: '',
          isHasUusTickets: false,
          transInfoAddRequestModel: mockTransInfoAddRequestModel,
          isBlockUI: false
        },
        filter: mockFilterModel,
        others: {
          mistakenBy: 'user1',
          operatorsList: [{
            operatorId: '1',
            operatorName: 'op1'
          }],
          provider: 'provider1',
          source: 'source1',
          decidedBy: 'decider1',
          remark: 'test remark'
        } as unknown as OthersModel,
        abnormalBetModel: mockAbnormalBetModel,
        confirmAbnormalBetModel: new ConfirmAbnormalBetModel(),
        confirmAbnormalBetComponent: new ConfirmAbnormalBetComponent()
      } as unknown as SaveRequestArg;

      jest.spyOn(addRequestService, 'executeSaveRequest');

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

  describe('isAbnormalBetMixOrSystemParlay', () => {
    it('should return true when is abnormal bet and mix or system parlay', () => {
      // Arrange
      const mockArgs = {
        isEdit: false,
        requestId: 1,
        addRequestStore: new AddRequestStore(),
        primitiveProps: {
          isBlockBetIds: false,
          isShowButtonRemoveInvalid: false,
          invalidTransIds: '',
          isHasUusTickets: false,
          transInfoAddRequestModel: new TransInfoAddRequestModel(),
          isBlockUI: false
        },
        filter: {
          issueTypeId: '1',
          subIssueTypeId: '2',
          action: 'action1',
          isTest: false,
          isVoided: false,
          isAbnormal: true,
          actions: [],
          subIssueTypes: []
        } as FilterModel,
        others: {},
        abnormalBetModel: { filterBy: 'mix' },
        confirmAbnormalBetModel: new ConfirmAbnormalBetModel(),
        confirmAbnormalBetComponent: new ConfirmAbnormalBetComponent()
      } as unknown as SaveRequestArg;

      (StaticService.isAbnormalBet as jest.Mock).mockReturnValue(true);
      (StaticService.isFilterByMixOrSystemParlay as jest.Mock).mockReturnValue(true);

      // Act
      const result = (service as any).isAbnormalBetMixOrSystemParlay(mockArgs);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when not abnormal bet', () => {
      // Arrange
      const mockArgs = {
        isEdit: false,
        requestId: 1,
        addRequestStore: new AddRequestStore(),
        primitiveProps: {
          isBlockBetIds: false,
          isShowButtonRemoveInvalid: false,
          invalidTransIds: '',
          isHasUusTickets: false,
          transInfoAddRequestModel: new TransInfoAddRequestModel(),
          isBlockUI: false
        },
        filter: {
          issueTypeId: '1',
          subIssueTypeId: '2',
          action: 'action1',
          isTest: false,
          isVoided: false,
          isAbnormal: true,
          actions: [],
          subIssueTypes: []
        } as FilterModel,
        others: {},
        abnormalBetModel: { filterBy: 'mix' },
        confirmAbnormalBetModel: new ConfirmAbnormalBetModel(),
        confirmAbnormalBetComponent: new ConfirmAbnormalBetComponent()
      } as unknown as SaveRequestArg;

      (StaticService.isAbnormalBet as jest.Mock).mockReturnValue(false);
      (StaticService.isFilterByMixOrSystemParlay as jest.Mock).mockReturnValue(true);

      // Act
      const result = (service as any).isAbnormalBetMixOrSystemParlay(mockArgs);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('getTransIdsForSaveRequest', () => {
    it('should filter out class 4K tickets when isRemoveCustomerClass4K is true', () => {
      // Arrange
      const confirmAbnormalBetModel = new ConfirmAbnormalBetModel();
      confirmAbnormalBetModel.ticketsOfCustomerClass4K = '1,2,3';
      const confirmAbnormalBetComponent = new ConfirmAbnormalBetComponent();
      confirmAbnormalBetComponent.isRemoveCustomerClass4K = true;
      const transIds = '1,2,3,4,5,6';

      // Act
      const result = (service as any).getTransIdsForSaveRequest(
        confirmAbnormalBetModel,
        confirmAbnormalBetComponent,
        transIds
      );

      // Assert
      expect(result).toBe('4,5,6');
    });

    it('should filter out class 201 tickets when isRemoveCustomerClass201 is true', () => {
      // Arrange
      const confirmAbnormalBetModel = new ConfirmAbnormalBetModel();
      confirmAbnormalBetModel.ticketsOfCustomerClass201 = '4,5,6';
      const confirmAbnormalBetComponent = new ConfirmAbnormalBetComponent();
      confirmAbnormalBetComponent.isRemoveCustomerClass201 = true;
      const transIds = '1,2,3,4,5,6';

      // Act
      const result = (service as any).getTransIdsForSaveRequest(
        confirmAbnormalBetModel,
        confirmAbnormalBetComponent,
        transIds
      );

      // Assert
      expect(result).toBe('1,2,3');
    });
  });

  describe('createAbnormalBetModel', () => {
    it('should create abnormal bet model with correct properties', () => {
      // Arrange
      const mockSubIssueType = {
        issueTypeId: 1,
        subIssueTypeId: 2,
        subIssueTypeName: 'Test Sub Issue',
        subIssueTypeNameCS: 'Test Sub Issue CS'
      };

      const mockArgs = {
        isEdit: false,
        requestId: 1,
        addRequestStore: new AddRequestStore(),
        primitiveProps: {
          isBlockBetIds: false,
          isShowButtonRemoveInvalid: false,
          invalidTransIds: '',
          isHasUusTickets: false,
          transInfoAddRequestModel: new TransInfoAddRequestModel(),
          isBlockUI: false
        },
        abnormalBetModel: new AbnormalBetModel(),
        confirmAbnormalBetModel: new ConfirmAbnormalBetModel(),
        confirmAbnormalBetComponent: new ConfirmAbnormalBetComponent(),
        filter: {
          subIssueTypeId: '2',
          subIssueTypes: [mockSubIssueType],
          issueTypeId: '1',
          action: 'action1',
          isTest: false,
          isVoided: false,
          isAbnormal: true,
          actions: []
        } as FilterModel
      } as SaveRequestArg;

      jest.spyOn(service as any, 'getTransIdsForSaveRequest').mockReturnValue('1,2,3');

      // Act
      const result = (service as any).createAbnormalBetModel(mockArgs);

      // Assert
      expect(result).toBeInstanceOf(AbnormalBetModel);
      expect(result.transIds).toBe('1,2,3');
      expect(result.isConfirmCalculator).toBe(mockArgs.confirmAbnormalBetComponent.isConfirmCalculator);
      expect(result.subIssueTypeName).toBe('Test Sub Issue');
    });
  });
});
