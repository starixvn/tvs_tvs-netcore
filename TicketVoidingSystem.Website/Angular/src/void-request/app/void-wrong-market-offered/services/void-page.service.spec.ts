import { TestBed } from '@angular/core/testing';
import { GetLogInfoModel } from '../../../../add-request-new/models/get-log-info.model';
import { RequestDetailViewModel } from '../../../../add-request-new/models/request-detail.model';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { IssueTypesModel, SubIssueType } from '../../../../utility/models/issue-type.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { VoidedReason } from '../../../../utility/models/reason.model';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { CommonService } from '../../../../utility/services/common.service';
import { HttpService } from '../../../../utility/services/http.service';
import { TicketsService } from '../../services/tickets.service';
import { TicketsModel } from '../../tickets-list/tickets.model';
import { VoidWrongMarketOfferedModel } from '../models/void-wrong-market-offered.model';
import { TemplateMessageService } from './template-message.service';
import { VoidPageService } from './void-page.service';

class Helper {
  static readonly fakeIssueTypes = {
    issueTypes: [
      { issueTypeId: 1, issueTypeName: 'Wrong Market Offered' },
      { issueTypeId: 2, issueTypeName: 'Wrong Odds' }
    ],
    subIssueTypes: [
      { subIssueTypeId: 1, subIssueTypeName: 'Wrong Market', issueTypeId: 1 },
      { subIssueTypeId: 2, subIssueTypeName: 'Wrong Market Name', issueTypeId: 1 },
      { subIssueTypeId: 3, subIssueTypeName: 'Wrong Odds Value', issueTypeId: 2 }
    ]
  } as IssueTypesModel;

  static readonly fakeRequestDetail: RequestDetailViewModel = {
    requestId: 123,
    request: {
      issueTypeId: 1,
      requestId: 123
    },
    wrongMarketOfferedModels: [
      {
        id: 1,
        matchId: 100,
        requestDetailId: 1,
        subIssueTypeId: 1
      },
      {
        id: 2,
        matchId: 101,
        requestDetailId: 2,
        subIssueTypeId: 2
      }
    ]
  } as RequestDetailViewModel;

  static readonly fakeLogInfoModels = [
    {
      id: 1,
      logInfoDetail: 'Log detail for item 1'
    },
    {
      id: 2,
      logInfoDetail: 'Log detail for item 2'
    }
  ] as unknown as GetLogInfoModel[];

  static readonly fakeMatchModel = {
    matchId: 100,
    sportType: 'Football',
    homeTeam: 'Team A',
    awayTeam: 'Team B'
  } as unknown as MatchModel;

  static readonly fakeVoidTicketsMini = {
    isAllLiveTickets: true,
    isAllNonLiveTickets: false,
    licenseeAffectedList: ['Licensee1', 'Licensee2']
  } as unknown as TicketsModel;
}

