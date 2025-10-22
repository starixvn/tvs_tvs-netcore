import { TestBed } from '@angular/core/testing';
import { Message } from '../../messages/message';
import { TemplateValue } from '../template.model';
import { TemplateContentConst, TemplateReplace } from '../template.const';
import { ReplaceAIOMessageService } from './replace-aio-message.serivce';
import { ReplaceMessageService } from './replace-message.service';

describe('ReplaceAIOMessageService', () => {
  let service: ReplaceAIOMessageService;
  let replaceMessageService: ReplaceMessageService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = TestBed.inject(ReplaceAIOMessageService);
    replaceMessageService = TestBed.inject(ReplaceMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    let mockOutputMessage: Message;
    let mockTemplateValue: TemplateValue;

    beforeEach(() => {
      mockOutputMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message {{AOI_MESSAGE}}',
        contentChineseTraditional: '測試訊息 {{AOI_MESSAGE}}',
        contentChineseSimplified: '测试讯息 {{AOI_MESSAGE}}',
        contentNewChineseSimplified: '测试讯息 {{AOI_MESSAGE}}'
      } as Message;

      mockTemplateValue = {
        checkAIOMessage: false,
        groupPHAffected: 0
      } as TemplateValue;
    });

    it('should call replaceAll with empty string when isVoidSingleBetPage is false and groupPHAffected is 0', () => {
      // Arrange
      const isVoidSingleBetPage = false;
      mockTemplateValue.checkAIOMessage = false;
      mockTemplateValue.groupPHAffected = 0;
      replaceMessageService.replaceAll = jest.fn();
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      service.execute(isVoidSingleBetPage, mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.AOI_MESSAGE,
        ''
      );
      expect(replaceMessageService.replaceEachLanguage).not.toHaveBeenCalled();
    });

    it('should call replaceAll with empty string when isVoidSingleBetPage is true but checkAIOMessage is false and groupPHAffected is 0', () => {
      // Arrange
      const isVoidSingleBetPage = true;
      mockTemplateValue.checkAIOMessage = false;
      mockTemplateValue.groupPHAffected = 0;
      replaceMessageService.replaceAll = jest.fn();
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      service.execute(isVoidSingleBetPage, mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.AOI_MESSAGE,
        ''
      );
      expect(replaceMessageService.replaceEachLanguage).not.toHaveBeenCalled();
    });

    it('should call replaceAIOMessage when isVoidSingleBetPage is true and checkAIOMessage is true', () => {
      // Arrange
      const isVoidSingleBetPage = true;
      mockTemplateValue.checkAIOMessage = true;
      mockTemplateValue.groupPHAffected = 1;
      replaceMessageService.replaceEachLanguage = jest.fn();
      replaceMessageService.replaceAll = jest.fn();

      // Act
      service.execute(isVoidSingleBetPage, mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.AOI_MESSAGE,
        expect.any(Object)
      );
      expect(replaceMessageService.replaceAll).not.toHaveBeenCalled();
    });

    it('should call replaceAIOMessage when groupPHAffected is not 0', () => {
      // Arrange
      const isVoidSingleBetPage = false;
      mockTemplateValue.checkAIOMessage = false;
      mockTemplateValue.groupPHAffected = 3;
      replaceMessageService.replaceEachLanguage = jest.fn();
      replaceMessageService.replaceAll = jest.fn();

      // Act
      service.execute(isVoidSingleBetPage, mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.AOI_MESSAGE,
        expect.any(Object)
      );
      expect(replaceMessageService.replaceAll).not.toHaveBeenCalled();
    });

    it('should call replaceAIOMessage when both conditions are true', () => {
      // Arrange
      const isVoidSingleBetPage = true;
      mockTemplateValue.checkAIOMessage = true;
      mockTemplateValue.groupPHAffected = 2;
      replaceMessageService.replaceEachLanguage = jest.fn();
      replaceMessageService.replaceAll = jest.fn();

      // Act
      service.execute(isVoidSingleBetPage, mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.AOI_MESSAGE,
        expect.any(Object)
      );
      expect(replaceMessageService.replaceAll).not.toHaveBeenCalled();
    });
  });

  describe('getAioMessageTemplate', () => {
    it('should return AIO_MESSAGE_1X2 template when groupPHAffected is 1', () => {
      // Arrange
      const groupPHAffected = 1;
      const expectedTemplate = {
        msgEnglish: `${TemplateContentConst.AIO_MESSAGE_1X2.msgEnglish}`,
        msgChineseTraditional: `${TemplateContentConst.AIO_MESSAGE_1X2.msgChineseTraditional}`,
        msgChineseSimplified: `${TemplateContentConst.AIO_MESSAGE_1X2.msgChineseSimplified}`,
        msgChineseNewSimplified: `${TemplateContentConst.AIO_MESSAGE_1X2.msgChineseNewSimplified}`
      };

      // Act
      const result = (service as any).getAioMessageTemplate(groupPHAffected);

      // Assert
      expect(result).toEqual(expectedTemplate);
    });

    it('should return AIO_MESSAGE_1X2_AIO template when groupPHAffected is 3', () => {
      // Arrange
      const groupPHAffected = 3;
      const expectedTemplate = {
        msgEnglish: `${TemplateContentConst.AIO_MESSAGE_1X2_AIO.msgEnglish}`,
        msgChineseTraditional: `${TemplateContentConst.AIO_MESSAGE_1X2_AIO.msgChineseTraditional}`,
        msgChineseSimplified: `${TemplateContentConst.AIO_MESSAGE_1X2_AIO.msgChineseSimplified}`,
        msgChineseNewSimplified: `${TemplateContentConst.AIO_MESSAGE_1X2_AIO.msgChineseNewSimplified}`
      };

      // Act
      const result = (service as any).getAioMessageTemplate(groupPHAffected);

      // Assert
      expect(result).toEqual(expectedTemplate);
    });

    it('should return AIO_MESSAGE_AIO template when groupPHAffected is neither 1 nor 3', () => {
      // Arrange
      const groupPHAffected = 2;
      const expectedTemplate = {
        msgEnglish: `${TemplateContentConst.AIO_MESSAGE_AIO.msgEnglish}`,
        msgChineseTraditional: `${TemplateContentConst.AIO_MESSAGE_AIO.msgChineseTraditional}`,
        msgChineseSimplified: `${TemplateContentConst.AIO_MESSAGE_AIO.msgChineseSimplified}`,
        msgChineseNewSimplified: `${TemplateContentConst.AIO_MESSAGE_AIO.msgChineseNewSimplified}`
      };

      // Act
      const result = (service as any).getAioMessageTemplate(groupPHAffected);

      // Assert
      expect(result).toEqual(expectedTemplate);
    });

    it('should return AIO_MESSAGE_AIO template when groupPHAffected is 0', () => {
      // Arrange
      const groupPHAffected = 0;
      const expectedTemplate = {
        msgEnglish: `${TemplateContentConst.AIO_MESSAGE_AIO.msgEnglish}`,
        msgChineseTraditional: `${TemplateContentConst.AIO_MESSAGE_AIO.msgChineseTraditional}`,
        msgChineseSimplified: `${TemplateContentConst.AIO_MESSAGE_AIO.msgChineseSimplified}`,
        msgChineseNewSimplified: `${TemplateContentConst.AIO_MESSAGE_AIO.msgChineseNewSimplified}`
      };

      // Act
      const result = (service as any).getAioMessageTemplate(groupPHAffected);

      // Assert
      expect(result).toEqual(expectedTemplate);
    });

    it('should return AIO_MESSAGE_AIO template when groupPHAffected is negative', () => {
      // Arrange
      const groupPHAffected = -1;
      const expectedTemplate = {
        msgEnglish: `${TemplateContentConst.AIO_MESSAGE_AIO.msgEnglish}`,
        msgChineseTraditional: `${TemplateContentConst.AIO_MESSAGE_AIO.msgChineseTraditional}`,
        msgChineseSimplified: `${TemplateContentConst.AIO_MESSAGE_AIO.msgChineseSimplified}`,
        msgChineseNewSimplified: `${TemplateContentConst.AIO_MESSAGE_AIO.msgChineseNewSimplified}`
      };

      // Act
      const result = (service as any).getAioMessageTemplate(groupPHAffected);

      // Assert
      expect(result).toEqual(expectedTemplate);
    });
  });

  describe('replaceAIOMessage', () => {
    let mockOutputMessage: Message;

    beforeEach(() => {
      mockOutputMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message {{AOI_MESSAGE}}',
        contentChineseTraditional: '測試訊息 {{AOI_MESSAGE}}',
        contentChineseSimplified: '测试讯息 {{AOI_MESSAGE}}',
        contentNewChineseSimplified: '测试讯息 {{AOI_MESSAGE}}'
      } as Message;
    });

    it('should call replaceEachLanguage with correct parameters', () => {
      // Arrange
      const groupPHAffected = 1;
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      (service as any).replaceAIOMessage(mockOutputMessage, groupPHAffected);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.AOI_MESSAGE,
        expect.objectContaining({
          msgEnglish: expect.any(String),
          msgChineseTraditional: expect.any(String),
          msgChineseSimplified: expect.any(String),
          msgChineseNewSimplified: expect.any(String)
        })
      );
    });

    it('should call replaceEachLanguage with AIO_MESSAGE_1X2 template when groupPHAffected is 1', () => {
      // Arrange
      const groupPHAffected = 1;
      const expectedTemplate = {
        msgEnglish: `${TemplateContentConst.AIO_MESSAGE_1X2.msgEnglish}`,
        msgChineseTraditional: `${TemplateContentConst.AIO_MESSAGE_1X2.msgChineseTraditional}`,
        msgChineseSimplified: `${TemplateContentConst.AIO_MESSAGE_1X2.msgChineseSimplified}`,
        msgChineseNewSimplified: `${TemplateContentConst.AIO_MESSAGE_1X2.msgChineseNewSimplified}`
      };
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      (service as any).replaceAIOMessage(mockOutputMessage, groupPHAffected);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.AOI_MESSAGE,
        expectedTemplate
      );
    });

    it('should call replaceEachLanguage with AIO_MESSAGE_1X2_AIO template when groupPHAffected is 3', () => {
      // Arrange
      const groupPHAffected = 3;
      const expectedTemplate = {
        msgEnglish: `${TemplateContentConst.AIO_MESSAGE_1X2_AIO.msgEnglish}`,
        msgChineseTraditional: `${TemplateContentConst.AIO_MESSAGE_1X2_AIO.msgChineseTraditional}`,
        msgChineseSimplified: `${TemplateContentConst.AIO_MESSAGE_1X2_AIO.msgChineseSimplified}`,
        msgChineseNewSimplified: `${TemplateContentConst.AIO_MESSAGE_1X2_AIO.msgChineseNewSimplified}`
      };
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      (service as any).replaceAIOMessage(mockOutputMessage, groupPHAffected);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.AOI_MESSAGE,
        expectedTemplate
      );
    });

    it('should call replaceEachLanguage with AIO_MESSAGE_AIO template when groupPHAffected is neither 1 nor 3', () => {
      // Arrange
      const groupPHAffected = 2;
      const expectedTemplate = {
        msgEnglish: `${TemplateContentConst.AIO_MESSAGE_AIO.msgEnglish}`,
        msgChineseTraditional: `${TemplateContentConst.AIO_MESSAGE_AIO.msgChineseTraditional}`,
        msgChineseSimplified: `${TemplateContentConst.AIO_MESSAGE_AIO.msgChineseSimplified}`,
        msgChineseNewSimplified: `${TemplateContentConst.AIO_MESSAGE_AIO.msgChineseNewSimplified}`
      };
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      (service as any).replaceAIOMessage(mockOutputMessage, groupPHAffected);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.AOI_MESSAGE,
        expectedTemplate
      );
    });
  });

  describe('edge cases', () => {
    let mockOutputMessage: Message;
    let mockTemplateValue: TemplateValue;

    beforeEach(() => {
      mockOutputMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message {{AOI_MESSAGE}}',
        contentChineseTraditional: '測試訊息 {{AOI_MESSAGE}}',
        contentChineseSimplified: '测试讯息 {{AOI_MESSAGE}}',
        contentNewChineseSimplified: '测试讯息 {{AOI_MESSAGE}}'
      } as Message;

      mockTemplateValue = {
        checkAIOMessage: false,
        groupPHAffected: 0
      } as TemplateValue;
    });

    it('should handle null outputMessage in execute', () => {
      // Act & Assert
      expect(() => {
        service.execute(true, mockTemplateValue, null);
      }).toThrow();
    });

    it('should handle undefined outputMessage in execute', () => {
      // Act & Assert
      expect(() => {
        service.execute(true, mockTemplateValue, undefined);
      }).toThrow();
    });

    it('should handle null templateValue in execute', () => {
      // Act & Assert
      expect(() => {
        service.execute(true, null, mockOutputMessage);
      }).toThrow();
    });

    it('should handle undefined templateValue in execute', () => {
      // Act & Assert
      expect(() => {
        service.execute(true, undefined, mockOutputMessage);
      }).toThrow();
    });

    it('should handle null outputMessage in replaceAIOMessage', () => {
      // Act & Assert
      expect(() => {
        (service as any).replaceAIOMessage(null, 1);
      }).toThrow();
    });

    it('should handle undefined outputMessage in replaceAIOMessage', () => {
      // Act & Assert
      expect(() => {
        (service as any).replaceAIOMessage(undefined, 1);
      }).toThrow();
    });

    it('should handle NaN groupPHAffected in getAioMessageTemplate', () => {
      // Arrange
      const groupPHAffected = NaN;
      const expectedTemplate = {
        msgEnglish: `${TemplateContentConst.AIO_MESSAGE_AIO.msgEnglish}`,
        msgChineseTraditional: `${TemplateContentConst.AIO_MESSAGE_AIO.msgChineseTraditional}`,
        msgChineseSimplified: `${TemplateContentConst.AIO_MESSAGE_AIO.msgChineseSimplified}`,
        msgChineseNewSimplified: `${TemplateContentConst.AIO_MESSAGE_AIO.msgChineseNewSimplified}`
      };

      // Act
      const result = (service as any).getAioMessageTemplate(groupPHAffected);

      // Assert
      expect(result).toEqual(expectedTemplate);
    });

    it('should handle Infinity groupPHAffected in getAioMessageTemplate', () => {
      // Arrange
      const groupPHAffected = Infinity;
      const expectedTemplate = {
        msgEnglish: `${TemplateContentConst.AIO_MESSAGE_AIO.msgEnglish}`,
        msgChineseTraditional: `${TemplateContentConst.AIO_MESSAGE_AIO.msgChineseTraditional}`,
        msgChineseSimplified: `${TemplateContentConst.AIO_MESSAGE_AIO.msgChineseSimplified}`,
        msgChineseNewSimplified: `${TemplateContentConst.AIO_MESSAGE_AIO.msgChineseNewSimplified}`
      };

      // Act
      const result = (service as any).getAioMessageTemplate(groupPHAffected);

      // Assert
      expect(result).toEqual(expectedTemplate);
    });
  });
});
