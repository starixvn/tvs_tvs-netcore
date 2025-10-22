import { TestBed } from '@angular/core/testing';
import { StaticService } from '../../../../../utility/services/static.service';
import { Message } from '../../messages/message';
import { TemplateReplace } from '../template.const';
import { TemplateModel, TemplateValue } from '../template.model';
import { ReplaceMessageService } from './replace-message.service';
import { TemplateWrongOddsSportBookService } from './template-wrong-odds-sport-book.service';
import { TemplateWrongOddsService } from './template-wrong-odds.service';
import { TemplateWrongOfferedService } from './template-wrong-offfered-name.service';
import { TemplateWrongScoreService } from './template-wrong-score.service';
import { TemplateInputsService } from './template-inputs.service';
import { TemplateInputsForTVSService } from './template-inputs-for-tvs.service';
import { MatchModel } from '../../../../../utility/models/match.model';

// Mock StaticService
jest.mock('../../../../../utility/services/static.service', () => ({
  StaticService: {
    isWrongScore: jest.fn(),
    isWrongHDP: jest.fn(),
    isWrong1stHDP: jest.fn(),
    isWrongOU: jest.fn(),
    isWrong1stOU: jest.fn(),
    isWrongOdds: jest.fn(),
    isWrongOddsSportsBook: jest.fn(),
    isDangerAccepted: jest.fn(),
    isWrongOfferedName: jest.fn()
  }
}));
 
class Helper {
  static createMockOutputMessage(): Message {
    return {
      creatorId: 1,
      creatorName: 'Test User',
      contentEnglish: 'Test message',
      contentChineseTraditional: '測試訊息',
      contentChineseSimplified: '测试讯息',
      contentNewChineseSimplified: '测试讯息'
    } as Message;
  }

  static createMockTemplateValue(): TemplateValue {
    return {
      matchId: 123,
      filterFavoriteType: 'h',
      groupPHAffected: 0,
      wrongMarket: 'Test Market',
      actualMarket: 'Actual Market',
      hdpValue: '1.5',
      match: {
        homeName: 'Home Team',
        awayName: 'Away Team',
        homeNameTraditional: '主隊',
        awayNameTraditional: '客隊',
        homeNameSimplified: '主队',
        awayNameSimplified: '客队',
        homeNameNewSimplified: '主队',
        awayNameNewSimplified: '客队'
      } as MatchModel
    };
  }

  static createMockSelectedTemplate(): TemplateModel {
    return {
      templateId: 1,
      msgEnglish: 'Test Template',
      msgChineseTraditional: '測試模板',
      msgChineseSimplified: '测试模板',
      msgChineseNewSimplified: '测试模板',
      inputTexts: []
    };
  }

  static createMockOutputMessageWithTemplate(): Message {
    return {
      creatorId: 1,
      creatorName: 'Test User',
      contentEnglish: 'Test message {{WrongMarket}}',
      contentChineseTraditional: '測試訊息 {{WrongMarket}}',
      contentChineseSimplified: '测试讯息 {{WrongMarket}}',
      contentNewChineseSimplified: '测试讯息 {{WrongMarket}}'
    } as Message;
  }

  static createMockOutputMessageWithActualMarket(): Message {
    return {
      creatorId: 1,
      creatorName: 'Test User',
      contentEnglish: 'Test message {{ActualMarket}}',
      contentChineseTraditional: '測試訊息 {{ActualMarket}}',
      contentChineseSimplified: '测试讯息 {{ActualMarket}}',
      contentNewChineseSimplified: '测试讯息 {{ActualMarket}}'
    } as Message;
  }

  static createMockOutputMessageWithHdpValue(): Message {
    return {
      creatorId: 1,
      creatorName: 'Test User',
      contentEnglish: 'Test message {{HdpValue}}',
      contentChineseTraditional: '測試訊息 {{HdpValue}}',
      contentChineseSimplified: '测试讯息 {{HdpValue}}',
      contentNewChineseSimplified: '测试讯息 {{HdpValue}}'
    } as Message;
  }