describe('VoidPageService', () => {
  let service: VoidPageService;
  let commonService: CommonService;
  let ticketsService: TicketsService;
  let templateMessageService: TemplateMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [VoidPageService, CommonService, TicketsService, TemplateMessageService, HttpService]
    });

    service = TestBed.inject(VoidPageService);
    commonService = TestBed.inject(CommonService);
    ticketsService = TestBed.inject(TicketsService);
    templateMessageService = TestBed.inject(TemplateMessageService);
    
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getIssueTypes', () => {
    it('should return issue types from common service', async () => {
      // Arrange
      const expectedIssueTypes = Helper.fakeIssueTypes;
      commonService.getIssueTypes = jest.fn().mockResolvedValue(expectedIssueTypes);

      // Action
      const result = await service.getIssueTypes();

      // Assert
      expect(result).toEqual(expectedIssueTypes);
      expect(commonService.getIssueTypes).toHaveBeenCalledTimes(1);
    });

    it('should handle error when common service fails', async () => {
      // Arrange
      const error = new Error('Service error');
      commonService.getIssueTypes = jest.fn().mockRejectedValue(error);

      // Action & Assert
      await expect(service.getIssueTypes()).rejects.toThrow('Service error');
    });
  });

  describe('getBasicVoidPageItemsData', () => {
    beforeEach(() => {
      commonService.getLogInfo = jest.fn().mockResolvedValue({
        getLogInfoModels: Helper.fakeLogInfoModels
      } as any);
      commonService.getMatch = jest.fn().mockResolvedValue(Helper.fakeMatchModel);
    });

    it('should return void page items with correct data', async () => {
      // Arrange
      const issueTypes = Helper.fakeIssueTypes;
      const requestDetail = Helper.fakeRequestDetail;

      // Action
      const result = await service.getBasicVoidPageItemsData(issueTypes, requestDetail);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(VoidWrongMarketOfferedModel);
      expect(result[0].id).toBe(1);
      expect(result[0].requestDetailId).toBe(1);
      expect(result[0].isShowTemplateMessage).toBe(false);
      expect(result[0].detailViewModel).toBe(requestDetail);
      expect(result[0].logInfoDetail).toBe('Log detail for item 1');
    });

    it('should set correct sub issue type', async () => {
      // Arrange
      const issueTypes = Helper.fakeIssueTypes;
      const requestDetail = Helper.fakeRequestDetail;

      // Action
      const result = await service.getBasicVoidPageItemsData(issueTypes, requestDetail);

      // Assert
      expect(result[0].subIssueType.subIssueTypeId).toBe(1);
      expect(result[0].subIssueType.subIssueTypeName).toBe('Wrong Market');
    });

    it('should set correct display issue type name', async () => {
      // Arrange
      const issueTypes = Helper.fakeIssueTypes;
      const requestDetail = Helper.fakeRequestDetail;

      // Action
      const result = await service.getBasicVoidPageItemsData(issueTypes, requestDetail);

      // Assert
      expect(result[0].displayIssueTypeName).toBe('Wrong Market Offered - Wrong Market');
    });

    it('should handle empty wrong market offered models', async () => {
      // Arrange
      const issueTypes = Helper.fakeIssueTypes;
      const requestDetail = { ...Helper.fakeRequestDetail, wrongMarketOfferedModels: [] };

      // Action
      const result = await service.getBasicVoidPageItemsData(issueTypes, requestDetail);

      // Assert
      expect(result).toHaveLength(0);
    });
  });

  describe('loadUnderneathVoidPageItemsData', () => {
    beforeEach(() => {
      ticketsService.initTicketQuery = jest.fn().mockReturnValue({} as any);
      ticketsService.getVoidTicketsMini = jest.fn().mockResolvedValue(Helper.fakeVoidTicketsMini);
      templateMessageService.getTemplateValue = jest.fn().mockReturnValue(new TemplateValue());
      commonService.getVoidedReason = jest.fn().mockResolvedValue(new VoidedReason());
    });

    it('should load underneath data for all void page items', async () => {
      // Arrange
      const voidPageItems = [
        new VoidWrongMarketOfferedModel(),
        new VoidWrongMarketOfferedModel()
      ];
      voidPageItems[0].matchModel = Helper.fakeMatchModel;
      voidPageItems[0].requestDetailId = 1;
      voidPageItems[0].subIssueType = Helper.fakeIssueTypes.subIssueTypes[0];
      voidPageItems[1].matchModel = Helper.fakeMatchModel;
      voidPageItems[1].requestDetailId = 2;
      voidPageItems[1].subIssueType = Helper.fakeIssueTypes.subIssueTypes[1];

      const requestDetail = Helper.fakeRequestDetail;

      // Action
      await service.loadUnderneathVoidPageItemsData(voidPageItems, requestDetail);

      // Assert
      expect(ticketsService.initTicketQuery).toHaveBeenCalledTimes(2);
      expect(ticketsService.getVoidTicketsMini).toHaveBeenCalledTimes(2);
      expect(templateMessageService.getTemplateValue).toHaveBeenCalledTimes(2);
      expect(commonService.getVoidedReason).toHaveBeenCalledTimes(2);

      voidPageItems.forEach(item => {
        expect(item.voidTicketsMini).toBeDefined();
        expect(item.isAllLiveTickets).toBe(true);
        expect(item.isAllNonLiveTickets).toBe(false);
        expect(item.licenseeAffectedList).toEqual(['Licensee1', 'Licensee2']);
      });
    });

    it('should handle empty void page items array', async () => {
      // Arrange
      const voidPageItems: VoidWrongMarketOfferedModel[] = [];
      const requestDetail = Helper.fakeRequestDetail;

      // Action
      await service.loadUnderneathVoidPageItemsData(voidPageItems, requestDetail);

      // Assert
      expect(ticketsService.initTicketQuery).not.toHaveBeenCalled();
      expect(ticketsService.getVoidTicketsMini).not.toHaveBeenCalled();
    });
  });

  describe('private methods', () => {
    describe('initBasicRequestInfo', () => {
      it('should map wrong market offered models to basic request info', () => {
        // Arrange
        const requestDetail = Helper.fakeRequestDetail;

        // Action
        const result = (service as any).initBasicRequestInfo(requestDetail);

        // Assert
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({
          id: 1,
          matchId: 100,
          requestDetailId: 1,
          subIssueTypeId: 1
        });
        expect(result[1]).toEqual({
          id: 2,
          matchId: 101,
          requestDetailId: 2,
          subIssueTypeId: 2
        });
      });

      it('should handle empty wrong market offered models', () => {
        // Arrange
        const requestDetail = { ...Helper.fakeRequestDetail, wrongMarketOfferedModels: [] };

        // Action
        const result = (service as any).initBasicRequestInfo(requestDetail);

        // Assert
        expect(result).toHaveLength(0);
      });
    });

    describe('getSubIssueTypeModel', () => {
      it('should return correct sub issue type', () => {
        // Arrange
        const issueTypes = Helper.fakeIssueTypes;
        const subIssueTypeId = 1;

        // Action
        const result = (service as any).getSubIssueTypeModel(subIssueTypeId, issueTypes);

        // Assert
        expect(result.subIssueTypeId).toBe(1);
        expect(result.subIssueTypeName).toBe('Wrong Market');
      });

      it('should return undefined for non-existent sub issue type', () => {
        // Arrange
        const issueTypes = Helper.fakeIssueTypes;
        const subIssueTypeId = 999;

        // Action
        const result = (service as any).getSubIssueTypeModel(subIssueTypeId, issueTypes);

        // Assert
        expect(result).toBeUndefined();
      });
    });

    describe('getDisplayIssueTypeName', () => {
      it('should return issue type name when same as sub issue type name', () => {
        // Arrange
        const issueTypes = Helper.fakeIssueTypes;
        const issueTypeId = 1;
        const subIssueTypeModel = { subIssueTypeName: 'Wrong Market Offered' } as SubIssueType;

        // Action
        const result = (service as any).getDisplayIssueTypeName(issueTypeId, subIssueTypeModel, issueTypes);

        // Assert
        expect(result).toBe('Wrong Market Offered');
      });

      it('should return combined name when different from sub issue type name', () => {
        // Arrange
        const issueTypes = Helper.fakeIssueTypes;
        const issueTypeId = 1;
        const subIssueTypeModel = { subIssueTypeName: 'Wrong Market Type' } as SubIssueType;

        // Action
        const result = (service as any).getDisplayIssueTypeName(issueTypeId, subIssueTypeModel, issueTypes);

        // Assert
        expect(result).toBe('Wrong Market Offered - Wrong Market Type');
      });
    });
  });
});
