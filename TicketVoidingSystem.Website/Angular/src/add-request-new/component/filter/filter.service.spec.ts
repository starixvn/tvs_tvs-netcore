import { TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { HttpService } from '../../../utility/services/http.service';
import { FilterService } from './filter.service';
import { IssueTypes } from './issue-types.model';

describe('FilterService', () => {
  let service: FilterService;
  let httpService: HttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [FilterService]
    });

    service = TestBed.inject(FilterService);
    httpService = TestBed.inject(HttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getIssueTypes', () => {
    it('should call HttpService.getJson with correct endpoint', async () => {
      // Arrange
      const mockIssueTypes: IssueTypes = {
        issueTypes: [
          { issueTypeId: 1, issueTypeName: 'Issue Type 1' },
          { issueTypeId: 2, issueTypeName: 'Issue Type 2' }
        ],
        subIssueTypes: [
          {
            subIssueTypeId: 1,
            issueTypeId: 1,
            subIssueTypeName: 'Sub Issue 1',
            subIssueTypeNameCS: 'Sub Issue 1 CS'
          }
        ],
        issueId: 1,
        subIssueTypes: [],
        subIssueId: 1
      };

      jest.spyOn(httpService, 'getJson').mockResolvedValue(mockIssueTypes);

      // Act
      const result = await service.getIssueTypes();

      // Assert
      expect(httpService.getJson).toHaveBeenCalledWith('api/SharedApi/GetIssueTypes');
      expect(result).toEqual(mockIssueTypes);
    });

    it('should handle error when API call fails', async () => {
      // Arrange
      const mockError = new Error('API Error');
      jest.spyOn(httpService, 'getJson').mockRejectedValue(mockError);

      // Act & Assert
      await expect(service.getIssueTypes()).rejects.toThrow('API Error');
    });
  });
});
