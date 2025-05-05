import { TestBed } from '@angular/core/testing';
import { TestingModule } from '../../utility/modules/testing.module';
import { HttpService } from '../../utility/services/http.service';
import { AppService } from './app.service';
import { RequestDetailViewModel, RequestDetailModel, RequestEventModel } from './request.model';

jest.mock('../../utility/services/http.service');

describe('AppService', () => {
  let httpService: jest.Mocked<HttpService>;
  let appService: AppService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [AppService, HttpService]
    });
    httpService = TestBed.inject(HttpService) as jest.Mocked<HttpService>;
    appService = TestBed.inject(AppService);
  });

  it('#getRequestById should return expected data', async () => {
    // Arrange
    const id = 1;
    const expectedData = {
      requestId: 1,
      playerNames: [],
      lastModifiedDate: new Date(),
      request: {
        requestId: 1,
        sportType: 1,
        issueTypeId: 1,
        actionId: 1,
        mistakenBy: 'Test User',
        decidedBy: 'Test Admin',
        operators: [],
        provider: 'Test Provider',
        source: 'Test Source',
        remark: 'Test Remark',
        isTest: false,
        isVoided: false,
        requestedBy: 'Test User',
        userId: 1,
        voidedBy: '',
        briefInfoNote: 'Test Note'
      } as RequestDetailModel,
      event: {
        matchId: 1,
        subIssueTypeId: 1,
        eventDate: new Date(),
        parentId: 1,
        leagueId: 1,
        homeId: 1,
        awayId: 1,
        kickOffTime: new Date(),
        transIds: '1,2,3',
        voidFromTime: new Date(),
        voidToTime: new Date()
      } as RequestEventModel
    } as RequestDetailViewModel;
    httpService.getJson.mockResolvedValue(expectedData);

    // Action
    const actualData = await appService.getRequestById(id);

    // Assert
    expect(actualData).toStrictEqual(expectedData);
    expect(httpService.getJson).toHaveBeenCalledWith(`api/ManageRequest/GetRequest/${id}`);
  });

  it('#getRequestById should handle error case', async () => {
    // Arrange
    const id = 1;
    const error = new Error('API Error');
    httpService.getJson.mockRejectedValue(error);

    // Action & Assert
    await expect(appService.getRequestById(id)).rejects.toThrow('API Error');
    expect(httpService.getJson).toHaveBeenCalledWith(`api/ManageRequest/GetRequest/${id}`);
  });
});
