import { TestBed } from '@angular/core/testing';
import { EventBaseService } from './event-base.service';
import { CommonService } from '../../../utility/services/common.service';
import { IssueType, SubIssueType, IssueTypesModel } from '../../../utility/models/issue-type.model';
import { TestingModule } from '../../../utility/modules/testing.module';

describe('EventBaseService', () => {
  let service: EventBaseService;
  let commonService: CommonService;

  // Mock data for testing
  const mockIssueTypes: IssueType[] = [
    { issueTypeId: 1, issueTypeName: 'Issue Type 1' },
    { issueTypeId: 2, issueTypeName: 'Issue Type 2' },
    { issueTypeId: 3, issueTypeName: 'Issue Type 3' }
  ];

  const mockSubIssueTypes: SubIssueType[] = [
    { subIssueTypeId: 1, issueTypeId: 1, subIssueTypeName: 'Sub Issue 1', subIssueTypeNameCS: 'Sub Issue 1 CS' },
    { subIssueTypeId: 2, issueTypeId: 1, subIssueTypeName: 'Sub Issue 2', subIssueTypeNameCS: 'Sub Issue 2 CS' },
    { subIssueTypeId: 3, issueTypeId: 2, subIssueTypeName: 'Sub Issue 3', subIssueTypeNameCS: 'Sub Issue 3 CS' },
    { subIssueTypeId: 4, issueTypeId: 3, subIssueTypeName: 'Sub Issue 4', subIssueTypeNameCS: 'Sub Issue 4 CS' }
  ];

  const mockIssueTypesModel: IssueTypesModel = {
    issueTypes: mockIssueTypes,
    subIssueTypes: mockSubIssueTypes
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        CommonService
      ]
    });

    service = TestBed.inject(EventBaseService);
    commonService = TestBed.inject(CommonService);

    // Mock các function của CommonService
    jest.spyOn(commonService, 'getIssueTypes').mockResolvedValue(mockIssueTypesModel);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('backToAccessDeniedPage', () => {
    it('should call window.location.assign with correct URL', () => {
      // Arrange
      const expectedUrl = 'Home/AccessDenied';
      const mockAssign = jest.fn();
      Object.defineProperty(window, 'location', {
        value: { assign: mockAssign },
        writable: true
      });

      // Act
      service.backToAccessDeniedPage();

      // Assert
      expect(mockAssign).toHaveBeenCalledWith(expectedUrl);
    });

    it('should call window.location.assign only once', () => {
      // Arrange
      const mockAssign = jest.fn();
      Object.defineProperty(window, 'location', {
        value: { assign: mockAssign },
        writable: true
      });

      // Act
      service.backToAccessDeniedPage();

      // Assert
      expect(mockAssign).toHaveBeenCalledTimes(1);
    });
  });

  describe('backToManagePage', () => {
    it('should call window.location.assign with correct URL', () => {
      // Arrange
      const expectedUrl = 'TicketVoidingSystem/ManageRequest/Index';
      const mockAssign = jest.fn();
      Object.defineProperty(window, 'location', {
        value: { assign: mockAssign },
        writable: true
      });

      // Act
      service.backToManagePage();

      // Assert
      expect(mockAssign).toHaveBeenCalledWith(expectedUrl);
    });

    it('should call window.location.assign only once', () => {
      // Arrange
      const mockAssign = jest.fn();
      Object.defineProperty(window, 'location', {
        value: { assign: mockAssign },
        writable: true
      });

      // Act
      service.backToManagePage();

      // Assert
      expect(mockAssign).toHaveBeenCalledTimes(1);
    });

    it('should return void', () => {
      // Arrange
      const mockAssign = jest.fn();
      Object.defineProperty(window, 'location', {
        value: { assign: mockAssign },
        writable: true
      });

      // Act
      const result = service.backToManagePage();

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('getSubIssueTypes', () => {
    beforeEach(() => {
      // Setup default spy behavior - đã được setup ở beforeEach chính
    });

    it('should call commonService.getIssueTypes once', async () => {
      // Act
      await service.getSubIssueTypes(1);

      // Assert
      expect(commonService.getIssueTypes).toHaveBeenCalledTimes(1);
    });

    it('should return filtered issue types and sub issue types for given issueTypeId', async () => {
      // Arrange
      const issueTypeId = 1;
      const expectedResult = {
        issueTypes: mockIssueTypes.filter(x => x.issueTypeId === issueTypeId),
        subIssueTypes: mockSubIssueTypes.filter(x => x.issueTypeId === issueTypeId)
      };

      // Act
      const result = await service.getSubIssueTypes(issueTypeId);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(result.issueTypes).toHaveLength(1);
      expect(result.issueTypes[0].issueTypeId).toBe(issueTypeId);
      expect(result.subIssueTypes).toHaveLength(2);
      expect(result.subIssueTypes.every(sub => sub.issueTypeId === issueTypeId)).toBe(true);
    });

    it('should return empty arrays when no matching issueTypeId is found', async () => {
      // Arrange
      const issueTypeId = 999; // Non-existent ID
      const expectedResult = {
        issueTypes: [],
        subIssueTypes: []
      };

      // Act
      const result = await service.getSubIssueTypes(issueTypeId);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(result.issueTypes).toHaveLength(0);
      expect(result.subIssueTypes).toHaveLength(0);
    });

    it('should return correct data for issueTypeId 2', async () => {
      // Arrange
      const issueTypeId = 2;
      const expectedIssueTypes = mockIssueTypes.filter(x => x.issueTypeId === issueTypeId);
      const expectedSubIssueTypes = mockSubIssueTypes.filter(x => x.issueTypeId === issueTypeId);

      // Act
      const result = await service.getSubIssueTypes(issueTypeId);

      // Assert
      expect(result.issueTypes).toEqual(expectedIssueTypes);
      expect(result.subIssueTypes).toEqual(expectedSubIssueTypes);
      expect(result.issueTypes).toHaveLength(1);
      expect(result.subIssueTypes).toHaveLength(1);
    });

    it('should return correct data for issueTypeId 3', async () => {
      // Arrange
      const issueTypeId = 3;
      const expectedIssueTypes = mockIssueTypes.filter(x => x.issueTypeId === issueTypeId);
      const expectedSubIssueTypes = mockSubIssueTypes.filter(x => x.issueTypeId === issueTypeId);

      // Act
      const result = await service.getSubIssueTypes(issueTypeId);

      // Assert
      expect(result.issueTypes).toEqual(expectedIssueTypes);
      expect(result.subIssueTypes).toEqual(expectedSubIssueTypes);
      expect(result.issueTypes).toHaveLength(1);
      expect(result.subIssueTypes).toHaveLength(1);
    });

    it('should handle empty data from commonService', async () => {
      // Arrange
      const emptyData: IssueTypesModel = {
        issueTypes: [],
        subIssueTypes: []
      };
      jest.spyOn(commonService, 'getIssueTypes').mockResolvedValue(emptyData);
      const issueTypeId = 1;

      // Act
      const result = await service.getSubIssueTypes(issueTypeId);

      // Assert
      expect(result.issueTypes).toEqual([]);
      expect(result.subIssueTypes).toEqual([]);
    });

    it('should handle null data from commonService', async () => {
      // Arrange
      const nullData: IssueTypesModel = {
        issueTypes: null as any,
        subIssueTypes: null as any
      };
      jest.spyOn(commonService, 'getIssueTypes').mockResolvedValue(nullData);
      const issueTypeId = 1;

      // Act
      const result = await service.getSubIssueTypes(issueTypeId);

      // Assert
      expect(result.issueTypes).toEqual([]);
      expect(result.subIssueTypes).toEqual([]);
    });

    it('should handle undefined data from commonService', async () => {
      // Arrange
      const undefinedData: IssueTypesModel = {
        issueTypes: undefined as any,
        subIssueTypes: undefined as any
      };
      jest.spyOn(commonService, 'getIssueTypes').mockResolvedValue(undefinedData);
      const issueTypeId = 1;

      // Act
      const result = await service.getSubIssueTypes(issueTypeId);

      // Assert
      expect(result.issueTypes).toEqual([]);
      expect(result.subIssueTypes).toEqual([]);
    });

    it('should handle error from commonService.getIssueTypes', async () => {
      // Arrange
      const error = new Error('API Error');
      jest.spyOn(commonService, 'getIssueTypes').mockRejectedValue(error);
      const issueTypeId = 1;

      // Act & Assert
      await expect(service.getSubIssueTypes(issueTypeId)).rejects.toThrow(error);
    });

    it('should handle zero issueTypeId', async () => {
      // Arrange
      const issueTypeId = 0;
      const expectedResult = {
        issueTypes: [],
        subIssueTypes: []
      };

      // Act
      const result = await service.getSubIssueTypes(issueTypeId);

      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('should handle negative issueTypeId', async () => {
      // Arrange
      const issueTypeId = -1;
      const expectedResult = {
        issueTypes: [],
        subIssueTypes: []
      };

      // Act
      const result = await service.getSubIssueTypes(issueTypeId);

      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('should handle decimal issueTypeId', async () => {
      // Arrange
      const issueTypeId = 1.5;
      const expectedResult = {
        issueTypes: [],
        subIssueTypes: []
      };

      // Act
      const result = await service.getSubIssueTypes(issueTypeId);

      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('should return IssueTypes object with correct structure', async () => {
      // Arrange
      const issueTypeId = 1;

      // Act
      const result = await service.getSubIssueTypes(issueTypeId);

      // Assert
      expect(result).toHaveProperty('issueTypes');
      expect(result).toHaveProperty('subIssueTypes');
      expect(Array.isArray(result.issueTypes)).toBe(true);
      expect(Array.isArray(result.subIssueTypes)).toBe(true);
    });
  });

  describe('Service Dependencies', () => {
    it('should have commonService injected', () => {
      // Assert
      expect(service.commonService).toBeDefined();
      expect(service.commonService).toBe(commonService);
    });

    it('should be injectable', () => {
      // Assert
      expect(service).toBeInstanceOf(EventBaseService);
    });

    it('should inject services using TestBed.inject', () => {
      // Assert
      expect(service).toBeTruthy();
      expect(commonService).toBeTruthy();
      expect(commonService).toBeInstanceOf(CommonService);
    });
  });

  describe('Integration Tests', () => {
    it('should work with real window.location object', () => {
      // Arrange
      const mockAssign = jest.fn();
      Object.defineProperty(window, 'location', {
        value: { assign: mockAssign },
        writable: true
      });

      // Act
      service.backToAccessDeniedPage();
      service.backToManagePage();

      // Assert
      expect(mockAssign).toHaveBeenCalledWith('Home/AccessDenied');
      expect(mockAssign).toHaveBeenCalledWith('TicketVoidingSystem/ManageRequest/Index');
    });
  });
}); 