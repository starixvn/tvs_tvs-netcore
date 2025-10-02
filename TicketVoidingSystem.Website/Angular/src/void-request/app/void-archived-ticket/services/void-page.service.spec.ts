import { TestBed } from '@angular/core/testing';
import { RequestDetailModel, RequestDetailViewModel } from '../../../../add-request-new/models/request-detail.model';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { IssueTypesModel } from '../../../../utility/models/issue-type.model';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { CommonService } from '../../../../utility/services/common.service';
import { TicketsService } from '../../services/tickets.service';
import { VoidPageCommonService } from '../../services/void-page-common.service';
import { VoidArchivedTicketModel } from '../models/void-archived-ticket.model';
import { VoidPageService } from './void-page.service';

describe('VoidPageService', () => {
  let service: VoidPageService;
  let commonService: CommonService;
  let ticketsService: TicketsService;
  let voidPageCommonService: VoidPageCommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [VoidPageService, CommonService, TicketsService, VoidPageCommonService]
    });

    service = TestBed.inject(VoidPageService);
    commonService = TestBed.inject(CommonService) as jest.Mocked<CommonService>;
    ticketsService = TestBed.inject(TicketsService) as jest.Mocked<TicketsService>;
    voidPageCommonService = TestBed.inject(VoidPageCommonService) as jest.Mocked<VoidPageCommonService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getIssueTypes', () => {
    it('should return issue types from common service', async () => {
      // Arrange
      const expectedIssueTypes = new IssueTypesModel();
      expectedIssueTypes.issueTypes = [];
      expectedIssueTypes.subIssueTypes = [];
      commonService.getIssueTypes = jest.fn().mockResolvedValue(expectedIssueTypes);

      // Act
      const result = await service.getIssueTypes();

      // Assert
      expect(commonService.getIssueTypes).toHaveBeenCalledTimes(1);
      expect(result).toBe(expectedIssueTypes);
    });
  });

  describe('getBasicVoidPageItemsData', () => {
    it('should create VoidArchivedTicketModel with correct properties', async () => {
      // Arrange
      const issueTypes = new IssueTypesModel();
      issueTypes.subIssueTypes = [
        { subIssueTypeId: 1, issueTypeId: 1, subIssueTypeName: 'Test Sub Issue', subIssueTypeNameCS: 'Test Sub Issue CS' }
      ];

      const requestDetail = new RequestDetailViewModel();
      requestDetail.request = new RequestDetailModel();
      requestDetail.request.issueTypeId = Number(IssueTypeConstant.ARCHIVED_TICKET);
      requestDetail.event = { subIssueTypeId: 1 } as any;

      voidPageCommonService.getDisplayIssueTypeName = jest.fn().mockReturnValue('Test Display Name');

      // Act
      const result = await service.getBasicVoidPageItemsData(issueTypes, requestDetail);

      // Assert
      expect(result).toBeInstanceOf(VoidArchivedTicketModel);
      expect(result.id).toBe(1);
      expect(result.subIssueType).toBeDefined();
      expect(result.subIssueType.subIssueTypeId).toBe(1);
      expect(result.displayIssueTypeName).toBe('Test Display Name');
      expect(result.detailViewModel).toBe(requestDetail);
      expect(voidPageCommonService.getDisplayIssueTypeName).toHaveBeenCalledWith(
        requestDetail.request.issueTypeId,
        result.subIssueType,
        issueTypes
      );
    });

    it('should handle abnormal account issue type', async () => {
      // Arrange
      const issueTypes = new IssueTypesModel();
      issueTypes.subIssueTypes = [
        { subIssueTypeId: 2, issueTypeId: 2, subIssueTypeName: 'Abnormal Account', subIssueTypeNameCS: 'Abnormal Account CS' }
      ];

      const requestDetail = new RequestDetailViewModel();
      requestDetail.request = new RequestDetailModel();
      requestDetail.request.issueTypeId = Number(IssueTypeConstant.ABNORMAL_ACCOUNT);
      requestDetail.abnormalAccountModel = { subIssueTypeId: 2 } as any;

      voidPageCommonService.getDisplayIssueTypeName = jest.fn().mockReturnValue('Abnormal Account Display');

      // Act
      const result = await service.getBasicVoidPageItemsData(issueTypes, requestDetail);

      // Assert
      expect(result.subIssueType.subIssueTypeId).toBe(2);
      expect(result.displayIssueTypeName).toBe('Abnormal Account Display');
    });
  });

  describe('loadUnderneathVoidPageItemsData', () => {
    it('should load underneath data for void page item', async () => {
      // Arrange
      const voidPageItem = new VoidArchivedTicketModel();
      voidPageItem.matchModel = { sportType: 'Football' } as any;
      voidPageItem.subIssueType = { subIssueTypeId: 1, issueTypeId: 1, subIssueTypeName: 'Test', subIssueTypeNameCS: 'Test CS' } as any;

      const requestDetail = new RequestDetailViewModel();
      requestDetail.request = new RequestDetailModel();

      const ticketQuery = { query: 'test' };
      const voidTicketsMini = { licenseeAffectedList: [{ id: 1, name: 'Test Licensee' }] } as any;
      const templateValue = { checkSettled: undefined } as any;
      const voidReason = { reason: 'test reason' } as any;

      ticketsService.initTicketQuery = jest.fn().mockReturnValue(ticketQuery);
      ticketsService.getVoidTicketsMini = jest.fn().mockResolvedValue(voidTicketsMini);
      voidPageCommonService.getVoidedReason = jest.fn().mockResolvedValue(voidReason);
      
      // Mock the getTemplateValue method by spying on the service instance
      jest.spyOn(service, 'getTemplateValue').mockReturnValue(templateValue);

      // Act
      await service.loadUnderneathVoidPageItemsData(voidPageItem, requestDetail);

      // Assert
      expect(ticketsService.initTicketQuery).toHaveBeenCalledWith(requestDetail, voidPageItem.matchModel);
      expect(ticketsService.getVoidTicketsMini).toHaveBeenCalledWith(ticketQuery);
      expect(voidPageCommonService.getVoidedReason).toHaveBeenCalledWith(
        voidPageItem.subIssueType.subIssueTypeId,
        voidPageItem.matchModel?.sportType
      );

      expect(voidPageItem.voidTicketsMini).toBe(voidTicketsMini);
      expect(voidPageItem.templateValue).toBe(templateValue);
      expect(voidPageItem.voidReason).toBe(voidReason);
      expect(voidPageItem.licenseeAffectedList).toBeDefined();
      expect(Array.isArray(voidPageItem.licenseeAffectedList)).toBe(true);
    });

    it('should clone licensee affected list', async () => {
      // Arrange
      const voidPageItem = new VoidArchivedTicketModel();
      voidPageItem.matchModel = { sportType: 'Football' } as any;
      voidPageItem.subIssueType = { subIssueTypeId: 1, issueTypeId: 1, subIssueTypeName: 'Test', subIssueTypeNameCS: 'Test CS' } as any;

      const requestDetail = new RequestDetailViewModel();
      requestDetail.request = new RequestDetailModel();

      const originalLicenseeList = [{ id: 1, name: 'Test Licensee' }];
      const voidTicketsMini = { licenseeAffectedList: originalLicenseeList } as any;

      ticketsService.initTicketQuery = jest.fn().mockReturnValue({});
      ticketsService.getVoidTicketsMini = jest.fn().mockResolvedValue(voidTicketsMini);
      voidPageCommonService.getVoidedReason = jest.fn().mockResolvedValue({});

      // Act
      await service.loadUnderneathVoidPageItemsData(voidPageItem, requestDetail);

      // Assert
      expect(voidPageItem.licenseeAffectedList).not.toBe(originalLicenseeList);
      expect(voidPageItem.licenseeAffectedList).toEqual(originalLicenseeList);
    });
  });

  describe('getSubIssueTypeId (private method testing through public methods)', () => {
    it('should return subIssueTypeId from event for archived ticket', async () => {
      // Arrange
      const issueTypes = new IssueTypesModel();
      issueTypes.subIssueTypes = [
        { subIssueTypeId: 1, issueTypeId: 1, subIssueTypeName: 'Test', subIssueTypeNameCS: 'Test CS' }
      ];

      const requestDetail = new RequestDetailViewModel();
      requestDetail.request = new RequestDetailModel();
      requestDetail.request.issueTypeId = Number(IssueTypeConstant.ARCHIVED_TICKET);
      requestDetail.event = { subIssueTypeId: 1 } as any;

      voidPageCommonService.getDisplayIssueTypeName = jest.fn().mockReturnValue('Test Display');

      // Act
      const result = await service.getBasicVoidPageItemsData(issueTypes, requestDetail);

      // Assert
      expect(result.subIssueType.subIssueTypeId).toBe(1);
    });

    it('should return subIssueTypeId from abnormalAccountModel for abnormal account', async () => {
      // Arrange
      const issueTypes = new IssueTypesModel();
      issueTypes.subIssueTypes = [
        { subIssueTypeId: 2, issueTypeId: 2, subIssueTypeName: 'Abnormal', subIssueTypeNameCS: 'Abnormal CS' }
      ];

      const requestDetail = new RequestDetailViewModel();
      requestDetail.request = new RequestDetailModel();
      requestDetail.request.issueTypeId = Number(IssueTypeConstant.ABNORMAL_ACCOUNT);
      requestDetail.abnormalAccountModel = { subIssueTypeId: 2 } as any;

      voidPageCommonService.getDisplayIssueTypeName = jest.fn().mockReturnValue('Abnormal Display');

      // Act
      const result = await service.getBasicVoidPageItemsData(issueTypes, requestDetail);

      // Assert
      expect(result.subIssueType.subIssueTypeId).toBe(2);
    });

    it('should return null for other issue types', async () => {
      // Arrange
      const issueTypes = new IssueTypesModel();
      issueTypes.subIssueTypes = [];

      const requestDetail = new RequestDetailViewModel();
      requestDetail.request = new RequestDetailModel();
      requestDetail.request.issueTypeId = 999; // Some other issue type

      voidPageCommonService.getDisplayIssueTypeName = jest.fn().mockReturnValue('Other Display');

      // Act
      const result = await service.getBasicVoidPageItemsData(issueTypes, requestDetail);

      // Assert
      expect(result.subIssueType).toBeUndefined();
    });
  });

  describe('getSubIssueTypeModel (private method testing through public methods)', () => {
    it('should find correct sub issue type from issue types', async () => {
      // Arrange
      const issueTypes = new IssueTypesModel();
      const expectedSubIssueType = { subIssueTypeId: 3, issueTypeId: 3, subIssueTypeName: 'Specific Type', subIssueTypeNameCS: 'Specific Type CS' };
      issueTypes.subIssueTypes = [
        { subIssueTypeId: 1, issueTypeId: 1, subIssueTypeName: 'Type 1', subIssueTypeNameCS: 'Type 1 CS' },
        expectedSubIssueType,
        { subIssueTypeId: 2, issueTypeId: 2, subIssueTypeName: 'Type 2', subIssueTypeNameCS: 'Type 2 CS' }
      ];

      const requestDetail = new RequestDetailViewModel();
      requestDetail.request = new RequestDetailModel();
      requestDetail.request.issueTypeId = Number(IssueTypeConstant.ARCHIVED_TICKET);
      requestDetail.event = { subIssueTypeId: 3 } as any;

      voidPageCommonService.getDisplayIssueTypeName = jest.fn().mockReturnValue('Specific Display');

      // Act
      const result = await service.getBasicVoidPageItemsData(issueTypes, requestDetail);

      // Assert
      expect(result.subIssueType).toBe(expectedSubIssueType);
    });

    it('should return undefined when sub issue type not found', async () => {
      // Arrange
      const issueTypes = new IssueTypesModel();
      issueTypes.subIssueTypes = [
        { subIssueTypeId: 1, issueTypeId: 1, subIssueTypeName: 'Type 1', subIssueTypeNameCS: 'Type 1 CS' }
      ];

      const requestDetail = new RequestDetailViewModel();
      requestDetail.request = new RequestDetailModel();
      requestDetail.request.issueTypeId = Number(IssueTypeConstant.ARCHIVED_TICKET);
      requestDetail.event = { subIssueTypeId: 999 } as any; // Non-existent ID

      voidPageCommonService.getDisplayIssueTypeName = jest.fn().mockReturnValue('Not Found Display');

      // Act
      const result = await service.getBasicVoidPageItemsData(issueTypes, requestDetail);

      // Assert
      expect(result.subIssueType).toBeUndefined();
    });
  });

  describe('Error handling', () => {
    it('should handle errors in getIssueTypes', async () => {
      // Arrange
      const error = new Error('Service error');
      commonService.getIssueTypes = jest.fn().mockRejectedValue(error);

      // Act & Assert
      await expect(service.getIssueTypes()).rejects.toThrow('Service error');
    });

    it('should handle errors in loadUnderneathVoidPageItemsData', async () => {
      // Arrange
      const voidPageItem = new VoidArchivedTicketModel();
      const requestDetail = new RequestDetailViewModel();
      const error = new Error('Tickets service error');

      ticketsService.initTicketQuery = jest.fn().mockReturnValue({});
      ticketsService.getVoidTicketsMini = jest.fn().mockRejectedValue(error);

      // Act & Assert
      await expect(service.loadUnderneathVoidPageItemsData(voidPageItem, requestDetail)).rejects.toThrow('Tickets service error');
    });
  });
});
