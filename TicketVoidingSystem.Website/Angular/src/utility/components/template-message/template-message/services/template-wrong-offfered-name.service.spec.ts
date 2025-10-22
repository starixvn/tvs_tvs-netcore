import { TestBed } from '@angular/core/testing';
import { Message } from '../../messages/message';
import { TemplateReplace } from '../template.const';
import { TemplateValue } from '../template.model';
import { ReplaceMessageService } from './replace-message.service';
import { TemplateWrongOfferedService } from './template-wrong-offfered-name.service';

describe('TemplateWrongOfferedService', () => {
  let service: TemplateWrongOfferedService;
  let replaceMessageService: ReplaceMessageService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = TestBed.inject(TemplateWrongOfferedService);
    replaceMessageService = TestBed.inject(ReplaceMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('replaceWrongNameTVS', () => {
    let mockOutputMessage: Message;
    let mockTemplateValue: TemplateValue;

    beforeEach(() => {
      mockOutputMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message {{Wrong Name}} {{Actual Name}}',
        contentChineseTraditional: '測試訊息 {{Wrong Name}} {{Actual Name}}',
        contentChineseSimplified: '测试讯息 {{Wrong Name}} {{Actual Name}}',
        contentNewChineseSimplified: '测试讯息 {{Wrong Name}} {{Actual Name}}',
        contentThai: '',
        contentKorean: '',
        contentJapanese: '',
        contentItalian: '',
        contentSpanish: '',
        playerNamesEnglish: '',
        playerNamesChineseTraditional: '',
        playerNamesChineseSimplified: '',
        isTVSAddOrEditPage: false
      };

      mockTemplateValue = {
        matchId: 123,
        wrongName: 'Wrong Team Name',
        actualName: 'Actual Team Name',
        wrongNameT: 'Wrong Team Name T',
        actualNameT: 'Actual Team Name T',
        wrongNameS: 'Wrong Team Name S',
        actualNameS: 'Actual Team Name S',
        groupPHAffected: 0
      };
    });

    it('should call replaceMessageService.replaceAll for all name replacements', () => {
      // Arrange
      replaceMessageService.replaceAll = jest.fn();

      // Act
      service.replaceWrongNameTVS(mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledTimes(6);
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.WRONG_NAME,
        mockTemplateValue.wrongName
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_NAME,
        mockTemplateValue.actualName
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.WRONG_NAMET,
        mockTemplateValue.wrongNameT
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_NAMET,
        mockTemplateValue.actualNameT
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.WRONG_NAMES,
        mockTemplateValue.wrongNameS
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_NAMES,
        mockTemplateValue.actualNameS
      );
    });

    it('should handle null values in templateValue', () => {
      // Arrange
      mockTemplateValue.wrongName = null;
      mockTemplateValue.actualName = null;
      mockTemplateValue.wrongNameT = null;
      mockTemplateValue.actualNameT = null;
      mockTemplateValue.wrongNameS = null;
      mockTemplateValue.actualNameS = null;
      replaceMessageService.replaceAll = jest.fn();

      // Act
      service.replaceWrongNameTVS(mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledTimes(6);
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.WRONG_NAME,
        null
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_NAME,
        null
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.WRONG_NAMET,
        null
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_NAMET,
        null
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.WRONG_NAMES,
        null
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_NAMES,
        null
      );
    });

    it('should handle undefined values in templateValue', () => {
      // Arrange
      mockTemplateValue.wrongName = undefined;
      mockTemplateValue.actualName = undefined;
      mockTemplateValue.wrongNameT = undefined;
      mockTemplateValue.actualNameT = undefined;
      mockTemplateValue.wrongNameS = undefined;
      mockTemplateValue.actualNameS = undefined;
      replaceMessageService.replaceAll = jest.fn();

      // Act
      service.replaceWrongNameTVS(mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledTimes(6);
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.WRONG_NAME,
        undefined
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_NAME,
        undefined
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.WRONG_NAMET,
        undefined
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_NAMET,
        undefined
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.WRONG_NAMES,
        undefined
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_NAMES,
        undefined
      );
    });

    it('should handle empty string values in templateValue', () => {
      // Arrange
      mockTemplateValue.wrongName = '';
      mockTemplateValue.actualName = '';
      mockTemplateValue.wrongNameT = '';
      mockTemplateValue.actualNameT = '';
      mockTemplateValue.wrongNameS = '';
      mockTemplateValue.actualNameS = '';
      replaceMessageService.replaceAll = jest.fn();

      // Act
      service.replaceWrongNameTVS(mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledTimes(6);
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.WRONG_NAME,
        ''
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_NAME,
        ''
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.WRONG_NAMET,
        ''
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_NAMET,
        ''
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.WRONG_NAMES,
        ''
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_NAMES,
        ''
      );
    });

    it('should call replaceMessageService.replaceAll with correct TemplateReplace constants', () => {
      // Arrange
      replaceMessageService.replaceAll = jest.fn();

      // Act
      service.replaceWrongNameTVS(mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.WRONG_NAME,
        mockTemplateValue.wrongName
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_NAME,
        mockTemplateValue.actualName
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.WRONG_NAMET,
        mockTemplateValue.wrongNameT
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_NAMET,
        mockTemplateValue.actualNameT
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.WRONG_NAMES,
        mockTemplateValue.wrongNameS
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_NAMES,
        mockTemplateValue.actualNameS
      );
    });

    it('should handle mixed null, undefined, and string values', () => {
      // Arrange
      mockTemplateValue.wrongName = 'Valid Name';
      mockTemplateValue.actualName = null;
      mockTemplateValue.wrongNameT = undefined;
      mockTemplateValue.actualNameT = 'Valid Name T';
      mockTemplateValue.wrongNameS = '';
      mockTemplateValue.actualNameS = 'Valid Name S';
      replaceMessageService.replaceAll = jest.fn();

      // Act
      service.replaceWrongNameTVS(mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledTimes(6);
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.WRONG_NAME,
        'Valid Name'
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_NAME,
        null
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.WRONG_NAMET,
        undefined
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_NAMET,
        'Valid Name T'
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.WRONG_NAMES,
        ''
      );
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_NAMES,
        'Valid Name S'
      );
    });
  });
});
