import { TestBed } from '@angular/core/testing';
import { AffectedTicketService } from './affected-ticket.service';
import { AddRequestApiService } from '../../services/add-request-api.service';
import { TicketsModel } from '../pool-house-ticket/tickets/tickets.model';
import { GroupService } from '../../../utility/components/tickets/group.service';
import { BetTypeCountModel } from '../../models/get-log-info.model';

// Mock TicketsModel to avoid injection issues
jest.mock('../pool-house-ticket/tickets/tickets.model', () => {
  return {
    TicketsModel: jest.fn().mockImplementation(() => ({
      totalSingle: 0,
      totalParlay: 0,
      selectedSingle: 0,
      selectedParlay: 0,
      isHasSettledTicket: false,
      fromTime: new Date(),
      toTime: new Date(),
      groups: [],
      groupOtherTickets: [],
      changeIconCheckBox: jest.fn(),
      initData: jest.fn()
    }))
  };
});

describe('AffectedTicketService', () => {
  let service: AffectedTicketService;
  let mockAddRequestApiService: jest.Mocked<AddRequestApiService>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    const mockAddRequestApiServiceSpy = {
      GetLogInfoTickets: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        AffectedTicketService,
        { provide: AddRequestApiService, useValue: mockAddRequestApiServiceSpy },
        GroupService
      ]
    });
    
    service = TestBed.inject(AffectedTicketService);
    mockAddRequestApiService = TestBed.inject(AddRequestApiService) as jest.Mocked<AddRequestApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAffectedTickets', () => {
    it('should return empty TicketsModel when logInfoTicketsJson is empty', async () => {
      // Arrange
      const issueTypeId = 1;
      const logInfoTicketsJson = '';

      // Act
      const result = await service.getAffectedTickets(issueTypeId, logInfoTicketsJson);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('totalSingle', 0);
      expect(result).toHaveProperty('totalParlay', 0);
    });

    it('should call API and initialize TicketsModel with result when logInfoTicketsJson is provided', async () => {
      // Arrange
      const issueTypeId = 1;
      const logInfoTicketsJson = '{"someData": "test"}';
      const mockApiResponse = {
        totalSingle: 0,
        totalParlay: 0,
        isHasSettledTicket: false,
        fromTime: new Date(),
        toTime: new Date(),
        groups: [],
        groupOtherTickets: []
      } as unknown as TicketsModel;

      mockAddRequestApiService.GetLogInfoTickets.mockResolvedValue(mockApiResponse);

      // Act
      const result = await service.getAffectedTickets(issueTypeId, logInfoTicketsJson);

      // Assert
      expect(mockAddRequestApiService.GetLogInfoTickets).toHaveBeenCalledWith({
        logInfoTicketsJson,
        issueTypeId
      });
      expect(result).toBeDefined();
      expect(result).toHaveProperty('initData');
    });

    it('should handle API error gracefully', async () => {
      // Arrange
      const issueTypeId = 1;
      const logInfoTicketsJson = '{"someData": "test"}';
      const mockError = new Error('API Error');

      mockAddRequestApiService.GetLogInfoTickets.mockRejectedValue(mockError);

      // Act & Assert
      await expect(service.getAffectedTickets(issueTypeId, logInfoTicketsJson))
        .rejects
        .toThrow('API Error');
    });
  });

  describe('updateBetTypeCountModel', () => {
    it('should return empty array when input is empty', () => {
      // Arrange
      const betTypeCount: BetTypeCountModel[] = [];

      // Act
      const result = service.updateBetTypeCountModel(betTypeCount);

      // Assert
      expect(result).toEqual([]);
    });

    it('should group items by betTypeId and betId', () => {
      // Arrange
      const betTypeCount: BetTypeCountModel[] = [
        {
          betTypeId: 1,
          betId: 1,
          betTypeName: 'Win',
          playerName: 'Player 1',
          ticketsCount: 5
        },
        {
          betTypeId: 1,
          betId: 1,
          betTypeName: 'Win',
          playerName: 'Player 2',
          ticketsCount: 3
        },
        {
          betTypeId: 2,
          betId: 1,
          betTypeName: 'Place',
          playerName: 'Player 3',
          ticketsCount: 2
        }
      ];

      // Act
      const result = service.updateBetTypeCountModel(betTypeCount);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Win:');
      expect(result[0].items).toHaveLength(2);
      expect(result[1].name).toBe('Place:');
      expect(result[1].items).toHaveLength(1);
    });

    it('should handle items without playerName correctly', () => {
      // Arrange
      const betTypeCount: BetTypeCountModel[] = [
        {
          betTypeId: 1,
          betId: 1,
          betTypeName: 'Win',
          playerName: null,
          ticketsCount: 5
        },
        {
          betTypeId: 2,
          betId: 1,
          betTypeName: 'Place',
          playerName: undefined,
          ticketsCount: 3
        }
      ];

      // Act
      const result = service.updateBetTypeCountModel(betTypeCount);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Win - 5 ticket(s)');
      expect(result[0].items).toHaveLength(0);
      expect(result[1].name).toBe('Place - 3 ticket(s)');
      expect(result[1].items).toHaveLength(0);
    });

    it('should handle mixed data with and without playerName', () => {
      // Arrange
      const betTypeCount: BetTypeCountModel[] = [
        {
          betTypeId: 1,
          betId: 1,
          betTypeName: 'Win',
          playerName: 'Player 1',
          ticketsCount: 5
        },
        {
          betTypeId: 1,
          betId: 1,
          betTypeName: 'Win',
          playerName: null,
          ticketsCount: 3
        },
        {
          betTypeId: 1,
          betId: 1,
          betTypeName: 'Win',
          playerName: 'Player 2',
          ticketsCount: 2
        }
      ];

      // Act
      const result = service.updateBetTypeCountModel(betTypeCount);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Win:');
      expect(result[0].items).toHaveLength(2);
      expect(result[0].items[0].name).toBe('Player 1 - 5 ticket(s)');
      expect(result[0].items[1].name).toBe('Player 2 - 2 ticket(s)');
    });

    it('should filter out items without playerName from child items', () => {
      // Arrange
      const betTypeCount: BetTypeCountModel[] = [
        {
          betTypeId: 1,
          betId: 1,
          betTypeName: 'Win',
          playerName: 'Player 1',
          ticketsCount: 5
        },
        {
          betTypeId: 1,
          betId: 1,
          betTypeName: 'Win',
          playerName: '',
          ticketsCount: 3
        },
        {
          betTypeId: 1,
          betId: 1,
          betTypeName: 'Win',
          playerName: 'Player 2',
          ticketsCount: 2
        }
      ];

      // Act
      const result = service.updateBetTypeCountModel(betTypeCount);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Win:');
      expect(result[0].items).toHaveLength(2);
      expect(result[0].items[0].name).toBe('Player 1 - 5 ticket(s)');
      expect(result[0].items[1].name).toBe('Player 2 - 2 ticket(s)');
    });

    it('should use first item playerName for group name when available', () => {
      // Arrange
      const betTypeCount: BetTypeCountModel[] = [
        {
          betTypeId: 1,
          betId: 1,
          betTypeName: 'Win',
          playerName: 'Player 1',
          ticketsCount: 5
        },
        {
          betTypeId: 1,
          betId: 1,
          betTypeName: 'Win',
          playerName: 'Player 2',
          ticketsCount: 3
        }
      ];

      // Act
      const result = service.updateBetTypeCountModel(betTypeCount);

      // Assert
      expect(result[0].name).toBe('Win:');
    });

    it('should use betTypeName and ticketsCount for group name when no playerName', () => {
      // Arrange
      const betTypeCount: BetTypeCountModel[] = [
        {
          betTypeId: 1,
          betId: 1,
          betTypeName: 'Win',
          playerName: null,
          ticketsCount: 5
        }
      ];

      // Act
      const result = service.updateBetTypeCountModel(betTypeCount);

      // Assert
      expect(result[0].name).toBe('Win - 5 ticket(s)');
    });
  });
}); 