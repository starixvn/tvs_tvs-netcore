import { TestBed } from '@angular/core/testing';
import { EventType } from '../../../../../utility/constants/sport.constant';
import { Message } from '../../messages/message';
import { MessageTemplateId, TemplateContentConst, TemplateReplace } from '../template.const';
import { TemplateValue } from '../template.model';
import { ReplaceMessageService } from './replace-message.service';
import { ReplacePlacedFromTimeRangeService } from './replace-placed-from-time-range.service';

describe('ReplacePlacedFromTimeRangeService', () => {
  let service: ReplacePlacedFromTimeRangeService;
  let replaceMessageService: ReplaceMessageService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = TestBed.inject(ReplacePlacedFromTimeRangeService);
    replaceMessageService = TestBed.inject(ReplaceMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    let mockTemplateValue: TemplateValue;
    let mockOutputMessage: Message;

    beforeEach(() => {
      mockTemplateValue = {
        matchId: 123,
        fromTransTime: new Date('2024-01-15T10:00:00Z'),
        toTransTime: new Date('2024-01-15T12:00:00Z'),
        totalTickets: 3,
        eventType: EventType.LIVE,
        groupPHAffected: 0
      } as TemplateValue;

      mockOutputMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message {{PlacedFromTimeRange}}',
        contentChineseTraditional: '測試訊息 {{PlacedFromTimeRange}}',
        contentChineseSimplified: '测试讯息 {{PlacedFromTimeRange}}',
        contentNewChineseSimplified: '测试讯息 {{PlacedFromTimeRange}}'
      } as Message;
    });

    it('should call replacePlacedFromTimeRange and replaceFromTimeRange with correct parameters', () => {
      // Arrange
      const replacePlacedFromTimeRangeSpy = jest.spyOn(service as any, 'replacePlacedFromTimeRange');
      const replaceFromTimeRangeSpy = jest.spyOn(service as any, 'replaceFromTimeRange');
      const messageTemplateId = MessageTemplateId.NEXT_GOAL;

      // Act
      service.execute(mockTemplateValue, mockOutputMessage, messageTemplateId);

      // Assert
      expect(replacePlacedFromTimeRangeSpy).toHaveBeenCalledWith(
        mockTemplateValue,
        mockOutputMessage,
        expect.any(String),
        messageTemplateId
      );
      expect(replaceFromTimeRangeSpy).toHaveBeenCalledWith(
        mockTemplateValue,
        mockOutputMessage,
        expect.any(String)
      );
    });

    it('should format time range correctly for same day', () => {
      // Arrange
      const replacePlacedFromTimeRangeSpy = jest.spyOn(service as any, 'replacePlacedFromTimeRange');
      mockTemplateValue.fromTransTime = new Date('2024-01-15T10:00:00Z');
      mockTemplateValue.toTransTime = new Date('2024-01-15T12:00:00Z');

      // Act
      service.execute(mockTemplateValue, mockOutputMessage, MessageTemplateId.NEXT_GOAL);

      // Assert
      expect(replacePlacedFromTimeRangeSpy).toHaveBeenCalledWith(
        mockTemplateValue,
        mockOutputMessage,
        expect.stringContaining(' - '),
        MessageTemplateId.NEXT_GOAL
      );
    });

    it('should format time range correctly for different days', () => {
      // Arrange
      const replacePlacedFromTimeRangeSpy = jest.spyOn(service as any, 'replacePlacedFromTimeRange');
      mockTemplateValue.fromTransTime = new Date('2024-01-15T10:00:00Z');
      mockTemplateValue.toTransTime = new Date('2024-01-16T12:00:00Z');

      // Act
      service.execute(mockTemplateValue, mockOutputMessage, MessageTemplateId.NEXT_GOAL);

      // Assert
      expect(replacePlacedFromTimeRangeSpy).toHaveBeenCalledWith(
        mockTemplateValue,
        mockOutputMessage,
        expect.stringContaining(' - '),
        MessageTemplateId.NEXT_GOAL
      );
    });
  });

  describe('replacePlacedFromTimeRange', () => {
    let mockTemplateValue: TemplateValue;
    let mockOutputMessage: Message;

    beforeEach(() => {
      mockTemplateValue = {
        matchId: 123,
        totalTickets: 3,
        eventType: EventType.LIVE,
        groupPHAffected: 0
      } as TemplateValue;

      mockOutputMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message {{PlacedFromTimeRange}}',
        contentChineseTraditional: '測試訊息 {{PlacedFromTimeRange}}',
        contentChineseSimplified: '测试讯息 {{PlacedFromTimeRange}}',
        contentNewChineseSimplified: '测试讯息 {{PlacedFromTimeRange}}'
      } as Message;
    });

    it('should call replaceEachLanguage with correct content when totalTickets > MAX_NUMBER_TICKETS and template has time range NC', () => {
      // Arrange
      mockTemplateValue.totalTickets = 10;
      replaceMessageService.replaceEachLanguage = jest.fn();
      const timeRange = '10:00 - 12:00 ';
      const messageTemplateId = MessageTemplateId.NEXT_CORNER;

      // Act
      service['replacePlacedFromTimeRange'](mockTemplateValue, mockOutputMessage, timeRange, messageTemplateId);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.PLACED_FROM_TIME_RANGE_NC,
        expect.objectContaining({
          msgEnglish: expect.stringContaining(TemplateContentConst.PLACED_FROM.msgEnglish),
          msgChineseTraditional: expect.stringContaining(TemplateContentConst.PLACED_FROM.msgChineseTraditional),
          msgChineseSimplified: expect.stringContaining(TemplateContentConst.PLACED_FROM.msgChineseSimplified),
          msgChineseNewSimplified: expect.stringContaining(TemplateContentConst.PLACED_FROM.msgChineseNewSimplified)
        })
      );
    });

    it('should call replaceEachLanguage with correct content when totalTickets > MAX_NUMBER_TICKETS and template does not have time range NC', () => {
      // Arrange
      mockTemplateValue.totalTickets = 10;
      replaceMessageService.replaceEachLanguage = jest.fn();
      const timeRange = '10:00 - 12:00 ';
      const messageTemplateId = MessageTemplateId.NEXT_GOAL;

      // Act
      service['replacePlacedFromTimeRange'](mockTemplateValue, mockOutputMessage, timeRange, messageTemplateId);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalled();
    });

    it('should call replaceAll with empty string when totalTickets <= MAX_NUMBER_TICKETS and template has time range NC', () => {
      // Arrange
      mockTemplateValue.totalTickets = 3;
      replaceMessageService.replaceAll = jest.fn();
      const timeRange = '10:00 - 12:00 ';
      const messageTemplateId = MessageTemplateId.NEXT_CORNER;

      // Act
      service['replacePlacedFromTimeRange'](mockTemplateValue, mockOutputMessage, timeRange, messageTemplateId);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.PLACED_FROM_TIME_RANGE_NC,
        ''
      );
    });

    it('should call replaceAll with empty string when totalTickets <= 5, eventType is not LIVE and template does not have time range NC', () => {
      // Arrange
      mockTemplateValue.totalTickets = 3;
      mockTemplateValue.eventType = '0';
      replaceMessageService.replaceAll = jest.fn();
      const timeRange = '10:00 - 12:00 ';
      const messageTemplateId = MessageTemplateId.NEXT_GOAL;

      // Act
      service['replacePlacedFromTimeRange'](mockTemplateValue, mockOutputMessage, timeRange, messageTemplateId);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalled();
    });
  });

  describe('replaceFromTimeRange', () => {
    let mockTemplateValue: TemplateValue;
    let mockOutputMessage: Message;

    beforeEach(() => {
      mockTemplateValue = {
        matchId: 123,
        totalTickets: 3
      } as TemplateValue;

      mockOutputMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message {{FromTimeRange}}',
        contentChineseTraditional: '測試訊息 {{FromTimeRange}}',
        contentChineseSimplified: '测试讯息 {{FromTimeRange}}',
        contentNewChineseSimplified: '测试讯息 {{FromTimeRange}}'
      } as Message;
    });

    it('should call replaceEachLanguage with correct content when totalTickets > MAX_NUMBER_TICKETS', () => {
      // Arrange
      mockTemplateValue.totalTickets = 10;
      replaceMessageService.replaceEachLanguage = jest.fn();
      const timeRange = '10:00 - 12:00 ';

      // Act
      service['replaceFromTimeRange'](mockTemplateValue, mockOutputMessage, timeRange);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.FROM_TIME_RANGE,
        expect.objectContaining({
          msgEnglish: expect.stringContaining(TemplateContentConst.FROM.msgEnglish),
          msgChineseTraditional: expect.stringContaining(TemplateContentConst.FROM.msgChineseTraditional),
          msgChineseSimplified: expect.stringContaining(TemplateContentConst.FROM.msgChineseSimplified),
          msgChineseNewSimplified: expect.stringContaining(TemplateContentConst.FROM.msgChineseNewSimplified)
        })
      );
    });

    it('should call replaceAll with empty string when totalTickets <= MAX_NUMBER_TICKETS', () => {
      // Arrange
      mockTemplateValue.totalTickets = 3;
      replaceMessageService.replaceAll = jest.fn();
      const timeRange = '10:00 - 12:00 ';

      // Act
      service['replaceFromTimeRange'](mockTemplateValue, mockOutputMessage, timeRange);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.FROM_TIME_RANGE,
        ''
      );
    });
  });

  describe('edge cases', () => {
    it('should handle null templateValue in execute', () => {
      // Arrange
      const nullTemplateValue = null;
      const mockOutputMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message',
        contentChineseTraditional: '測試訊息',
        contentChineseSimplified: '测试讯息',
        contentNewChineseSimplified: '测试讯息'
      } as Message;

      // Act & Assert
      expect(() => {
        service.execute(nullTemplateValue, mockOutputMessage, MessageTemplateId.NEXT_GOAL);
      }).toThrow();
    });

    it('should handle undefined templateValue in execute', () => {
      // Arrange
      const undefinedTemplateValue = undefined;
      const mockOutputMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message',
        contentChineseTraditional: '測試訊息',
        contentChineseSimplified: '测试讯息',
        contentNewChineseSimplified: '测试讯息'
      } as Message;

      // Act & Assert
      expect(() => {
        service.execute(undefinedTemplateValue, mockOutputMessage, MessageTemplateId.NEXT_GOAL);
      }).toThrow();
    });

    it('should handle null outputMessage in execute', () => {
      // Arrange
      const mockTemplateValue = {
        matchId: 123,
        fromTransTime: new Date('2024-01-15T10:00:00Z'),
        toTransTime: new Date('2024-01-15T12:00:00Z'),
        totalTickets: 3,
        eventType: EventType.LIVE,
        groupPHAffected: 0
      } as TemplateValue;

      // Act & Assert
      expect(() => {
        service.execute(mockTemplateValue, null, MessageTemplateId.NEXT_GOAL);
      }).toThrow();
    });

    it('should handle undefined outputMessage in execute', () => {
      // Arrange
      const mockTemplateValue = {
        matchId: 123,
        fromTransTime: new Date('2024-01-15T10:00:00Z'),
        toTransTime: new Date('2024-01-15T12:00:00Z'),
        totalTickets: 3,
        eventType: EventType.LIVE,
        groupPHAffected: 0
      } as TemplateValue;

      // Act & Assert
      expect(() => {
        service.execute(mockTemplateValue, undefined, MessageTemplateId.NEXT_GOAL);
      }).toThrow();
    });

    it('should handle null templateValue in replacePlacedFromTimeRange', () => {
      // Arrange
      const mockOutputMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message',
        contentChineseTraditional: '測試訊息',
        contentChineseSimplified: '测试讯息',
        contentNewChineseSimplified: '测试讯息'
      } as Message;

      // Act & Assert
      expect(() => {
        service['replacePlacedFromTimeRange'](null, mockOutputMessage, '10:00 - 12:00 ', MessageTemplateId.NEXT_GOAL);
      }).toThrow();
    });

    it('should handle null templateValue in replaceFromTimeRange', () => {
      // Arrange
      const mockOutputMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message',
        contentChineseTraditional: '測試訊息',
        contentChineseSimplified: '测试讯息',
        contentNewChineseSimplified: '测试讯息'
      } as Message;

      // Act & Assert
      expect(() => {
        service['replaceFromTimeRange'](null, mockOutputMessage, '10:00 - 12:00 ');
      }).toThrow();
    });

    it('should handle null outputMessage in replacePlacedFromTimeRange', () => {
      // Arrange
      const mockTemplateValue = {
        matchId: 123,
        totalTickets: 3,
        eventType: EventType.LIVE
      } as TemplateValue;

      // Act & Assert
      expect(() => {
        service['replacePlacedFromTimeRange'](mockTemplateValue, null, '10:00 - 12:00 ', MessageTemplateId.NEXT_GOAL);
      }).toThrow();
    });

    it('should handle null outputMessage in replaceFromTimeRange', () => {
      // Arrange
      const mockTemplateValue = {
        matchId: 123,
        totalTickets: 3
      } as TemplateValue;

      // Act & Assert
      expect(() => {
        service['replaceFromTimeRange'](mockTemplateValue, null, '10:00 - 12:00 ');
      }).toThrow();
    });
  });
});
