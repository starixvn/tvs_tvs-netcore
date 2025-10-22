import { TestBed } from '@angular/core/testing';
import { TemplateMessageService } from './template-message.service';
import { TemplateService } from '../../../../utility/components/template-message/template-message/services/template.service';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { EventType } from '../../../../utility/constants/sport.constant';
import { VoidWrongMarketOfferedModel } from '../models/void-wrong-market-offered.model';
import { Message } from '../../../../utility/components/template-message/messages/message';
import { MatchModel } from '../../../../utility/models/match.model';
import { TicketsModel } from '../../tickets-list/tickets.model';
import { TestingModule } from '../../../../utility/modules/testing.module';

class Helper {
  static readonly fakeMatchModel = {
    matchId: 100,
    sportType: 'Football',
    homeTeam: 'Team A',
    awayTeam: 'Team B'
  } as unknown as MatchModel;

  static readonly fakeVoidTicketsMini = {
    groupPHAffected: 'Group PH Test',
    isHasSettledTicket: true,
    isAllLiveTickets: true,
    total: 50,
    fromTime: '2023-01-01T10:00:00Z',
    toTime: '2023-01-01T12:00:00Z',
    betTypeNameReplaceMessage: {
      id: 1,
      message: 'Test bet type message'
    } as unknown as Message
  } as unknown as TicketsModel;

  static readonly fakeVoidTicketsMiniNonLive = {
    groupPHAffected: 'Group PH Test Non-Live',
    isHasSettledTicket: false,
    isAllLiveTickets: false,
    total: 25,
    fromTime: '2023-01-01T14:00:00Z',
    toTime: '2023-01-01T16:00:00Z',
    betTypeNameReplaceMessage: {
      id: 2,
      message: 'Test non-live bet type message'
    } as unknown as Message
  } as unknown as TicketsModel;

  static readonly fakeVoidPageItem: VoidWrongMarketOfferedModel = {
    matchModel: Helper.fakeMatchModel,
    voidTicketsMini: Helper.fakeVoidTicketsMini
  } as VoidWrongMarketOfferedModel;

  static readonly fakeVoidPageItemWithoutMatch: VoidWrongMarketOfferedModel = {
    matchModel: null,
    voidTicketsMini: Helper.fakeVoidTicketsMini
  } as VoidWrongMarketOfferedModel;