  static resetAllStaticServiceMocks(): void {
    (StaticService.isWrongScore as jest.Mock).mockReturnValue(false);
    (StaticService.isWrongHDP as jest.Mock).mockReturnValue(false);
    (StaticService.isWrong1stHDP as jest.Mock).mockReturnValue(false);
    (StaticService.isWrongOU as jest.Mock).mockReturnValue(false);
    (StaticService.isWrong1stOU as jest.Mock).mockReturnValue(false);
    (StaticService.isWrongOdds as jest.Mock).mockReturnValue(false);
    (StaticService.isWrongOddsSportsBook as jest.Mock).mockReturnValue(false);
    (StaticService.isDangerAccepted as jest.Mock).mockReturnValue(false);
    (StaticService.isWrongOfferedName as jest.Mock).mockReturnValue(false);
  }

  static setupMockServices(
    replaceMessageService: ReplaceMessageService,
    templateWrongScoreService: TemplateWrongScoreService,
    templateWrongOddsService: TemplateWrongOddsService,
    templateWrongOddsSportBookService: TemplateWrongOddsSportBookService,
    templateWrongOfferedService: TemplateWrongOfferedService,
    templateInputsService: TemplateInputsService
  ): void {
    replaceMessageService.replaceEachLanguage = jest.fn();
    replaceMessageService.replaceAll = jest.fn();
    templateWrongScoreService.replaceActualScore = jest.fn();
    templateWrongOddsService.replaceActualMarketTVS = jest.fn();
    templateWrongOddsSportBookService.replaceActualMarketSportsBook = jest.fn();
    templateWrongOfferedService.replaceWrongNameTVS = jest.fn();
    templateInputsService.replaceInputs = jest.fn();
  }
}
describe('TemplateInputsForTVSService', () => {
  let service: TemplateInputsForTVSService;
  let replaceMessageService: ReplaceMessageService;
  let templateWrongScoreService: TemplateWrongScoreService;
  let templateWrongOddsService: TemplateWrongOddsService;
  let templateWrongOddsSportBookService: TemplateWrongOddsSportBookService;
  let templateWrongOfferedService: TemplateWrongOfferedService;
  let templateInputsService: TemplateInputsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = TestBed.inject(TemplateInputsForTVSService);
    replaceMessageService = TestBed.inject(ReplaceMessageService);
    templateWrongScoreService = TestBed.inject(TemplateWrongScoreService);
    templateWrongOddsService = TestBed.inject(TemplateWrongOddsService);
    templateWrongOddsSportBookService = TestBed.inject(TemplateWrongOddsSportBookService);
    templateWrongOfferedService = TestBed.inject(TemplateWrongOfferedService);
    templateInputsService = TestBed.inject(TemplateInputsService);
    
    // Setup mock services and reset StaticService mocks
    Helper.setupMockServices(
      replaceMessageService,
      templateWrongScoreService,
      templateWrongOddsService,
      templateWrongOddsSportBookService,
      templateWrongOfferedService,
      templateInputsService
    );
    Helper.resetAllStaticServiceMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('replaceInputsByIssueType', () => {
    let mockOutputMessage: Message;
    let mockTemplateValue: TemplateValue;
    let mockSelectedTemplate: TemplateModel;

    beforeEach(() => {
      mockOutputMessage = Helper.createMockOutputMessage();
      mockTemplateValue = Helper.createMockTemplateValue();
      mockSelectedTemplate = Helper.createMockSelectedTemplate();
    });

    it('should call templateWrongScoreService.replaceActualScore when isWrongScore returns true', () => {
      // Arrange
      const issueTypeId = 1;
      const subIssueTypeId = 2;
      (StaticService.isWrongScore as jest.Mock).mockReturnValue(true);

      // Act
      service.replaceInputsByIssueType(issueTypeId, subIssueTypeId, mockTemplateValue, mockOutputMessage, mockSelectedTemplate);

      // Assert
      expect(StaticService.isWrongScore).toHaveBeenCalledWith(issueTypeId);
      expect(templateWrongScoreService.replaceActualScore).toHaveBeenCalledWith(
        subIssueTypeId,
        mockTemplateValue,
        mockOutputMessage,
        mockSelectedTemplate
      );
    });

    it('should call replaceWrongMarketTVS and replaceActualMarketOthersIssueType when isWrongHDP returns true', () => {
      // Arrange
      const issueTypeId = 2;
      const subIssueTypeId = 3;
      (StaticService.isWrongHDP as jest.Mock).mockReturnValue(true);

      // Act
      service.replaceInputsByIssueType(issueTypeId, subIssueTypeId, mockTemplateValue, mockOutputMessage, mockSelectedTemplate);

      // Assert
      expect(StaticService.isWrongHDP).toHaveBeenCalledWith(issueTypeId);
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.WRONG_MARKET,
        expect.objectContaining({
          msgEnglish: 'Test Market',
          msgChineseTraditional: 'Test Market',
          msgChineseSimplified: 'Test Market',
          msgChineseNewSimplified: 'Test Market'
        })
      );
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_MARKET,
        expect.objectContaining({
          msgEnglish: 'Actual Market',
          msgChineseTraditional: 'Actual Market',
          msgChineseSimplified: 'Actual Market',
          msgChineseNewSimplified: 'Actual Market'
        })
      );
    });

    it('should call replaceWrongMarketTVS and replaceActualMarketOthersIssueType when isWrong1stHDP returns true', () => {
      // Arrange
      const issueTypeId = 3;
      const subIssueTypeId = 4;
      (StaticService.isWrong1stHDP as jest.Mock).mockReturnValue(true);

      // Act
      service.replaceInputsByIssueType(issueTypeId, subIssueTypeId, mockTemplateValue, mockOutputMessage, mockSelectedTemplate);

      // Assert
      expect(StaticService.isWrong1stHDP).toHaveBeenCalledWith(issueTypeId);
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledTimes(3); // WRONG_MARKET, ACTUAL_MARKET, HDP_VALUE
    });

    it('should call replaceWrongMarketTVS and replaceActualMarketOthersIssueType when isWrongOU returns true', () => {
      // Arrange
      const issueTypeId = 4;
      const subIssueTypeId = 5;
      (StaticService.isWrongOU as jest.Mock).mockReturnValue(true);

      // Act
      service.replaceInputsByIssueType(issueTypeId, subIssueTypeId, mockTemplateValue, mockOutputMessage, mockSelectedTemplate);

      // Assert
      expect(StaticService.isWrongOU).toHaveBeenCalledWith(issueTypeId);
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledTimes(2); // WRONG_MARKET, ACTUAL_MARKET
    });

    it('should call replaceWrongMarketTVS and replaceActualMarketOthersIssueType when isWrong1stOU returns true', () => {
      // Arrange
      const issueTypeId = 5;
      const subIssueTypeId = 6;
      (StaticService.isWrong1stOU as jest.Mock).mockReturnValue(true);

      // Act
      service.replaceInputsByIssueType(issueTypeId, subIssueTypeId, mockTemplateValue, mockOutputMessage, mockSelectedTemplate);

      // Assert
      expect(StaticService.isWrong1stOU).toHaveBeenCalledWith(issueTypeId);
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledTimes(2); // WRONG_MARKET, ACTUAL_MARKET
    });

    it('should call templateWrongOddsService.replaceActualMarketTVS when isWrongOdds returns true', () => {
      // Arrange
      const issueTypeId = 6;
      const subIssueTypeId = 7;
      (StaticService.isWrongOdds as jest.Mock).mockReturnValue(true);

      // Act
      service.replaceInputsByIssueType(issueTypeId, subIssueTypeId, mockTemplateValue, mockOutputMessage, mockSelectedTemplate);

      // Assert
      expect(StaticService.isWrongOdds).toHaveBeenCalledWith(issueTypeId);
      expect(templateWrongOddsService.replaceActualMarketTVS).toHaveBeenCalledWith(
        subIssueTypeId,
        mockTemplateValue,
        mockOutputMessage
      );
    });

    it('should call templateWrongOddsSportBookService.replaceActualMarketSportsBook when isWrongOddsSportsBook returns true', () => {
      // Arrange
      const issueTypeId = 7;
      const subIssueTypeId = 8;
      (StaticService.isWrongOddsSportsBook as jest.Mock).mockReturnValue(true);

      // Act
      service.replaceInputsByIssueType(issueTypeId, subIssueTypeId, mockTemplateValue, mockOutputMessage, mockSelectedTemplate);

      // Assert
      expect(StaticService.isWrongOddsSportsBook).toHaveBeenCalledWith(issueTypeId);
      expect(templateWrongOddsSportBookService.replaceActualMarketSportsBook).toHaveBeenCalledWith(
        mockTemplateValue,
        mockOutputMessage
      );
    });

    it('should call templateInputsService.replaceInputs when isDangerAccepted returns true', () => {
      // Arrange
      const issueTypeId = 8;
      const subIssueTypeId = 9;
      (StaticService.isDangerAccepted as jest.Mock).mockReturnValue(true);

      // Act
      service.replaceInputsByIssueType(issueTypeId, subIssueTypeId, mockTemplateValue, mockOutputMessage, mockSelectedTemplate);

      // Assert
      expect(StaticService.isDangerAccepted).toHaveBeenCalledWith(issueTypeId);
      expect(templateInputsService.replaceInputs).toHaveBeenCalledWith(
        subIssueTypeId,
        mockSelectedTemplate,
        mockOutputMessage
      );
    });

    it('should call templateWrongOfferedService.replaceWrongNameTVS when isWrongOfferedName returns true', () => {
      // Arrange
      const issueTypeId = 9;
      const subIssueTypeId = 10;
      (StaticService.isWrongOfferedName as jest.Mock).mockReturnValue(true);

      // Act
      service.replaceInputsByIssueType(issueTypeId, subIssueTypeId, mockTemplateValue, mockOutputMessage, mockSelectedTemplate);

      // Assert
      expect(StaticService.isWrongOfferedName).toHaveBeenCalledWith(issueTypeId);
      expect(templateWrongOfferedService.replaceWrongNameTVS).toHaveBeenCalledWith(
        mockTemplateValue,
        mockOutputMessage
      );
    });
  });

  describe('replaceWrongMarketTVS', () => {
    let mockOutputMessage: Message;
    let mockTemplateValue: TemplateValue;

    beforeEach(() => {
      mockOutputMessage = Helper.createMockOutputMessageWithTemplate();
      mockTemplateValue = Helper.createMockTemplateValue();
    });

    it('should call replaceEachLanguage when wrongMarket has value', () => {
      // Act
      service['replaceWrongMarketTVS'](mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.WRONG_MARKET,
        expect.objectContaining({
          msgEnglish: 'Test Market',
          msgChineseTraditional: 'Test Market',
          msgChineseSimplified: 'Test Market',
          msgChineseNewSimplified: 'Test Market'
        })
      );
    });

    it('should call replaceAll with empty string when wrongMarket is null', () => {
      // Arrange
      mockTemplateValue.wrongMarket = null;

      // Act
      service['replaceWrongMarketTVS'](mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.WRONG_MARKET,
        ''
      );
    });

    it('should call replaceAll with empty string when wrongMarket is undefined', () => {
      // Arrange
      mockTemplateValue.wrongMarket = undefined;

      // Act
      service['replaceWrongMarketTVS'](mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.WRONG_MARKET,
        ''
      );
    });

    it('should call replaceAll with empty string when wrongMarket is empty string', () => {
      // Arrange
      mockTemplateValue.wrongMarket = '';

      // Act
      service['replaceWrongMarketTVS'](mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.WRONG_MARKET,
        ''
      );
    });
  });

  describe('replaceActualMarketOthersIssueType', () => {
    let mockOutputMessage: Message;
    let mockTemplateValue: TemplateValue;

    beforeEach(() => {
      mockOutputMessage = Helper.createMockOutputMessageWithActualMarket();
      mockTemplateValue = Helper.createMockTemplateValue();
    });

    it('should call replaceEachLanguage when actualMarket has value', () => {
      // Act
      service['replaceActualMarketOthersIssueType'](mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_MARKET,
        expect.objectContaining({
          msgEnglish: 'Actual Market',
          msgChineseTraditional: 'Actual Market',
          msgChineseSimplified: 'Actual Market',
          msgChineseNewSimplified: 'Actual Market'
        })
      );
    });

    it('should call replaceAll with empty string when actualMarket is null', () => {
      // Arrange
      mockTemplateValue.actualMarket = null;

      // Act
      service['replaceActualMarketOthersIssueType'](mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_MARKET,
        ''
      );
    });

    it('should call replaceAll with empty string when actualMarket is undefined', () => {
      // Arrange
      mockTemplateValue.actualMarket = undefined;

      // Act
      service['replaceActualMarketOthersIssueType'](mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_MARKET,
        ''
      );
    });

    it('should call replaceAll with empty string when actualMarket is empty string', () => {
      // Arrange
      mockTemplateValue.actualMarket = '';

      // Act
      service['replaceActualMarketOthersIssueType'](mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_MARKET,
        ''
      );
    });
  });

  describe('replaceHdpTVS', () => {
    let mockOutputMessage: Message;
    let mockTemplateValue: TemplateValue;

    beforeEach(() => {
      mockOutputMessage = Helper.createMockOutputMessageWithHdpValue();
      mockTemplateValue = Helper.createMockTemplateValue();
    });

    it('should call replaceEachLanguage when hdpValue has value', () => {
      // Act
      service['replaceHdpTVS'](mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.HDP_VALUE,
        expect.objectContaining({
          msgEnglish: '1.5',
          msgChineseTraditional: '1.5',
          msgChineseSimplified: '1.5',
          msgChineseNewSimplified: '1.5'
        })
      );
    });

    it('should call replaceAll with empty string when hdpValue is null', () => {
      // Arrange
      mockTemplateValue.hdpValue = null;

      // Act
      service['replaceHdpTVS'](mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.HDP_VALUE,
        ''
      );
    });

    it('should call replaceAll with empty string when hdpValue is undefined', () => {
      // Arrange
      mockTemplateValue.hdpValue = undefined;

      // Act
      service['replaceHdpTVS'](mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.HDP_VALUE,
        ''
      );
    });

    it('should call replaceAll with empty string when hdpValue is empty string', () => {
      // Arrange
      mockTemplateValue.hdpValue = '';

      // Act
      service['replaceHdpTVS'](mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.HDP_VALUE,
        ''
      );
    });
  });

  describe('edge cases', () => {
    it('should handle null templateValue in replaceWrongMarketTVS', () => {
      // Arrange
      const mockOutputMessage = Helper.createMockOutputMessage();
      const mockTemplateValue: TemplateValue = {
        matchId: 123,
        filterFavoriteType: 'h',
        groupPHAffected: 0,
        wrongMarket: null,
        match: null
      };

      // Act
      service['replaceWrongMarketTVS'](mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.WRONG_MARKET,
        ''
      );
    });

    it('should handle undefined templateValue in replaceActualMarketOthersIssueType', () => {
      // Arrange
      const mockOutputMessage = Helper.createMockOutputMessage();
      const mockTemplateValue: TemplateValue = {
        matchId: 123,
        filterFavoriteType: 'h',
        groupPHAffected: 0,
        actualMarket: undefined,
        match: undefined
      };

      // Act
      service['replaceActualMarketOthersIssueType'](mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_MARKET,
        ''
      );
    });

    it('should handle empty string templateValue in replaceHdpTVS', () => {
      // Arrange
      const mockOutputMessage = Helper.createMockOutputMessage();
      const mockTemplateValue = Helper.createMockTemplateValue();
      mockTemplateValue.hdpValue = '';

      // Act
      service['replaceHdpTVS'](mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.HDP_VALUE,
        ''
      );
    });
  });
});
