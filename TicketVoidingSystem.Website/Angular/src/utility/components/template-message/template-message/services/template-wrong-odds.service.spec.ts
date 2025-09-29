import { TestBed } from '@angular/core/testing';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { Message } from '../../messages/message';
import { TemplateReplace } from '../template.const';
import { TemplateValue } from '../template.model';
import { ReplaceMessageService } from './replace-message.service';
import { TemplateInputsService } from './template-inputs.service';
import { TemplateWrongOddsService } from './template-wrong-odds.service';

describe('TemplateWrongOddsService', () => {
  let service: TemplateWrongOddsService;
  let replaceMessageService: ReplaceMessageService;
  let templateInputsService: TemplateInputsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = TestBed.inject(TemplateWrongOddsService);
    replaceMessageService = TestBed.inject(ReplaceMessageService);
    templateInputsService = TestBed.inject(TemplateInputsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('replaceActualMarketTVS', () => {
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
         favoriteValue: '1.5',
         filterFavoriteType: 'h',
         correctOddsHomeOver: '1.85',
         correctOddsAwayUnder: '1.95',
         wrongOU: '2.5',
         groupPHAffected: 0
       };
    });

    describe('when subIssueTypeId is HANDICAP', () => {
      it('should call replaceActualMarketSubTypeHdp for HANDICAP', () => {
        // Arrange
        const subIssueTypeId = SubIssueTypeConstant.HANDICAP;
        replaceMessageService.replaceEachLanguage = jest.fn();
        templateInputsService.getPrefixSubType = jest.fn().mockReturnValue({
          msgEnglish: 'First Half ',
          msgChineseTraditional: '上半場 ',
          msgChineseSimplified: '上半场 ',
          msgChineseNewSimplified: '上半场 '
        });
        templateInputsService.getTeamName = jest.fn().mockReturnValue('Team A');
        templateInputsService.getTeamNameTraditional = jest.fn().mockReturnValue('隊伍A');
        templateInputsService.getTeamNameSimplified = jest.fn().mockReturnValue('队伍A');
        templateInputsService.getTeamNameNewSimplified = jest.fn().mockReturnValue('队伍A');

        // Act
        service.replaceActualMarketTVS(subIssueTypeId, mockTemplateValue, mockOutputMessage);

        // Assert
        expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledTimes(1);
        expect(templateInputsService.getPrefixSubType).toHaveBeenCalledWith(false);
        expect(templateInputsService.getTeamName).toHaveBeenCalledWith(mockTemplateValue);
        expect(templateInputsService.getTeamNameTraditional).toHaveBeenCalledWith(mockTemplateValue);
        expect(templateInputsService.getTeamNameSimplified).toHaveBeenCalledWith(mockTemplateValue);
        expect(templateInputsService.getTeamNameNewSimplified).toHaveBeenCalledWith(mockTemplateValue);
      });

      it('should call replaceActualMarketSubTypeHdp for FIRST_HALF_HANDICAP', () => {
        // Arrange
        const subIssueTypeId = SubIssueTypeConstant.FIRST_HALF_HANDICAP;
        replaceMessageService.replaceEachLanguage = jest.fn();
        templateInputsService.getPrefixSubType = jest.fn().mockReturnValue({
          msgEnglish: 'First Half ',
          msgChineseTraditional: '上半場 ',
          msgChineseSimplified: '上半场 ',
          msgChineseNewSimplified: '上半场 '
        });
        templateInputsService.getTeamName = jest.fn().mockReturnValue('Team A');
        templateInputsService.getTeamNameTraditional = jest.fn().mockReturnValue('隊伍A');
        templateInputsService.getTeamNameSimplified = jest.fn().mockReturnValue('队伍A');
        templateInputsService.getTeamNameNewSimplified = jest.fn().mockReturnValue('队伍A');

        // Act
        service.replaceActualMarketTVS(subIssueTypeId, mockTemplateValue, mockOutputMessage);

        // Assert
        expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledTimes(1);
        expect(templateInputsService.getPrefixSubType).toHaveBeenCalledWith(true);
        expect(templateInputsService.getTeamName).toHaveBeenCalledWith(mockTemplateValue);
        expect(templateInputsService.getTeamNameTraditional).toHaveBeenCalledWith(mockTemplateValue);
        expect(templateInputsService.getTeamNameSimplified).toHaveBeenCalledWith(mockTemplateValue);
        expect(templateInputsService.getTeamNameNewSimplified).toHaveBeenCalledWith(mockTemplateValue);
      });
    });

    describe('when subIssueTypeId is OVER_UNDER', () => {
      it('should call replaceActualMarketSubTypeOu for OVER_UNDER', () => {
        // Arrange
        const subIssueTypeId = SubIssueTypeConstant.OVER_UNDER;
        replaceMessageService.replaceEachLanguage = jest.fn();
        templateInputsService.getPrefixSubType = jest.fn().mockReturnValue({
          msgEnglish: 'First Half ',
          msgChineseTraditional: '上半場 ',
          msgChineseSimplified: '上半场 ',
          msgChineseNewSimplified: '上半场 '
        });

        // Act
        service.replaceActualMarketTVS(subIssueTypeId, mockTemplateValue, mockOutputMessage);

        // Assert
        expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledTimes(1);
        expect(templateInputsService.getPrefixSubType).toHaveBeenCalledWith(false);
      });

      it('should call replaceActualMarketSubTypeOu for FIRST_HALF_OVER_UNDER', () => {
        // Arrange
        const subIssueTypeId = SubIssueTypeConstant.FIRST_HALF_OVER_UNDER;
        replaceMessageService.replaceEachLanguage = jest.fn();
        templateInputsService.getPrefixSubType = jest.fn().mockReturnValue({
          msgEnglish: 'First Half ',
          msgChineseTraditional: '上半場 ',
          msgChineseSimplified: '上半场 ',
          msgChineseNewSimplified: '上半场 '
        });

        // Act
        service.replaceActualMarketTVS(subIssueTypeId, mockTemplateValue, mockOutputMessage);

        // Assert
        expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledTimes(1);
        expect(templateInputsService.getPrefixSubType).toHaveBeenCalledWith(true);
      });
    });

    describe('when subIssueTypeId is neither HANDICAP nor OVER_UNDER', () => {
      it('should not call any replacement methods for other subIssueTypeId', () => {
        // Arrange
        const subIssueTypeId = 999; // Some other subIssueTypeId
        replaceMessageService.replaceEachLanguage = jest.fn();
        templateInputsService.getPrefixSubType = jest.fn();

        // Act
        service.replaceActualMarketTVS(subIssueTypeId, mockTemplateValue, mockOutputMessage);

        // Assert
        expect(replaceMessageService.replaceEachLanguage).not.toHaveBeenCalled();
        expect(templateInputsService.getPrefixSubType).not.toHaveBeenCalled();
      });
    });

    describe('getCorrectOdds', () => {
       it('should return correctOddsHomeOver when filterFavoriteType is "h"', () => {
         // Arrange
         mockTemplateValue.filterFavoriteType = 'h';
         mockTemplateValue.correctOddsHomeOver = '1.85';
         mockTemplateValue.correctOddsAwayUnder = '1.95';

         // Act
         const result = (service as any).getCorrectOdds(mockTemplateValue);

         // Assert
         expect(result).toBe('1.85');
       });

       it('should return correctOddsAwayUnder when filterFavoriteType is not "h"', () => {
         // Arrange
         mockTemplateValue.filterFavoriteType = 'a';
         mockTemplateValue.correctOddsHomeOver = '1.85';
         mockTemplateValue.correctOddsAwayUnder = '1.95';

         // Act
         const result = (service as any).getCorrectOdds(mockTemplateValue);

         // Assert
         expect(result).toBe('1.95');
       });

       it('should return correctOddsAwayUnder when filterFavoriteType is undefined', () => {
         // Arrange
         mockTemplateValue.filterFavoriteType = undefined;
         mockTemplateValue.correctOddsHomeOver = '1.85';
         mockTemplateValue.correctOddsAwayUnder = '1.95';

         // Act
         const result = (service as any).getCorrectOdds(mockTemplateValue);

         // Assert
         expect(result).toBe('1.95');
       });

       it('should return correctOddsAwayUnder when filterFavoriteType is null', () => {
         // Arrange
         mockTemplateValue.filterFavoriteType = null;
         mockTemplateValue.correctOddsHomeOver = '1.85';
         mockTemplateValue.correctOddsAwayUnder = '1.95';

         // Act
         const result = (service as any).getCorrectOdds(mockTemplateValue);

         // Assert
         expect(result).toBe('1.95');
       });
    });

    describe('replaceActualMarketSubTypeHdp', () => {
      it('should call replaceMessageService.replaceEachLanguage with correct parameters for HANDICAP', () => {
        // Arrange
        const subIssueTypeId = SubIssueTypeConstant.HANDICAP;
        replaceMessageService.replaceEachLanguage = jest.fn();
        templateInputsService.getPrefixSubType = jest.fn().mockReturnValue({
          msgEnglish: 'First Half ',
          msgChineseTraditional: '上半場 ',
          msgChineseSimplified: '上半场 ',
          msgChineseNewSimplified: '上半场 '
        });
        templateInputsService.getTeamName = jest.fn().mockReturnValue('Team A');
        templateInputsService.getTeamNameTraditional = jest.fn().mockReturnValue('隊伍A');
        templateInputsService.getTeamNameSimplified = jest.fn().mockReturnValue('队伍A');
        templateInputsService.getTeamNameNewSimplified = jest.fn().mockReturnValue('队伍A');

        // Act
        service.replaceActualMarketTVS(subIssueTypeId, mockTemplateValue, mockOutputMessage);

        // Assert
        expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
          mockOutputMessage,
          TemplateReplace.ACTUAL_MARKET,
          expect.objectContaining({
            msgEnglish: expect.stringContaining('First Half Team A-1.5@'),
            msgChineseTraditional: expect.stringContaining('上半場 隊伍A-1.5@'),
            msgChineseSimplified: expect.stringContaining('上半场 队伍A-1.5@'),
            msgChineseNewSimplified: expect.stringContaining('上半场 队伍A-1.5@')
          })
        );
      });
    });

    describe('replaceActualMarketSubTypeOu', () => {
      it('should call replaceMessageService.replaceEachLanguage with correct parameters for OVER_UNDER', () => {
        // Arrange
        const subIssueTypeId = SubIssueTypeConstant.OVER_UNDER;
        replaceMessageService.replaceEachLanguage = jest.fn();
        templateInputsService.getPrefixSubType = jest.fn().mockReturnValue({
          msgEnglish: 'First Half ',
          msgChineseTraditional: '上半場 ',
          msgChineseSimplified: '上半场 ',
          msgChineseNewSimplified: '上半场 '
        });

        // Act
        service.replaceActualMarketTVS(subIssueTypeId, mockTemplateValue, mockOutputMessage);

         // Assert
         expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
           mockOutputMessage,
           TemplateReplace.ACTUAL_MARKET,
           expect.objectContaining({
             msgEnglish: expect.stringContaining('First Half Over-2.5@'),
             msgChineseTraditional: expect.stringContaining('上半場 大盤-2.5@'),
             msgChineseSimplified: expect.stringContaining('上半场 大盘-2.5@'),
             msgChineseNewSimplified: expect.stringContaining('上半场 大盘-2.5@')
           })
         );
      });
    });

    describe('edge cases', () => {
      it('should handle null values in templateValue', () => {
        // Arrange
        mockTemplateValue.favoriteValue = null;
        mockTemplateValue.correctOddsHomeOver = null;
        mockTemplateValue.correctOddsAwayUnder = null;
        mockTemplateValue.wrongOU = null;
        const subIssueTypeId = SubIssueTypeConstant.HANDICAP;
        replaceMessageService.replaceEachLanguage = jest.fn();
        templateInputsService.getPrefixSubType = jest.fn().mockReturnValue({
          msgEnglish: 'First Half ',
          msgChineseTraditional: '上半場 ',
          msgChineseSimplified: '上半场 ',
          msgChineseNewSimplified: '上半场 '
        });
        templateInputsService.getTeamName = jest.fn().mockReturnValue('Team A');

        // Act
        service.replaceActualMarketTVS(subIssueTypeId, mockTemplateValue, mockOutputMessage);

        // Assert
        expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledTimes(1);
      });

      it('should handle undefined values in templateValue', () => {
        // Arrange
        mockTemplateValue.favoriteValue = undefined;
        mockTemplateValue.correctOddsHomeOver = undefined;
        mockTemplateValue.correctOddsAwayUnder = undefined;
        mockTemplateValue.wrongOU = undefined;
        const subIssueTypeId = SubIssueTypeConstant.OVER_UNDER;
        replaceMessageService.replaceEachLanguage = jest.fn();
        templateInputsService.getPrefixSubType = jest.fn().mockReturnValue({
          msgEnglish: 'First Half ',
          msgChineseTraditional: '上半場 ',
          msgChineseSimplified: '上半场 ',
          msgChineseNewSimplified: '上半场 '
        });

        // Act
        service.replaceActualMarketTVS(subIssueTypeId, mockTemplateValue, mockOutputMessage);

        // Assert
        expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledTimes(1);
      });
    });
  });
});