  static readonly fakeTemplateValue = new TemplateValue();
}

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
    
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTemplateValue', () => {
    beforeEach(() => {
      templateService.initializeTemplateValue = jest.fn().mockReturnValue(Helper.fakeTemplateValue);
    });

    it('should return template value with correct properties when matchModel exists', () => {
      // Arrange
      const voidPageItem = Helper.fakeVoidPageItem;

      // Action
      const result = service.getTemplateValue(voidPageItem);

      // Assert
      expect(templateService.initializeTemplateValue).toHaveBeenCalledWith(Helper.fakeMatchModel);
      expect(result).toBeInstanceOf(TemplateValue);
      expect(result.groupPHAffected).toBe('Group PH Test');
      expect(result.checkSettled).toBe(true);
      expect(result.eventType).toBe(EventType.LIVE);
      expect(result.totalTickets).toBe(50);
      expect(result.fromTransTime).toBe('2023-01-01T10:00:00Z');
      expect(result.toTransTime).toBe('2023-01-01T12:00:00Z');
      expect(result.isCheckedSpecialBetType).toBe(true);
      expect(result.betTypeNameReplaceMessage).toEqual({
        id: 1,
        message: 'Test bet type message'
      });
    });

    it('should return template value with correct properties when matchModel is null', () => {
      // Arrange
      const voidPageItem = Helper.fakeVoidPageItemWithoutMatch;

      // Action
      const result = service.getTemplateValue(voidPageItem);

      // Assert
      expect(templateService.initializeTemplateValue).not.toHaveBeenCalled();
      expect(result).toBeInstanceOf(TemplateValue);
      expect(result.groupPHAffected).toBe('Group PH Test');
      expect(result.checkSettled).toBe(true);
      expect(result.eventType).toBe(EventType.LIVE);
      expect(result.totalTickets).toBe(50);
      expect(result.fromTransTime).toBe('2023-01-01T10:00:00Z');
      expect(result.toTransTime).toBe('2023-01-01T12:00:00Z');
      expect(result.isCheckedSpecialBetType).toBe(true);
      expect(result.betTypeNameReplaceMessage).toEqual({
        id: 1,
        message: 'Test bet type message'
      });
    });

    it('should set eventType to null when isAllLiveTickets is false', () => {
      // Arrange
      const voidPageItem = {
        ...Helper.fakeVoidPageItem,
        voidTicketsMini: Helper.fakeVoidTicketsMiniNonLive
      };

      // Action
      const result = service.getTemplateValue(voidPageItem);

      // Assert
      expect(result.eventType).toBeNull();
      expect(result.groupPHAffected).toBe('Group PH Test Non-Live');
      expect(result.checkSettled).toBe(false);
      expect(result.totalTickets).toBe(25);
    });

    it('should call setSpecialBetTypeProperties with correct parameters', () => {
      // Arrange
      const voidPageItem = Helper.fakeVoidPageItem;
      const setSpecialBetTypePropertiesSpy = jest.spyOn(service as any, 'setSpecialBetTypeProperties');

      // Action
      service.getTemplateValue(voidPageItem);

      // Assert
      expect(setSpecialBetTypePropertiesSpy).toHaveBeenCalledWith(
        expect.any(TemplateValue),
        Helper.fakeVoidTicketsMini.betTypeNameReplaceMessage
      );
    });
  });

  describe('setSpecialBetTypeProperties', () => {
    it('should set isCheckedSpecialBetType to true and assign betTypeNameReplaceMessage', () => {
      // Arrange
      const templateValue = new TemplateValue();
      const betTypeNameReplaceMessage = {
        id: 1,
        message: 'Test message'
      } as unknown as Message;

      // Action
      (service as any).setSpecialBetTypeProperties(templateValue, betTypeNameReplaceMessage);

      // Assert
      expect(templateValue.isCheckedSpecialBetType).toBe(true);
      expect(templateValue.betTypeNameReplaceMessage).toBe(betTypeNameReplaceMessage);
    });

    it('should handle null betTypeNameReplaceMessage', () => {
      // Arrange
      const templateValue = new TemplateValue();
      const betTypeNameReplaceMessage = null;

      // Action
      (service as any).setSpecialBetTypeProperties(templateValue, betTypeNameReplaceMessage);

      // Assert
      expect(templateValue.isCheckedSpecialBetType).toBe(true);
      expect(templateValue.betTypeNameReplaceMessage).toBeNull();
    });

    it('should handle undefined betTypeNameReplaceMessage', () => {
      // Arrange
      const templateValue = new TemplateValue();
      const betTypeNameReplaceMessage = undefined;

      // Action
      (service as any).setSpecialBetTypeProperties(templateValue, betTypeNameReplaceMessage);

      // Assert
      expect(templateValue.isCheckedSpecialBetType).toBe(true);
      expect(templateValue.betTypeNameReplaceMessage).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('should handle voidPageItem with minimal voidTicketsMini properties', () => {
      // Arrange
      const voidPageItem = {
        matchModel: Helper.fakeMatchModel,
        voidTicketsMini: {
          groupPHAffected: null,
          isHasSettledTicket: false,
          isAllLiveTickets: false,
          total: 0,
          fromTime: null,
          toTime: null,
          betTypeNameReplaceMessage: null
        } as TicketsModel
      } as VoidWrongMarketOfferedModel;

      // Action
      const result = service.getTemplateValue(voidPageItem);

      // Assert
      expect(result.groupPHAffected).toBeNull();
      expect(result.checkSettled).toBe(false);
      expect(result.eventType).toBeNull();
      expect(result.totalTickets).toBe(0);
      expect(result.fromTransTime).toBeNull();
      expect(result.toTransTime).toBeNull();
      expect(result.isCheckedSpecialBetType).toBe(true);
      expect(result.betTypeNameReplaceMessage).toBeNull();
    });
  });
});
