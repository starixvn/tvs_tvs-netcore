import { GeneralInfo, GeneralInfoViewModel } from '../../utility/components/request-info/request-info.model';
import { Result } from '../../utility/models/result';
import { HttpService } from '../../utility/services/http.service';
import { AppService } from './app.service';
import { GetGeneralInfoQuery } from './models/get-general-info.query';
import { GetRequestsQuery } from './models/get-requests.query';
import { RequestModel } from './request-list/request.model';
import { TicketsModel } from './ticket-list/tickets/tickets.model';
import { TicketsQuery } from './ticket-list/tickets/tickets.query';

jest.mock('../../utility/services/http.service');

class Helper {
  static readonly fakeDate = '2019-11-18 12:08:49.737';
  static readonly fakeGeneralInfo : GeneralInfo = {
    voidedTimeString: '',
    voidingHistoryIds: '',
    kickOffTimeString: Helper.fakeDate,
    leagueName: '',
    matchEvent: 'MU - vs Barca',
    licenseeNames: '',
    totalTicketsProcessed: 1,
    decidedBy: '',
    requestedBy: '',
    negativeBalanceUsers: '',
    generalBetTypeCombinations: '',
    scoreResult: '',
    reason: '',
    totalCancelCashOutProcessed: 0,
    cancelCashOutLicenseesName: '',
    singleTransIds: ''
  } as GeneralInfo;
}

describe('AppService', () => {
  let mockHttpService: jest.Mocked<HttpService>;
  let appService: AppService;

  beforeEach(() => {
    mockHttpService = new HttpService(null) as jest.Mocked<HttpService>;
    appService = new AppService(mockHttpService);
  });

  it('#getRequests should return expected data', async () => {
    // Arrange
    const requestModel: RequestModel = {
      requestId: 47243,
      issueTypeId: 8,
      actionId: 1,
      createdBy: 'starix60',
      createdDate: new Date('2020-01-15 01:17:24.353'),
      mistakenBy: null,
      decidedBy: null,
      lastPerformedBy: null,
      checkedBy: null,
      isCheckedBy: false,
      eventDate: new Date('2020-01-14 00:00:00.000'),
      details: [],
      status: 'Completed',
    };
    const expectedData: RequestModel[] = [requestModel];
    mockHttpService.postJson.mockResolvedValue(expectedData);

    // Action
    const actualData = await appService.getRequests(new GetRequestsQuery());

    // Assert
    expect(actualData).toEqual(expectedData);
  });

  it('#exportRequest should call #downloadFile with expected params', async() => {
    // Arrange
    const query = new GetRequestsQuery();
    const url = `api/ManageRequest/ExportRequest`;
    mockHttpService.downloadFile = jest.fn();

    // Action
   await appService.exportRequest(query);

    // Assert
    expect(mockHttpService.downloadFile).toHaveBeenCalledWith(query, url);
  });

  it('#getVoidedTickets should return expected data', async() => {
    // Arrange
    const expectedData: TicketsModel = {
      groups: [
        {
          name: 'Deposit',
          displayTotalTickets: 4,
          isCollapse: false,
          tickets: []
        }
      ],
      totalTicketsProcessed: 0,
      totalCancelCashOutProcessed: 0,
      licenseeNames: '',
      generalBetTypeCombinations: '',
      cancelCashOutLicenseesName: ''
    };
    mockHttpService.postJson.mockResolvedValue(expectedData);

    // Action
    const actualData = await appService.getVoidedTickets(new TicketsQuery());

    // Assert
    expect(actualData).toEqual(expectedData);
  });

  it('#exportTickets should call #downloadFile with expected params', async() => {
    // Arrange
    const query = new TicketsQuery();
    const url = `api/ManageRequest/ExportVoidedTickets`;
    mockHttpService.downloadFile = jest.fn();

    // Action
   await appService.exportTickets(query);

    // Assert
    expect(mockHttpService.downloadFile).toHaveBeenCalledWith(query, url);
  });

  it('#checkBy should return expected data', async() => {
    // Arrange
    const expectedData: Result<string> = {
      errorCode: 0,
      errorMsg: '',
      isSuccessful: true
    };
    mockHttpService.postJson.mockResolvedValue(expectedData);

    // Action
    const actualData = await appService.checkBy(12345, true);

    // Assert
    expect(actualData).toEqual(expectedData);
  });

  it('#getGeneralInfo should return expected data', async() => {
    // Arrange

    const generalInfoViewModel: GeneralInfoViewModel = {
      generalInfoModel: Helper.fakeGeneralInfo,
      userVoidMessages: [],
      succeedEmails: [],
      failedEmails: [],
    };
    const expectedData = [generalInfoViewModel];
    const query = new GetGeneralInfoQuery();
    mockHttpService.postJson.mockResolvedValue(expectedData);

    // Action
    const actualData = await appService.getGeneralInfo(query);

    // Assert
    expect(actualData).toEqual(expectedData);
  });
});
