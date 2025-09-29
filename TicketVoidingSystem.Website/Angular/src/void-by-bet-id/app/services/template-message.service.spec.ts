import { TestBed } from '@angular/core/testing';
import { TemplateMessageService } from './template-message.service';
import { TemplateService } from '../../../utility/components/template-message/template-message/services/template.service';
import { TemplateValue } from '../../../utility/components/template-message/template-message/template.model';
import { MatchModel } from '../../../utility/models/match.model';
import { AbnormalFilterBy } from '../../../utility/constants/config';
import { TicketsViewModel } from '../model/get-tickets.query';
import { MessagesResult } from '../../../utility/components/messages-result/messages-result.model';
import { Result } from '../../../utility/models/result';
import { TestingModule } from '../../../utility/modules/testing.module';

describe('TemplateMessageService', () => {
  let service: TemplateMessageService;
  let templateService: TemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [TemplateMessageService, TemplateService]
    });

    service = TestBed.inject(TemplateMessageService);
    templateService = TestBed.inject(TemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generateTemplateValue', () => {
    it('should generate template value with match data when matchId exists', () => {
      // Arrange
      const abnormalBetType = '1';
      const matchViewModel: MatchModel = {
        matchId: '123',
      } as unknown as MatchModel;
      const ticketsViewModel = {
        totalItems: 5,
        groups: []
      } as unknown as TicketsViewModel;

      const mockTemplateValue = new TemplateValue();
      templateService.initializeTemplateValue = jest.fn().mockReturnValue(mockTemplateValue);

      // Act
      const result = service.generateTemplateValue(abnormalBetType, matchViewModel, ticketsViewModel);

      // Assert
      expect(templateService.initializeTemplateValue).toHaveBeenCalledWith(matchViewModel);
      expect(result.filterBy).toBe(Number(abnormalBetType));
      expect(result.isVoidByBetId).toBe(true);
      expect(result.totalTickets).toBe(5);
      expect(result.checkSettled).toBe(false);
    });

    it('should generate template value with MIX_PARLAY filter when abnormalBetType is MIX_PARLAY', () => {
      // Arrange
      const abnormalBetType = AbnormalFilterBy.MIX_PARLAY.toString();
      const matchViewModel = {} as MatchModel;
      const ticketsViewModel = {
        totalItems: 3,
        groups: []
      } as unknown as TicketsViewModel;

      // Act
      const result = service.generateTemplateValue(abnormalBetType, matchViewModel, ticketsViewModel);

      // Assert
      expect(result.filterBy).toBe(AbnormalFilterBy.MIX_PARLAY);
      expect(result.totalTickets).toBe(3);
      expect(result.checkSettled).toBe(false);
    });

    it('should generate template value with MANY_MATCH filter when abnormalBetType is not MIX_PARLAY', () => {
      // Arrange
      const abnormalBetType = '2';
      const matchViewModel = {} as MatchModel;
      const ticketsViewModel = {
        totalItems: 2,
        groups: []
      } as unknown as TicketsViewModel;

      // Act
      const result = service.generateTemplateValue(abnormalBetType, matchViewModel, ticketsViewModel);

      // Assert
      expect(result.filterBy).toBe(AbnormalFilterBy.MANY_MATCH);
      expect(result.totalTickets).toBe(2);
      expect(result.checkSettled).toBe(false);
    });
  });

  describe('updateMessagesResult', () => {
    it('should update messages result with void bet result', () => {
      // Arrange
      const messagesResult = new MessagesResult();
      const results: Result<null>[] = [
        { isSuccessful: true, errorCode: 0, errorMsg: '' },
        { isSuccessful: false, errorCode: 1, errorMsg: 'Failed' }
      ];

      // Act
      const result = service.updateMessagesResult(messagesResult, results);

      // Assert
      expect(result.isShow).toBe(true);
      expect(result.header).toBe('Void Bet Result');
      expect(result.results).toEqual(results);
      expect(result).not.toBe(messagesResult); // Should return a clone
    });
  });
}); 