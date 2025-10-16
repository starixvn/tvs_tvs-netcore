import { FilterService } from './filter.service';
import { DateFullTimeNewComponent } from '../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { CheckedBetType, OddsInfo } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { BetType, GroupBetTypesModel } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { IssueTypesModel } from '../../../utility/models/issue-type.model';
import { TemplateContent } from '../../../utility/components/template-message/template-message/template.model';
import { StaticService } from '../../../utility/services/static.service';
import { TEXT } from '../../../utility/constants/text';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { AdvancedModeConstants } from '../../../utility/components/advanced-mode/advanced-mode.constants';

describe('FilterService', () => {
  let service: FilterService;
  let mockTooltip: Tooltip;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new FilterService();
    mockTooltip = {display: jest.fn()} as unknown as Tooltip;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getSelectionSubParlays', () => {
    it('should return empty string when bet is not Sub Parlay', () => {
      // Arrange
      const bet = 'All';
      const selectedComboParlay = ['1', '2', '3'];

      // Act
      const result = service.getSelectionSubParlays(bet, selectedComboParlay);

      // Assert
      expect(result).toBe('');
    });

    it('should return joined string when bet is Sub Parlay', () => {
      // Arrange
      const bet = 'Sub Parlay';
      const selectedComboParlay = ['1', '2', '3'];

      // Act
      const result = service.getSelectionSubParlays(bet, selectedComboParlay);

      // Assert
      expect(result).toBe('1,2,3');
    });

    it('should return empty string when bet is Sub Parlay but no selections', () => {
      // Arrange
      const bet = 'Sub Parlay';
      const selectedComboParlay: string[] = [];

      // Act
      const result = service.getSelectionSubParlays(bet, selectedComboParlay);

      // Assert
      expect(result).toBe('');
    });
  });

  describe('#isSelectionNotValid', () => {
    it('should return true when bet is Sub Parlay and no selections', () => {
      // Arrange
      const bet = 'Sub Parlay';
      const selectedComboParlay: string[] = [];

      // Act
      const result = service.isSelectionNotValid(bet, selectedComboParlay);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when bet is Sub Parlay and has selections', () => {
      // Arrange
      const bet = 'Sub Parlay';
      const selectedComboParlay = ['1', '2', '3'];

      // Act
      const result = service.isSelectionNotValid(bet, selectedComboParlay);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when bet is not Sub Parlay', () => {
      // Arrange
      const bet = 'All';
      const selectedComboParlay: string[] = [];

      // Act
      const result = service.isSelectionNotValid(bet, selectedComboParlay);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('#isTransDateValidity', () => {
    beforeEach(() => {
      jest.spyOn(StaticService, 'isFromTimeSameOrBeforeToTime').mockReturnValue(true);
    });

    it('should return true when both date components are valid and time is valid', () => {
      // Arrange
      const fromTimeComponent = {
        validateWithTooltip: jest.fn().mockReturnValue(true)
      } as unknown as DateFullTimeNewComponent;
      const toTimeComponent = {
        validateWithTooltip: jest.fn().mockReturnValue(true)
      } as unknown as DateFullTimeNewComponent;
      const fromDateTime = '2023-01-01 10:00:00';
      const toDateTime = '2023-01-01 11:00:00';
      
      // Act
      const result = service.isTransDateValidity(
        fromTimeComponent,
        toTimeComponent,
        fromDateTime,
        toDateTime,
        mockTooltip
      );

      // Assert
      expect(result).toBe(true);
      expect(StaticService.isFromTimeSameOrBeforeToTime).toHaveBeenCalledWith(
        fromDateTime,
        toDateTime,
        mockTooltip,
        'from-date-time'
      );
    });

    it('should return false when from date component is invalid', () => {
      // Arrange
      const fromTimeComponent = {
        validateWithTooltip: jest.fn().mockReturnValue(false)
      } as unknown as DateFullTimeNewComponent;
      const toTimeComponent = {
        validateWithTooltip: jest.fn().mockReturnValue(true)
      } as unknown as DateFullTimeNewComponent;
      
      const fromDateTime = '2023-01-01 10:00:00';
      const toDateTime = '2023-01-01 11:00:00';

      // Act
      const result = service.isTransDateValidity(
        fromTimeComponent,
        toTimeComponent,
        fromDateTime,
        toDateTime,
        mockTooltip
      );

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when to date component is invalid', () => {
      // Arrange
      const fromTimeComponent = {
        validateWithTooltip: jest.fn().mockReturnValue(true)
      } as unknown as DateFullTimeNewComponent;
      const toTimeComponent = {
        validateWithTooltip: jest.fn().mockReturnValue(false)
      } as unknown as DateFullTimeNewComponent;
      const fromDateTime = '2023-01-01 10:00:00';
      const toDateTime = '2023-01-01 11:00:00';

      // Act
      const result = service.isTransDateValidity(
        fromTimeComponent,
        toTimeComponent,
        fromDateTime,
        toDateTime,
        mockTooltip
      );

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when time validation fails', () => {
      // Arrange
      const fromTimeComponent = {
        validateWithTooltip: jest.fn().mockReturnValue(true)
      } as unknown as DateFullTimeNewComponent;
      const toTimeComponent = {
        validateWithTooltip: jest.fn().mockReturnValue(true)
      } as unknown as DateFullTimeNewComponent;
      jest.spyOn(StaticService, 'isFromTimeSameOrBeforeToTime').mockReturnValue(false);
      const fromDateTime = '2023-01-01 10:00:00';
      const toDateTime = '2023-01-01 11:00:00';

      // Act
      const result = service.isTransDateValidity(
        fromTimeComponent,
        toTimeComponent,
        fromDateTime,
        toDateTime,
        mockTooltip
      );

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('#inValidMatch', () => {
    it('should return true and display tooltip when matchId is empty', () => {
      // Arrange
      const matchId = '';
      const isSuccessMatch = true;

      // Act
      const result = service.inValidMatch(matchId, isSuccessMatch, mockTooltip);

      // Assert
      expect(result).toBe(true);
      expect(mockTooltip.display).toHaveBeenCalledWith('match-id', TEXT.REQUIRED_MATCHID);
    });

    it('should return true and display tooltip when matchId is invalid', () => {
      // Arrange
      const matchId = '123';
      const isSuccessMatch = false;

      // Act
      const result = service.inValidMatch(matchId, isSuccessMatch, mockTooltip);

      // Assert
      expect(result).toBe(true);
      expect(mockTooltip.display).toHaveBeenCalledWith('match-id', TEXT.INVALID_MATCHID);
    });

    it('should return false when matchId is valid', () => {
      // Arrange
      const matchId = '123';
      const isSuccessMatch = true;

      // Act
      const result = service.inValidMatch(matchId, isSuccessMatch, mockTooltip);

      // Assert
      expect(result).toBe(false);
      expect(mockTooltip.display).not.toHaveBeenCalled();
    });
  });

  describe('#mapPlayerValueToOddsInfo', () => {
    it('should map player values to odds info correctly', () => {
      // Arrange
      const playerValueSelected = ['1', '2,3'];
      const oddsInfo: OddsInfo[] = [
        { playerId: 1, playerName: 'Player 1' } as OddsInfo,
        { betChoice: 2, oddsId: 3, playerName: 'Player 2' } as unknown as OddsInfo,
        { playerId: 4, playerName: 'Player 4' } as OddsInfo
      ];

      // Act
      const result = service.mapPlayerValueToOddsInfo(playerValueSelected, oddsInfo);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(oddsInfo[0]);
      expect(result[1]).toEqual(oddsInfo[1]);
    });

    it('should handle duplicate values correctly', () => {
      // Arrange
      const playerValueSelected = ['1', '1', '2,3'];
      const oddsInfo: OddsInfo[] = [
        { playerId: 1, playerName: 'Player 1' } as OddsInfo,
        { betChoice: 2, oddsId: 3, playerName: 'Player 2' } as unknown as OddsInfo
      ];

      // Act
      const result = service.mapPlayerValueToOddsInfo(playerValueSelected, oddsInfo);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(oddsInfo[0]);
      expect(result[1]).toEqual(oddsInfo[1]);
    });

    it('should filter out undefined values', () => {
      // Arrange
      const playerValueSelected = ['999', '1'];
      const oddsInfo: OddsInfo[] = [
        { playerId: 1, playerName: 'Player 1' } as OddsInfo
      ];

      // Act
      const result = service.mapPlayerValueToOddsInfo(playerValueSelected, oddsInfo);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(oddsInfo[0]);
    });
  });

  describe('#getPlayerValueSelectedFromBetTypeQuery', () => {
    beforeEach(() => {
      // Mock cricket bet type IDs by replacing the static property
      (AdvancedModeConstants as any).BETTYPE_CRICKET_WITH_PLAYER = '9680,9682,9684';
    });

    it('should return empty array when no cricket bet types', () => {
      // Arrange
      const betTypes: CheckedBetType[] = [
        { id: 1, transdesc: 'test' } as CheckedBetType
      ];

      // Act
      const result = service.getPlayerValueSelectedFromBetTypeQuery(betTypes);

      // Assert
      expect(result).toEqual([]);
    });

    it('should return player values from transdesc when available', () => {
      // Arrange
      const betTypes: CheckedBetType[] = [
        { id: 9680, transdesc: 'player1,player2,player3' } as CheckedBetType
      ];

      // Act
      const result = service.getPlayerValueSelectedFromBetTypeQuery(betTypes);

      // Assert
      expect(result).toEqual(['player1', 'player2', 'player3']);
    });

    it('should return player values from betTeam and oddsId when transdesc is not available', () => {
      // Arrange
      const betTypes: CheckedBetType[] = [
        { 
          id: 9680, 
          betTeam: 'team1,team2', 
          oddsId: 'odds1,odds2' 
        } as CheckedBetType
      ];

      // Act
      const result = service.getPlayerValueSelectedFromBetTypeQuery(betTypes);

      // Assert
      expect(result).toEqual(['team1,odds1', 'team2,odds2']);
    });
  });

  describe('#replaceEnglishForChinese', () => {
    it('should replace English names with Chinese when Chinese names are missing', () => {
      // Arrange
      const selectedOddsInfo: OddsInfo[] = [
        { 
          playerName: 'Player 1',
          playNamesChineseTraditional: undefined,
          playNamesChineseSimplified: undefined
        } as OddsInfo,
        { 
          playerName: 'Player 2',
          playNamesChineseTraditional: 'Chinese Traditional',
          playNamesChineseSimplified: undefined
        } as OddsInfo
      ];

      // Act
      service.replaceEnglishForChinese(selectedOddsInfo);

      // Assert
      expect(selectedOddsInfo[0].playNamesChineseTraditional).toBe('Player 1');
      expect(selectedOddsInfo[0].playNamesChineseSimplified).toBe('Player 1');
      expect(selectedOddsInfo[1].playNamesChineseTraditional).toBe('Chinese Traditional');
      expect(selectedOddsInfo[1].playNamesChineseSimplified).toBe('Player 2');
    });
  });

  describe('#updateIssueTypes', () => {
    it('should filter out hidden issue types', () => {
      // Arrange
      const data = {
        issueTypes: [
          { issueTypeId: IssueTypeConstant.EARLY_KICK_OFF } as any,
          { issueTypeId: IssueTypeConstant.WRONG_HDP } as any,
          { issueTypeId: IssueTypeConstant.ABNORMAL_BET } as any,
          { issueTypeId: IssueTypeConstant.WRONG_OU } as any
        ]
      } as unknown as IssueTypesModel;

      // Act
      const result = service.updateIssueTypes(data);

      // Assert
      expect(result.issueTypes).toHaveLength(2);
      expect(result.issueTypes[0].issueTypeId).toBe(IssueTypeConstant.WRONG_HDP);
      expect(result.issueTypes[1].issueTypeId).toBe(IssueTypeConstant.WRONG_OU);
    });

    it('should return data as is when no issue types', () => {
      // Arrange
      const data = { issueTypes: [] } as IssueTypesModel;

      // Act
      const result = service.updateIssueTypes(data);

      // Assert
      expect(result).toBe(data);
    });

    it('should return data as is when data is null', () => {
      // Arrange
      const data: IssueTypesModel = null;

      // Act
      const result = service.updateIssueTypes(data);

      // Assert
      expect(result).toBe(data);
    });
  });

  describe('#handleBetTypeOfBasketball', () => {
    let mockAllBetTypes: BetType[];
    let mockGroupBetTypes: GroupBetTypesModel;

    beforeEach(() => {
      mockAllBetTypes = [
        { id: 1, isChecked: false } as BetType,
        { id: 2, isChecked: false } as BetType,
        { id: 3, isChecked: false } as BetType
      ];

      mockGroupBetTypes = {
        changeCheckGroupByBetTypes: jest.fn(),
        changeCheckedGroupToModel: jest.fn(),
        getAllBetType: jest.fn().mockReturnValue(mockAllBetTypes)
      } as unknown as GroupBetTypesModel;
    });

    it('should not process when issue type does not support basketball', () => {
      // Arrange
      const eventType = '0';
      const issueType = 'UNSUPPORTED_ISSUE';
      const subIssueType = '';

      // Act
      service.handleBetTypeOfBasketball(eventType, issueType, subIssueType, mockAllBetTypes, mockGroupBetTypes);

      // Assert
      expect(mockAllBetTypes.every(bt => !bt.isChecked)).toBe(true);
    });

    it('should handle WRONG_HDP issue type for non-live event', () => {
      // Arrange
      const eventType = '0';
      const issueType = IssueTypeConstant.WRONG_HDP;
      const subIssueType = '';

      // Act
      service.handleBetTypeOfBasketball(eventType, issueType, subIssueType, mockAllBetTypes, mockGroupBetTypes);

      // Assert
      expect(mockGroupBetTypes.changeCheckGroupByBetTypes).toHaveBeenCalled();
      expect(mockGroupBetTypes.changeCheckedGroupToModel).toHaveBeenCalled();
    });

    it('should handle WRONG_SCORE issue type', () => {
      // Arrange
      const eventType = '0';
      const issueType = IssueTypeConstant.WRONG_SCORE;
      const subIssueType = '';

      // Act
      service.handleBetTypeOfBasketball(eventType, issueType, subIssueType, mockAllBetTypes, mockGroupBetTypes);

      // Assert
      expect(mockGroupBetTypes.changeCheckGroupByBetTypes).toHaveBeenCalled();
      expect(mockGroupBetTypes.changeCheckedGroupToModel).toHaveBeenCalled();
    });
  });

  describe('#getPlayerNamesSelected', () => {
    beforeEach(() => {
      // Mock cricket bet type IDs by replacing the static property
      (AdvancedModeConstants as any).BETTYPE_CRICKET_WITH_PLAYER = '9680,9682,9684';
    });

    it('should return empty template content when no player values selected', () => {
      // Arrange
      const betTypes: CheckedBetType[] = [];
      const oddsInfo: OddsInfo[] = [];

      // Act
      const result = service.getPlayerNamesSelected(betTypes, oddsInfo);

      // Assert
      expect(result).toBeInstanceOf(TemplateContent);
      expect(result.msgEnglish).toBe('');
      expect(result.msgChineseTraditional).toBe('');
      expect(result.msgChineseSimplified).toBe('');
      expect(result.msgChineseNewSimplified).toBe('');
    });

    it('should return player names in all languages when players are selected', () => {
      // Arrange
      const betTypes: CheckedBetType[] = [
        { id: 9680, transdesc: '1,2' } as CheckedBetType
      ];
      const oddsInfo: OddsInfo[] = [
        { 
          playerId: 1, 
          playerName: 'Player 1',
          playNamesChineseTraditional: 'Player 1 Traditional',
          playNamesChineseSimplified: 'Player 1 Simplified'
        } as OddsInfo,
        { 
          playerId: 2, 
          playerName: 'Player 2',
          playNamesChineseTraditional: 'Player 2 Traditional',
          playNamesChineseSimplified: 'Player 2 Simplified'
        } as OddsInfo
      ];

      // Act
      const result = service.getPlayerNamesSelected(betTypes, oddsInfo);

      // Assert
      expect(result.msgEnglish).toBe('Player 1 & Player 2');
      expect(result.msgChineseTraditional).toBe('Player 1 Traditional 和 Player 2 Traditional');
      expect(result.msgChineseSimplified).toBe('Player 1 Simplified 和 Player 2 Simplified');
      expect(result.msgChineseNewSimplified).toBe('Player 1 Simplified 和 Player 2 Simplified');
    });

    it('should handle duplicate player names correctly', () => {
      // Arrange
      const betTypes: CheckedBetType[] = [
        { id: 9680, transdesc: '1,1' } as CheckedBetType
      ];
      const oddsInfo: OddsInfo[] = [
        { 
          playerId: 1, 
          playerName: 'Player 1',
          playNamesChineseTraditional: 'Player 1 Traditional',
          playNamesChineseSimplified: 'Player 1 Simplified'
        } as OddsInfo
      ];

      // Act
      const result = service.getPlayerNamesSelected(betTypes, oddsInfo);

      // Assert
      expect(result.msgEnglish).toBe('Player 1');
      expect(result.msgChineseTraditional).toBe('Player 1 Traditional');
      expect(result.msgChineseSimplified).toBe('Player 1 Simplified');
    });
  });
});
