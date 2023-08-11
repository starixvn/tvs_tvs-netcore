import { HttpService } from '../../../../utility/services/http.service';
import { Provider } from './others.model';
import { OthersService } from './others.service';

jest.mock('../../../../utility/services/http.service');
describe('OthersService', () => {
    let mockHttpService: jest.Mocked<HttpService>;
    let othersService: OthersService;

    beforeEach(() => {
        mockHttpService = new HttpService(null) as jest.Mocked<HttpService>;
        othersService = new OthersService(mockHttpService);
    });

  it('#getOperators should return expected data', async() => {
    // Arrange
    const expectedOperatorInfo = [
      { matchId: 0, userName: 'UserA', groupName: 'Trader', operatorId: 1, operatorType: 1 },
      { matchId: 0, userName: 'UserB', groupName: 'Trader', operatorId: 1, operatorType: 1 },
      { matchId: 0, userName: 'UserC', groupName: 'Suspender', operatorId: 2, operatorType: 2 },
      { matchId: 0, userName: 'UserD', groupName: 'Suspender', operatorId: 2, operatorType: 2 },
    ];
    mockHttpService.postJson.mockResolvedValue(expectedOperatorInfo);

    // Action
    const actualResult = await othersService.getOperators('0');

    // Assert
    expect(actualResult).toBe(expectedOperatorInfo);
  });
  
  it('#getProvider should return expected data', async() => {
    // Arrange
    const expectedProvider: Provider[] = [
      { matchId: 0, providerName: 'UserA'},
      { matchId: 1, providerName: 'UserB'},
    ];
    mockHttpService.postJson.mockResolvedValue(expectedProvider);

    // Action
    const actualResult = await othersService.getProvider('0');

    // Assert
    expect(actualResult).toBe(expectedProvider);
  });
});