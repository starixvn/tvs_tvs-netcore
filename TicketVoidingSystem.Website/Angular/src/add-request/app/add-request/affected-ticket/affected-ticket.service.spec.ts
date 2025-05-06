import { TestBed } from '@angular/core/testing';
import { AffectedTicketService } from './affected-ticket.service';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { AddRequestApiService } from '../add-request-api.service';
import { TicketsModel } from '../pool-house-ticket/tickets/tickets.model';

describe('AffectedTicketService', () => {
  let service: AffectedTicketService;
  let addRequestApiService: AddRequestApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [AffectedTicketService]
    });

    service = TestBed.inject(AffectedTicketService);
    addRequestApiService = TestBed.inject(AddRequestApiService);
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
      expect(result).toBeInstanceOf(TicketsModel);
      expect(result).toEqual(new TicketsModel());
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

      jest.spyOn(addRequestApiService, 'GetLogInfoTickets').mockResolvedValue(mockApiResponse);
      jest.spyOn(TicketsModel.prototype, 'initData');

      // Act
      const result = await service.getAffectedTickets(issueTypeId, logInfoTicketsJson);

      // Assert
      expect(addRequestApiService.GetLogInfoTickets).toHaveBeenCalledWith({
        logInfoTicketsJson,
        issueTypeId
      });
      expect(TicketsModel.prototype.initData).toHaveBeenCalledWith(mockApiResponse);
      expect(result).toBeInstanceOf(TicketsModel);
    });

    it('should handle API error gracefully', async () => {
      // Arrange
      const issueTypeId = 1;
      const logInfoTicketsJson = '{"someData": "test"}';
      const mockError = new Error('API Error');

      jest.spyOn(addRequestApiService, 'GetLogInfoTickets').mockRejectedValue(mockError);

      // Act & Assert
      await expect(service.getAffectedTickets(issueTypeId, logInfoTicketsJson))
        .rejects
        .toThrow('API Error');
    });
  });
}); 