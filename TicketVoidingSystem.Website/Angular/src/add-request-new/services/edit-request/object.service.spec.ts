import { TestBed } from '@angular/core/testing';
import { TVSRequestFilterBy } from '../../../utility/constants/config';
import { TestingModule } from '../../../utility/modules/testing.module';
import { StaticService } from '../../../utility/services/static.service';
import { FilterModel } from '../../component/filter/filter.model';
import { PrimitiveProperty } from '../../models/primitive-property.model';
import { RequestDetailViewModel } from '../../models/request-detail.model';
import { RequestModel } from '../../models/request.model';
import { ObjectService } from './object.service';

jest.mock('../../../../utility/services/static.service', () => ({
  StaticService: {
    getSubIssueTypeId: jest.fn(),
    isArchivedTicket: jest.fn(),
    checkAllIssueTypes: jest.fn()
  }
}));

describe('ObjectService', () => {
  let service: ObjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ObjectService]
    });

    service = TestBed.inject(ObjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('mapRequestModel', () => {
    it('should map request model correctly', () => {
      // Arrange
      const requestModel = new RequestModel();
      const detailViewModel = {
        request: {
          actionId: 1,
          userId: 123,
          requestedBy: 'testUser',
          sportType: 'football',
          isTest: false,
          isVoided: false,
          issueTypeId: 1,
          mistakenBy: 'user1',
          decidedBy: 'user2',
          operators: ['op1', 'op2'],
          provider: 'provider1',
          source: 'source1',
          remark: 'test remark'
        },
        event: {
          filterBy: TVSRequestFilterBy.ABNORMAL,
          transIds: ['123', '456']
        }
      } as unknown as RequestDetailViewModel;

      const primitiveProperty = new PrimitiveProperty();
      primitiveProperty.requestId = 1;

      // Mock StaticService methods
      (StaticService.getSubIssueTypeId as jest.Mock).mockReturnValue(2);
      (StaticService.isArchivedTicket as jest.Mock).mockReturnValue(true);
      (StaticService.checkAllIssueTypes as jest.Mock).mockReturnValue({
        isArchivedTicket: true
      });

      // Act
      service.mapRequestModel(requestModel, detailViewModel, primitiveProperty);

      // Assert
      expect(requestModel.filter).toEqual({
        action: '1',
        subIssueTypeId: '2',
        isTest: false,
        isVoided: false,
        issueTypeId: '1',
        isAbnormal: true
      } as FilterModel);

      expect(requestModel.others).toEqual({
        mistakenBy: 'user1',
        decidedBy: 'user2',
        operatorsList: ['op1', 'op2'],
        provider: 'provider1',
        source: 'source1',
        remark: 'test remark'
      });

      expect(requestModel.eventTicket14Model).toEqual({
        transIds: ['123', '456']
      });
    });
  });

  describe('getPrimitiveProperty', () => {
    it('should return primitive property with correct values', () => {
      // Arrange
      const detailViewModel = {
        request: {
          userId: 123,
          requestedBy: 'testUser',
          sportType: 'football',
          actionId: 1
        }
      } as unknown as RequestDetailViewModel;

      const requestId = 456;

      // Act
      const result = service.getPrimitiveProperty(detailViewModel, requestId);

      // Assert
      expect(result).toEqual({
        userId: 123,
        requestedBy: 'testUser',
        sportType: 'football',
        requestId: 456,
        actionIdOfFirstTimeAccess: '1'
      } as unknown as PrimitiveProperty);
    });
  });

  describe('isAbnormalArchivedTicket', () => {
    it('should return true for abnormal archived ticket', () => {
      // Arrange
      const detailViewModel = {
        request: {
          issueTypeId: 1
        },
        event: {
          filterBy: TVSRequestFilterBy.ABNORMAL
        }
      } as RequestDetailViewModel;

      (StaticService.isArchivedTicket as jest.Mock).mockReturnValue(true);

      // Act
      const result = service['isAbnormalArchivedTicket'](detailViewModel);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false for non-archived ticket', () => {
      // Arrange
      const detailViewModel = {
        request: {
          issueTypeId: 1
        },
        event: {
          filterBy: TVSRequestFilterBy.ABNORMAL
        }
      } as RequestDetailViewModel;

      (StaticService.isArchivedTicket as jest.Mock).mockReturnValue(false);

      // Act
      const result = service['isAbnormalArchivedTicket'](detailViewModel);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('mapEvent', () => {
    it('should map event for archived ticket', () => {
      // Arrange
      const args = {
        requestModel: new RequestModel(),
        detailViewModel: {
          request: {
            issueTypeId: 1
          },
          event: {
            transIds: ['123', '456']
          }
        } as unknown as RequestDetailViewModel,
        primitiveProperty: new PrimitiveProperty()
      };

      (StaticService.checkAllIssueTypes as jest.Mock).mockReturnValue({
        isArchivedTicket: true
      });

      // Act
      service['mapEvent'](args);

      // Assert
      expect(args.requestModel.eventTicket14Model).toEqual({
        transIds: ['123', '456']
      });
    });

    it('should map event for wrong score', () => {
      // Arrange
      const args = {
        requestModel: new RequestModel(),
        detailViewModel: {
          request: {
            issueTypeId: 1
          },
          wrongScoreModels: [{
            matchId: 123
          }]
        } as RequestDetailViewModel,
        primitiveProperty: new PrimitiveProperty()
      };

      (StaticService.checkAllIssueTypes as jest.Mock).mockReturnValue({
        isWrongScore: true
      });

      // Act
      service['mapEvent'](args);

      // Assert
      expect(args.requestModel.wrongScoreModels).toEqual([{
        matchId: 123
      }]);
      expect(args.primitiveProperty.matchId).toBe(123);
    });
  });

  describe('mapOthers', () => {
    it('should map others correctly', () => {
      // Arrange
      const requestModel = new RequestModel();
      const detailViewModel = {
        request: {
          mistakenBy: 'user1',
          decidedBy: 'user2',
          operators: ['op1', 'op2'],
          provider: 'provider1',
          source: 'source1',
          remark: 'test remark'
        }
      } as unknown as RequestDetailViewModel;

      // Act
      service['mapOthers'](requestModel, detailViewModel);

      // Assert
      expect(requestModel.others).toEqual({
        mistakenBy: 'user1',
        decidedBy: 'user2',
        operatorsList: ['op1', 'op2'],
        provider: 'provider1',
        source: 'source1',
        remark: 'test remark'
      });
    });
  });
});
