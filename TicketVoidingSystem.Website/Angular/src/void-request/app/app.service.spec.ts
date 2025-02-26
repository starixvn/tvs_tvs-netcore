import { TestBed } from '@angular/core/testing';
import { TestingModule } from '../../utility/modules/testing.module';
import { RequestDetailModel, RequestDetailViewModel } from '../../edit-request/app/request.model';
import { Result } from '../../utility/models/result';
import { HttpService } from '../../utility/services/http.service';
import { AppService } from './app.service';
import { GetTicketsQuery } from './models/get-tickets.query';
import { RequestLastModifiedDate } from './models/request-last-modified-date.model';
import { InsertQueueResult, VoidTicketsQuery } from './models/void-tickets.query';
import { TicketsModel } from './tickets-list/tickets.model';

class Helper {
  static fakeDate = '2020-01-16 00:00:00.000';
}

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

  it('#getRemark should return expected data', async () => {
    // Arrange
    const expectedData = [
      'You can void "Settled" or "Unsettled" tickets.',
      'You can void "Instantly Settled" tickets settled by Instant Settlement during live time.'
    ];
    httpService.getJson.mockResolvedValue(expectedData);

    // Action
    const actualData = await appService.getRemark();

    // Assert
    expect(actualData).toStrictEqual(expectedData);
  });

  it('#getRequestById should return expected data', async () => {
    // Arrange
    const requestDetailModel: RequestDetailModel = {
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
      requestId: 1,
      briefInfoNote: ''
    };
    const fakeRequestDetailViewModel: RequestDetailViewModel = {
      requestId: 5002,
      lastModifiedDate: null,
      event: null,
      playerNames: [],
      wrongScoreModels: [],
      dangerAcceptedModels: [],
      redCardModels: [],
      request: requestDetailModel,
      wrongHdpModels: [],
      wrongOuModels: [],
      wrongOddsModels: [],
      reducedOverModels: [],
      duplicateTicketsModel: null,
      notParticipateModels: []
    };
    httpService.getJson.mockResolvedValue(fakeRequestDetailViewModel);

    // Action
    const actualData = await appService.getRequestById(47760);

    // Assert
    expect(actualData).toEqual(fakeRequestDetailViewModel);
  });


  it('#getTickets should return expected data', async () => {
    // Arrange
    const expectedData = new TicketsModel();
    expectedData.total = 1;
    httpService.postJson.mockResolvedValue(expectedData);

    // Action
    const actualData = await appService.getTickets(new GetTicketsQuery());

    // Assert
    expect(actualData.total).toEqual(expectedData.total);
  });

  it('#getTicketsMini should return expected data', async () => {
    // Arrange
    const expectedData = new TicketsModel();
    expectedData.total = 1;
    httpService.postJson.mockResolvedValue(expectedData);

    // Action
    const actualData = await appService.getTicketsMini(new GetTicketsQuery());

    // Assert
    expect(actualData.total).toEqual(expectedData.total);
  });

  it('#insertQueue should return expected data', async () => {
    // Arrange
    const expectedData: Result<InsertQueueResult> = {
      errorCode: 0,
      errorMsg: '',
      isSuccessful: false,
      data: { historyId: 1 }
    };
    httpService.postJson.mockResolvedValue(expectedData);

    // Action
    const actualData = await appService.insertQueue(new VoidTicketsQuery());

    // Assert
    expect(actualData).toEqual(expectedData);
  });

  it('#exportExcel should call #downloadFile with expected params', async () => {
    // Arrange
    const query = new GetTicketsQuery();
    const url = `api/VoidRequest/ExportExcel`;
    httpService.downloadFile = jest.fn();

    // Action
    await appService.exportExcel(query);

    // Assert
    expect(httpService.downloadFile).toHaveBeenCalledWith(query, url);
  });


  it('#getLastModifiedDate should return expected data', async () => {
    // Arrange
    const expectedData = new RequestLastModifiedDate();
    expectedData.lastModifiedDate = new Date(Helper.fakeDate);
    httpService.postJson.mockResolvedValue(expectedData);

    // Action
    const actualData = await appService.getLastModifiedDate(1);

    // Assert
    expect(actualData.lastModifiedDate).toEqual(expectedData.lastModifiedDate);
  });
});
