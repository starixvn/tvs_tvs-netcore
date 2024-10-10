import { HttpService } from '../../../../utility/services/http.service';
import { FilterService } from './filter.service';

jest.mock('../../../../utility/services/http.service');
describe('FilterService', () => {
  let mockHttpService: jest.Mocked<HttpService>;
  let filterService: FilterService;

  beforeEach(() => {
      mockHttpService = new HttpService(null) as jest.Mocked<HttpService>;
      filterService = new FilterService(mockHttpService);
  });

  it('#getIssueTypes should return expected data', async() => {
    // Arrange
    const expectedIssueTypes = {
      issueTypes: [
        {
          issueTypeId: 1,
          issueTypeName: 'Danger Accepted',
        },
        {
          issueTypeId: 11,
          issueTypeName: 'Abnormal Bet',
        }
      ],
      subIssueTypes: [],
      issueId: '',
      selectedSubIssueTypes: [],
      subIssueId: ''
    };
    mockHttpService.getJson.mockResolvedValue(expectedIssueTypes);

    // Action
    const actualResult = await filterService.getIssueTypes();

    // Assert
    expect(actualResult).toStrictEqual(expectedIssueTypes);
  });
});
