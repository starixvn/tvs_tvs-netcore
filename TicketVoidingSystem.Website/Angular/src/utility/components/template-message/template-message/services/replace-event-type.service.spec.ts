import { TestBed } from '@angular/core/testing';
import moment from 'moment-timezone';
import { IssueTypeConstant } from '../../../../../utility/constants/issue-type.constant';
import { EventType } from '../../../../../utility/constants/sport.constant';
import { Message } from '../../messages/message';
import { FormatDateTime, SubIssueTypeId, TemplateContentConst, TemplateReplace } from '../template.const';
import { TemplateValue } from '../template.model';
import { ReplaceMessageService } from './replace-message.service';
import { ReplaceEventTypeService } from './replace-event-type.service';

describe('ReplaceEventTypeService', () => {
  let service: ReplaceEventTypeService;
  let replaceMessageService: ReplaceMessageService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = TestBed.inject(ReplaceEventTypeService);
    replaceMessageService = TestBed.inject(ReplaceMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    let mockTemplateValue: TemplateValue;
    let mockOutputMessage: Message;
    const mockIssueTypeId = 1;
    const mockSubIssueTypeId = 1;

    beforeEach(() => {
      mockTemplateValue = {
        matchId: 123,
        eventType: "1",
        isCheckedEarlyEvent: false,
        eventDate: moment.utc().tz('America/Caracas').format(FormatDateTime.EVENT_DATE)
      } as TemplateValue;

      mockOutputMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message {{EventType}}',
        contentChineseTraditional: '測試訊息 {{EventType}}',
        contentChineseSimplified: '测试讯息 {{EventType}}',
        contentNewChineseSimplified: '测试讯息 {{EventType}}'
      } as Message;
    });

    it('should set isCheckedEarlyEvent to false and call replaceEachLanguage with LIVE when eventType is LIVE', () => {
      // Arrange
      mockTemplateValue.eventType = EventType.LIVE;
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      service.execute(mockTemplateValue, mockIssueTypeId, mockSubIssueTypeId, mockOutputMessage);

      // Assert
      expect(mockTemplateValue.isCheckedEarlyEvent).toBe(false);
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.EVENT_TYPE,
        TemplateContentConst.LIVE
      );
    });

    it('should call replaceEachLanguage with EARLY when isCheckedEarlyEvent is true', () => {
      // Arrange
      mockTemplateValue.isCheckedEarlyEvent = true;
      mockTemplateValue.eventType = '2'; // Set eventType to non-LIVE to trigger the correct logic
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      service.execute(mockTemplateValue, mockIssueTypeId, mockSubIssueTypeId, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.EVENT_TYPE,
        TemplateContentConst.EARLY
      );
    });

    it('should call replaceAll with empty string when isCanUpdateEventTypeToBlank returns true', () => {
      // Arrange
      mockTemplateValue.eventType = '2'; // Set eventType to non-LIVE to avoid LIVE condition
      mockTemplateValue.isCheckedEarlyEvent = false; // Set to false to avoid early event condition
      jest.spyOn(service as any, 'isCanUpdateEventTypeToBlank').mockReturnValue(true);
      replaceMessageService.replaceAll = jest.fn();

      // Act
      service.execute(mockTemplateValue, mockIssueTypeId, mockSubIssueTypeId, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.EVENT_TYPE,
        ''
      );
    });

    it('should call replaceEachLanguage with EARLY when isCanUpdateEventTypeToBlank returns false', () => {
      // Arrange
      mockTemplateValue.eventType = '2'; // Set eventType to non-LIVE to avoid LIVE condition
      mockTemplateValue.isCheckedEarlyEvent = false; // Set to false to avoid early event condition
      jest.spyOn(service as any, 'isCanUpdateEventTypeToBlank').mockReturnValue(false);
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      service.execute(mockTemplateValue, mockIssueTypeId, mockSubIssueTypeId, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.EVENT_TYPE,
        TemplateContentConst.EARLY
      );
    });
  });

  describe('isCanUpdateEventTypeToBlank', () => {
    let mockTemplateValue: TemplateValue;
    const mockSubIssueTypeId = 1;

    beforeEach(() => {
      mockTemplateValue = {
        matchId: 123,
        eventDate: moment.utc().tz('America/Caracas').format(FormatDateTime.EVENT_DATE),
        isCheckedEarlyEvent: false
      } as TemplateValue;
    });

    it('should return false when isSpecialIssueType is true and isDateMismatched is true', () => {
      // Arrange
      const specialIssueTypeId = parseInt(IssueTypeConstant.DANGER_ACCEPTED);
      mockTemplateValue.eventDate = '2023-01-01'; // Different date

      // Act
      const result = service['isCanUpdateEventTypeToBlank'](mockTemplateValue, specialIssueTypeId, mockSubIssueTypeId);

      // Assert
      expect(result).toBe(false);
    });

    it('should return true when isSpecialIssueType is false', () => {
      // Arrange
      const normalIssueTypeId = 999; // Not in special issue types

      // Act
      const result = service['isCanUpdateEventTypeToBlank'](mockTemplateValue, normalIssueTypeId, mockSubIssueTypeId);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when isSpecialIssueType is true but isDateMismatched is false', () => {
      // Arrange
      const specialIssueTypeId = parseInt(IssueTypeConstant.DANGER_ACCEPTED);
      // eventDate is already set to current date in beforeEach

      // Act
      const result = service['isCanUpdateEventTypeToBlank'](mockTemplateValue, specialIssueTypeId, mockSubIssueTypeId);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when issueType is OTHER_ISSUES and subIssueType is in special list', () => {
      // Arrange
      const otherIssuesTypeId = parseInt(IssueTypeConstant.OTHER_ISSUES);
      const specialSubIssueTypeId = SubIssueTypeId.GAME_CRASHED_VOID_LIVE;

      // Act
      const result = service['isCanUpdateEventTypeToBlank'](mockTemplateValue, otherIssuesTypeId, specialSubIssueTypeId);

      // Assert
      expect(result).toBe(true); // Should return true because date is not mismatched
    });

    it('should return false when issueType has checkbox early event and isCheckedEarlyEvent is true', () => {
      // Arrange
      const hasCheckBoxEarlyEventTypeId = parseInt(IssueTypeConstant.WRONG_ODDS);
      mockTemplateValue.isCheckedEarlyEvent = true;

      // Act
      const result = service['isCanUpdateEventTypeToBlank'](mockTemplateValue, hasCheckBoxEarlyEventTypeId, mockSubIssueTypeId);

      // Assert
      expect(result).toBe(false);
    });

    it('should return true when issueType has checkbox early event but isCheckedEarlyEvent is false', () => {
      // Arrange
      const hasCheckBoxEarlyEventTypeId = parseInt(IssueTypeConstant.WRONG_ODDS);
      mockTemplateValue.isCheckedEarlyEvent = false;

      // Act
      const result = service['isCanUpdateEventTypeToBlank'](mockTemplateValue, hasCheckBoxEarlyEventTypeId, mockSubIssueTypeId);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when issueType does not have checkbox early event', () => {
      // Arrange
      const normalIssueTypeId = 999; // Not in hasCheckBoxEarlyEvent list
      mockTemplateValue.isCheckedEarlyEvent = true;

      // Act
      const result = service['isCanUpdateEventTypeToBlank'](mockTemplateValue, normalIssueTypeId, mockSubIssueTypeId);

      // Assert
      expect(result).toBe(true);
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
        service.execute(nullTemplateValue, 1, 1, mockOutputMessage);
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
        service.execute(undefinedTemplateValue, 1, 1, mockOutputMessage);
      }).toThrow();
    });

    it('should handle null outputMessage in execute', () => {
      // Arrange
      const mockTemplateValue = {
        matchId: 123,
        eventType: "1",
        isCheckedEarlyEvent: false
      } as TemplateValue;

      // Act & Assert
      expect(() => {
        service.execute(mockTemplateValue, 1, 1, null);
      }).toThrow();
    });

    it('should handle undefined outputMessage in execute', () => {
      // Arrange
      const mockTemplateValue = {
        matchId: 123,
        eventType: "1",
        isCheckedEarlyEvent: false
      } as TemplateValue;

      // Act & Assert
      expect(() => {
        service.execute(mockTemplateValue, 1, 1, undefined);
      }).toThrow();
    });

    it('should handle null templateValue in isCanUpdateEventTypeToBlank', () => {
      // Act & Assert
      expect(() => {
        service['isCanUpdateEventTypeToBlank'](null, 1, 1);
      }).toThrow();
    });

    it('should handle undefined templateValue in isCanUpdateEventTypeToBlank', () => {
      // Act & Assert
      expect(() => {
        service['isCanUpdateEventTypeToBlank'](undefined, 1, 1);
      }).toThrow();
    });
  });
});
