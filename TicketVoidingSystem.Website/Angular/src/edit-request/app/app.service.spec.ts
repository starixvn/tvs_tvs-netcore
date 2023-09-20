import { HttpService } from '../../utility/services/http.service';
import { AppService } from './app.service';
import { RequestDetailModel, RequestDetailViewModel } from './request.model';

jest.mock('../../utility/services/http.service');
describe('AppService', () => {
  let mockHttpService: jest.Mocked<HttpService>;
  let appService: AppService;

  beforeEach(() => {
      mockHttpService = new HttpService(null) as jest.Mocked<HttpService>;
      appService = new AppService(mockHttpService);
  });

  it('#getRequestById should return expected data', async () => {
    // Arrange
    const fakeRequestDetailModel: RequestDetailModel = {
      actionId: 1,
      decidedBy: null,
      isTest: false,
      isVoided: false,
      issueTypeId: 11,
      mistakenBy: null,
      operators: [],
      provider: null,
      remark: 'test',
      requestedBy: "sa",
      source: null,
      sportType: 2,
      voidedBy: null,
      userId: 0,
      requestId: 1
    };
    const fakeRequestDetailViewModel: RequestDetailViewModel = {
      requestId: 111,
      lastModifiedDate: null,
      request: fakeRequestDetailModel,
      event: null,
      messages: [],
      wrongScoreModels: [],
      dangerAcceptedModels: [],
      redCardModels: [],
      wrongHdpModels: [],
      wrongOuModels: [],
      wrongOddsModels: [],
      reducedOverModels: [],
      duplicateTicketsModel: null,
      notParticipateModels: []
    };
    mockHttpService.getJson.mockResolvedValue(fakeRequestDetailViewModel);

    // Action
    const actualData = await appService.getRequestById(12345);

    // Assert
    expect(actualData).toStrictEqual(fakeRequestDetailViewModel);
  });
});
