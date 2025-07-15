import { TestBed } from '@angular/core/testing';
import { OthersService } from './others.service';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { HttpService } from '../../../../utility/services/http.service';
import { OperatorInfo, Provider } from './others.model';

describe('OthersService', () => {
  let service: OthersService;
  let httpService: HttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [OthersService]
    });

    service = TestBed.inject(OthersService);
    httpService = TestBed.inject(HttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getOperators', () => {
    it('should call httpService.postJson with correct parameters', async () => {
      // Arrange
      const matchIds = '123,456';
      const mockOperators: OperatorInfo[] = [
        { 
          matchId: 123,
          operatorId: 1,
          operatorType: 1,
          userName: 'Operator 1',
          groupName: 'Group 1'
        },
        { 
          matchId: 456,
          operatorId: 2,
          operatorType: 2,
          userName: 'Operator 2',
          groupName: 'Group 2'
        }
      ];

      jest.spyOn(httpService, 'postJson').mockResolvedValue(mockOperators);

      // Act
      const result = await service.getOperators(matchIds);

      // Assert
      expect(httpService.postJson).toHaveBeenCalledWith(
        { matchIds },
        'api/AddRequest/GetOperators'
      );
      expect(result).toEqual(mockOperators);
    });

    it('should handle empty matchIds', async () => {
      // Arrange
      const matchIds = '';
      const mockOperators: OperatorInfo[] = [];

      jest.spyOn(httpService, 'postJson').mockResolvedValue(mockOperators);

      // Act
      const result = await service.getOperators(matchIds);

      // Assert
      expect(httpService.postJson).toHaveBeenCalledWith(
        { matchIds },
        'api/AddRequest/GetOperators'
      );
      expect(result).toEqual(mockOperators);
    });
  });

  describe('getProvider', () => {
    it('should call httpService.postJson with correct parameters', async () => {
      // Arrange
      const matchId = 123;
      const mockProvider: Provider = {
        matchId: 123,
        providerName: 'Provider 1'
      };

      jest.spyOn(httpService, 'postJson').mockResolvedValue(mockProvider);

      // Act
      const result = await service.getProvider(matchId);

      // Assert
      expect(httpService.postJson).toHaveBeenCalledWith(
        { matchId },
        'api/AddRequest/GetProvider'
      );
      expect(result).toEqual(mockProvider);
    });

    it('should handle invalid matchId', async () => {
      // Arrange
      const matchId = 0;
      const mockProvider: Provider = {
        matchId: 0,
        providerName: ''
      };

      jest.spyOn(httpService, 'postJson').mockResolvedValue(mockProvider);

      // Act
      const result = await service.getProvider(matchId);

      // Assert
      expect(httpService.postJson).toHaveBeenCalledWith(
        { matchId },
        'api/AddRequest/GetProvider'
      );
      expect(result).toEqual(mockProvider);
    });
  });
});
