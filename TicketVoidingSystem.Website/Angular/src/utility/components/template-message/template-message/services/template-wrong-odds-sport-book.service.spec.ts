import { TestBed } from '@angular/core/testing';
import { Message } from '../../messages/message';
import { TemplateContentConst, TemplateReplace } from '../template.const';
import { TemplateContent, TemplateValue } from '../template.model';
import { ReplaceMessageService } from './replace-message.service';
import { TemplateInputsService } from './template-inputs.service';
import { TemplateWrongOddsSportBookService, SpecialSportsBookBetTypes } from './template-wrong-odds-sport-book.service';

describe('TemplateWrongOddsSportBookService', () => {
  let service: TemplateWrongOddsSportBookService;
  let replaceMessageService: ReplaceMessageService;
  let templateInputsService: TemplateInputsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = TestBed.inject(TemplateWrongOddsSportBookService);
    replaceMessageService = TestBed.inject(ReplaceMessageService);
    templateInputsService = TestBed.inject(TemplateInputsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('replaceActualMarketSportsBook', () => {
    let mockOutputMessage: Message;
    let mockTemplateValue: TemplateValue;

    beforeEach(() => {
      mockOutputMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message {{Actual Market}}',
        contentChineseTraditional: '測試訊息 {{Actual Market}}',
        contentChineseSimplified: '测试讯息 {{Actual Market}}',
        contentNewChineseSimplified: '测试讯息 {{Actual Market}}',
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
        betTypeId: '1',
        groupBetTypeId: 1,
        betTeam: 'Home',
        correctOdds: '1.85',
        hdpValues: '0.5',
        groupPHAffected: 0
      };
    });

    it('should call replaceMessageService.replaceEachLanguage when actualMarket is created', () => {
      // Arrange
      const mockActualMarket: TemplateContent = {
        msgEnglish: 'Test English',
        msgChineseTraditional: 'Test Traditional',
        msgChineseSimplified: 'Test Simplified',
        msgChineseNewSimplified: 'Test New Simplified'
      };
      
      replaceMessageService.replaceEachLanguage = jest.fn();
      jest.spyOn(service as any, 'createActualMarketContent').mockReturnValue(mockActualMarket);

      // Act
      service.replaceActualMarketSportsBook(mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_MARKET,
        mockActualMarket
      );
    });

    it('should call replaceMessageService.replaceAll when actualMarket is null', () => {
      // Arrange
      replaceMessageService.replaceAll = jest.fn();
      jest.spyOn(service as any, 'createActualMarketContent').mockReturnValue(null);

      // Act
      service.replaceActualMarketSportsBook(mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_MARKET,
        ''
      );
    });

    it('should call replaceMessageService.replaceAll when actualMarket is undefined', () => {
      // Arrange
      replaceMessageService.replaceAll = jest.fn();
      jest.spyOn(service as any, 'createActualMarketContent').mockReturnValue(undefined);

      // Act
      service.replaceActualMarketSportsBook(mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_MARKET,
        ''
      );
    });
  });

  describe('getOverOrUnder', () => {
    it('should return UNDER when filterFavoriteType is "a"', () => {
      // Act
      const result = service.getOverOrUnder('a');

      // Assert
      expect(result).toBe(TemplateContentConst.UNDER.msgEnglish);
    });

    it('should return OVER when filterFavoriteType is not "a"', () => {
      // Act
      const result = service.getOverOrUnder('o');

      // Assert
      expect(result).toBe(TemplateContentConst.OVER.msgEnglish);
    });

    it('should return OVER when filterFavoriteType is null', () => {
      // Act
      const result = service.getOverOrUnder(null);

      // Assert
      expect(result).toBe(TemplateContentConst.OVER.msgEnglish);
    });

    it('should return OVER when filterFavoriteType is undefined', () => {
      // Act
      const result = service.getOverOrUnder(undefined);

      // Assert
      expect(result).toBe(TemplateContentConst.OVER.msgEnglish);
    });
  });

  describe('getOverOrUnderTraditional', () => {
    it('should return UNDER traditional when filterFavoriteType is "a"', () => {
      // Act
      const result = service.getOverOrUnderTraditional('a');

      // Assert
      expect(result).toBe(TemplateContentConst.UNDER.msgChineseTraditional);
    });

    it('should return OVER traditional when filterFavoriteType is not "a"', () => {
      // Act
      const result = service.getOverOrUnderTraditional('o');

      // Assert
      expect(result).toBe(TemplateContentConst.OVER.msgChineseTraditional);
    });
  });

  describe('getOverOrUnderSimplified', () => {
    it('should return UNDER simplified when filterFavoriteType is "a"', () => {
      // Act
      const result = service.getOverOrUnderSimplified('a');

      // Assert
      expect(result).toBe(TemplateContentConst.UNDER.msgChineseSimplified);
    });

    it('should return OVER simplified when filterFavoriteType is not "a"', () => {
      // Act
      const result = service.getOverOrUnderSimplified('o');

      // Assert
      expect(result).toBe(TemplateContentConst.OVER.msgChineseSimplified);
    });
  });

  describe('getOverOrUnderNewSimplified', () => {
    it('should return UNDER new simplified when filterFavoriteType is "a"', () => {
      // Act
      const result = service.getOverOrUnderNewSimplified('a');

      // Assert
      expect(result).toBe(TemplateContentConst.UNDER.msgChineseNewSimplified);
    });

    it('should return OVER new simplified when filterFavoriteType is not "a"', () => {
      // Act
      const result = service.getOverOrUnderNewSimplified('o');

      // Assert
      expect(result).toBe(TemplateContentConst.OVER.msgChineseNewSimplified);
    });
  });

  describe('createActualMarketContent - Handicap Bet Type', () => {
    let mockTemplateValue: TemplateValue;

    beforeEach(() => {
      mockTemplateValue = {
        matchId: 123,
        betTypeId: '1',
        groupBetTypeId: 1,
        betTeam: 'Home',
        correctOdds: '1.85',
        hdpValues: '0.5',
        groupPHAffected: 0
      };
    });

    it('should create handicap market content when betTypeId exists and is handicap type', () => {
      // Arrange
      const mockPrefixSubType: TemplateContent = {
        msgEnglish: '1H ',
        msgChineseTraditional: '上半場',
        msgChineseSimplified: '上半场',
        msgChineseNewSimplified: '上半场'
      };
      const mockTeamName: TemplateContent = {
        msgEnglish: 'Home Team',
        msgChineseTraditional: '主隊',
        msgChineseSimplified: '主队',
        msgChineseNewSimplified: '主队'
      };

      templateInputsService.getPrefixSubType = jest.fn().mockReturnValue(mockPrefixSubType);
      templateInputsService.getTeamName = jest.fn().mockReturnValue(mockTeamName.msgEnglish);
      templateInputsService.getTeamNameTraditional = jest.fn().mockReturnValue(mockTeamName.msgChineseTraditional);
      templateInputsService.getTeamNameSimplified = jest.fn().mockReturnValue(mockTeamName.msgChineseSimplified);
      templateInputsService.getTeamNameNewSimplified = jest.fn().mockReturnValue(mockTeamName.msgChineseNewSimplified);

      // Act
      const result = (service as any).createActualMarketContent(mockTemplateValue);

      // Assert
      expect(result).toBeDefined();
      expect(result.msgEnglish).toContain('1H Home Team-0.5@Odds 1.85');
      expect(result.msgChineseTraditional).toContain('上半場主隊-0.5@賠率 1.85');
    });

    it('should set filterFavoriteType to betTeam for handicap bet type', () => {
      // Arrange
      templateInputsService.getPrefixSubType = jest.fn().mockReturnValue({
        msgEnglish: '',
        msgChineseTraditional: '',
        msgChineseSimplified: '',
        msgChineseNewSimplified: ''
      });
      templateInputsService.getTeamName = jest.fn().mockReturnValue('Home Team');
      templateInputsService.getTeamNameTraditional = jest.fn().mockReturnValue('主隊');
      templateInputsService.getTeamNameSimplified = jest.fn().mockReturnValue('主队');
      templateInputsService.getTeamNameNewSimplified = jest.fn().mockReturnValue('主队');

      // Act
      (service as any).createActualMarketContent(mockTemplateValue);

      // Assert
      expect(mockTemplateValue.filterFavoriteType).toBe(mockTemplateValue.betTeam);
    });
  });

  describe('createActualMarketContent - Over Under Bet Type', () => {
    let mockTemplateValue: TemplateValue;

    beforeEach(() => {
      mockTemplateValue = {
        matchId: 123,
        betTypeId: '3',
        groupBetTypeId: 3,
        betTeam: 'a',
        correctOdds: '1.95',
        hdpValues: '2.5',
        groupPHAffected: 0
      };
    });

    it('should create over under market content when betTypeId is over under type', () => {
      // Arrange
      const mockPrefixSubType: TemplateContent = {
        msgEnglish: '',
        msgChineseTraditional: '',
        msgChineseSimplified: '',
        msgChineseNewSimplified: ''
      };

      templateInputsService.getPrefixSubType = jest.fn().mockReturnValue(mockPrefixSubType);

      // Act
      const result = (service as any).createActualMarketContent(mockTemplateValue);

      // Assert
      expect(result).toBeDefined();
      expect(result.msgEnglish).toContain('Under-2.5@Odds 1.95');
      expect(result.msgChineseTraditional).toContain('小盤-2.5@賠率 1.95');
    });
  });

  describe('createActualMarketContent - Other Bet Type', () => {
    let mockTemplateValue: TemplateValue;

    beforeEach(() => {
      mockTemplateValue = {
        matchId: 123,
        betTypeId: '5',
        groupBetTypeId: 5,
        betTeam: 'Home',
        correctOdds: '2.10',
        hdpValues: '0.5',
        groupPHAffected: 0
      };
    });

    it('should create other bet type market content when betTypeId is not handicap or over under', () => {
      // Act
      const result = (service as any).createActualMarketContent(mockTemplateValue);

      // Assert
      expect(result).toBeDefined();
      expect(result.msgEnglish).toBe('@Odds 2.10');
      expect(result.msgChineseTraditional).toBe('@賠率 2.10');
      expect(result.msgChineseSimplified).toBe('@赔率 2.10');
      expect(result.msgChineseNewSimplified).toBe('@赔率 2.10');
    });
  });

  describe('createActualMarketContent - No betTypeId', () => {
    let mockTemplateValue: TemplateValue;

    beforeEach(() => {
      mockTemplateValue = {
        matchId: 123,
        betTypeId: null,
        groupBetTypeId: 1,
        betTeam: 'Home',
        correctOdds: '1.85',
        hdpValues: '0.5',
        groupPHAffected: 0
      };
    });

    it('should create other bet type market content when betTypeId is null', () => {
      // Act
      const result = (service as any).createActualMarketContent(mockTemplateValue);

      // Assert
      expect(result).toBeDefined();
      expect(result.msgEnglish).toBe('@Odds 1.85');
    });
  });

  describe('isHandicapBetType', () => {
    it('should return true when groupBetTypeId is 1 and betTeam is not "All"', () => {
      // Act
      const result = (service as any).isHandicapBetType(1, 'Home');

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when groupBetTypeId is 1 but betTeam is "All"', () => {
      // Act
      const result = (service as any).isHandicapBetType(1, 'All');

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when groupBetTypeId is not 1', () => {
      // Act
      const result = (service as any).isHandicapBetType(3, 'Home');

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('isOverUnderBetType', () => {
    it('should return true when betTypeId is OverUnder', () => {
      // Act
      const result = (service as any).isOverUnderBetType(SpecialSportsBookBetTypes.OverUnder);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when betTypeId is _1HOverUnder', () => {
      // Act
      const result = (service as any).isOverUnderBetType(SpecialSportsBookBetTypes._1HOverUnder);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when betTypeId is not over under type', () => {
      // Act
      const result = (service as any).isOverUnderBetType('5');

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('isFirstHalfBetType', () => {
    it('should return true when betTypeId is _1HHandicap', () => {
      // Act
      const result = (service as any).isFirstHalfBetType(SpecialSportsBookBetTypes._1HHandicap);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when betTypeId is _1HOverUnder', () => {
      // Act
      const result = (service as any).isFirstHalfBetType(SpecialSportsBookBetTypes._1HOverUnder);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when betTypeId is not first half type', () => {
      // Act
      const result = (service as any).isFirstHalfBetType('1');

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('SpecialSportsBookBetTypes', () => {
    it('should have correct constant values', () => {
      expect(SpecialSportsBookBetTypes.Handicap).toBe('1');
      expect(SpecialSportsBookBetTypes.OverUnder).toBe('3');
      expect(SpecialSportsBookBetTypes._1HHandicap).toBe('7');
      expect(SpecialSportsBookBetTypes._1HOverUnder).toBe('8');
    });
  });
});
