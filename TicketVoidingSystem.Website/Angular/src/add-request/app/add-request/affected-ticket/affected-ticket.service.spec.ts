import { TestBed } from '@angular/core/testing';
import { AffectedTicketService } from './affected-ticket.service';
import { AddRequestApiService } from '../add-request-api.service';
import { TicketsModel } from '../pool-house-ticket/tickets/tickets.model';
import { GroupService } from '../../../../utility/components/tickets/group.service';

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
}); 