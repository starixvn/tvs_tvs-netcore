import { TestBed } from '@angular/core/testing';
import { Message } from '../../messages/message';
import { TemplateValue } from '../template.model';
import { ReplaceCommonValuesService } from './replace-common-values.service';
import { ReplaceMessageService } from './replace-message.service';
import { TemplateReplace, TemplateContentConst } from '../template.const';

describe('ReplaceCommonValuesService', () => {
  let service: ReplaceCommonValuesService;
  let mockReplaceMessageService: jest.Mocked<ReplaceMessageService>;

  beforeEach(() => {
    const mockReplaceMessageServiceSpy = {
      replaceEachLanguage: jest.fn(),
      replaceAll: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        ReplaceCommonValuesService,
        { provide: ReplaceMessageService, useValue: mockReplaceMessageServiceSpy }
      ]
    });

    service = TestBed.inject(ReplaceCommonValuesService);
    mockReplaceMessageService = TestBed.inject(ReplaceMessageService) as jest.Mocked<ReplaceMessageService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('replaceSportType', () => {
    it('should call replaceEachLanguage with correct parameters', () => {
      // Arrange
      const mockTemplateValue = {
        sportType: {
          msgEnglish: 'Football',
          msgChineseTraditional: '足球',
          msgChineseSimplified: '足球',
          msgChineseNewSimplified: '足球'
        }
      } as TemplateValue;
      const mockOutputMessage = {} as Message;

      // Act
      service.replaceSportType(mockTemplateValue, mockOutputMessage);

      // Assert
      expect(mockReplaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.SPORT_TYPE,
        mockTemplateValue.sportType
      );
    });
  });

  describe('replaceHomeTeamName', () => {
    it('should call replaceEachLanguage with correct parameters', () => {
      // Arrange
      const mockTemplateValue = {
        homeTeamName: {
          msgEnglish: 'Team A',
          msgChineseTraditional: '隊伍A',
          msgChineseSimplified: '队伍A',
          msgChineseNewSimplified: '队伍A'
        }
      } as TemplateValue;
      const mockOutputMessage = {} as Message;

      // Act
      service.replaceHomeTeamName(mockTemplateValue, mockOutputMessage);

      // Assert
      expect(mockReplaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.HOME_TEAM_NAME,
        mockTemplateValue.homeTeamName
      );
    });
  });

  describe('replaceAwayTeamName', () => {
    it('should call replaceEachLanguage with correct parameters', () => {
      // Arrange
      const mockTemplateValue = {
        awayTeamName: {
          msgEnglish: 'Team B',
          msgChineseTraditional: '隊伍B',
          msgChineseSimplified: '队伍B',
          msgChineseNewSimplified: '队伍B'
        }
      } as TemplateValue;
      const mockOutputMessage = {} as Message;

      // Act
      service.replaceAwayTeamName(mockTemplateValue, mockOutputMessage);

      // Assert
      expect(mockReplaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.AWAY_TEAM_NAME,
        mockTemplateValue.awayTeamName
      );
    });
  });

  describe('replaceLeagueName', () => {
    it('should call replaceEachLanguage with correct parameters', () => {
      // Arrange
      const mockTemplateValue = {
        leagueName: {
          msgEnglish: 'Premier League',
          msgChineseTraditional: '英超',
          msgChineseSimplified: '英超',
          msgChineseNewSimplified: '英超'
        }
      } as TemplateValue;
      const mockOutputMessage = {} as Message;

      // Act
      service.replaceLeagueName(mockTemplateValue, mockOutputMessage);

      // Assert
      expect(mockReplaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.LEAGUE_NAME,
        mockTemplateValue.leagueName
      );
    });
  });

  describe('replacePlayerName', () => {
    it('should call replaceEachLanguage with correct parameters', () => {
      // Arrange
      const mockTemplateValue = {
        playerName: {
          msgEnglish: 'Player Name',
          msgChineseTraditional: '球員名稱',
          msgChineseSimplified: '球员名称',
          msgChineseNewSimplified: '球员名称'
        }
      } as TemplateValue;
      const mockOutputMessage = {} as Message;

      // Act
      service.replacePlayerName(mockTemplateValue, mockOutputMessage);

      // Assert
      expect(mockReplaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.PLAYER_NAME,
        mockTemplateValue.playerName
      );
    });
  });

  describe('replaceEventDate', () => {
    it('should replace event date when not void by bet id', () => {
      // Arrange
      const mockTemplateValue = {
        match: {
          kickOffTime: '2024-01-15T10:00:00Z'
        },
        isVoidByBetId: false
      } as TemplateValue;
      const mockOutputMessage = {} as Message;
      const issueTypeId = 1;

      // Act
      service.replaceEventDate(mockTemplateValue, mockOutputMessage, issueTypeId);

      // Assert
      expect(mockReplaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.EVENT_DATE,
        expect.any(String)
      );
    });

    it('should replace event date when void by bet id', () => {
      // Arrange
      const mockTemplateValue = {
        match: {
          kickOffTime: '2024-01-15T10:00:00Z'
        },
        isVoidByBetId: true
      } as TemplateValue;
      const mockOutputMessage = {} as Message;
      const issueTypeId = 1;

      // Act
      service.replaceEventDate(mockTemplateValue, mockOutputMessage, issueTypeId);

      // Assert
      expect(mockReplaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.EVENT_DATE,
        expect.any(String)
      );
    });
  });

  describe('replaceKickOffTime', () => {
    it('should replace kick off time with GMT+8 format', () => {
      // Arrange
      const mockTemplateValue = {
        kickOffTime: '2024-01-15T10:00:00Z'
      } as TemplateValue;
      const mockOutputMessage = {} as Message;

      // Act
      service.replaceKickOffTime(mockTemplateValue, mockOutputMessage);

      // Assert
      expect(mockReplaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.KO_TIME,
        expect.objectContaining({
          msgEnglish: expect.stringContaining('(GMT+8)'),
          msgChineseTraditional: expect.stringContaining('(北京時間)'),
          msgChineseSimplified: expect.stringContaining('(北京时间)'),
          msgChineseNewSimplified: expect.stringContaining('(北京时间)')
        })
      );
    });
  });

  describe('replaceParlay', () => {
    it('should replace parlay when isAbnormalBetParlay is true', () => {
      // Arrange
      const mockOutputMessage = {} as Message;
      const isAbnormalBetParlay = true;

      // Act
      service.replaceParlay(isAbnormalBetParlay, mockOutputMessage);

      // Assert
      expect(mockReplaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.PARLAY,
        TemplateContentConst.PARLAY
      );
    });

    it('should replace parlay with empty string when isAbnormalBetParlay is false', () => {
      // Arrange
      const mockOutputMessage = {} as Message;
      const isAbnormalBetParlay = false;

      // Act
      service.replaceParlay(isAbnormalBetParlay, mockOutputMessage);

      // Assert
      expect(mockReplaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.PARLAY,
        ''
      );
    });
  });

  describe('replaceCheckStatement', () => {
    it('should replace check statement when checkSettled is true', () => {
      // Arrange
      const mockTemplateValue = {
        checkSettled: true
      } as TemplateValue;
      const mockOutputMessage = {} as Message;

      // Act
      service.replaceCheckStatement(mockTemplateValue, mockOutputMessage);

      // Assert
      expect(mockReplaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.CHECK_STATEMENT,
        TemplateContentConst.CHECK_STATEMENT
      );
    });

    it('should replace check statement with empty string when checkSettled is false', () => {
      // Arrange
      const mockTemplateValue = {
        checkSettled: false
      } as TemplateValue;
      const mockOutputMessage = {} as Message;

      // Act
      service.replaceCheckStatement(mockTemplateValue, mockOutputMessage);

      // Assert
      expect(mockReplaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.CHECK_STATEMENT,
        ''
      );
    });
  });

  describe('replaceMap', () => {
    it('should replace map with smallest map ticket when available', () => {
      // Arrange
      const mockTemplateValue = {
        smallestMapTicket: '12345'
      } as TemplateValue;
      const mockOutputMessage = {} as Message;

      // Act
      service.replaceMap(mockTemplateValue, mockOutputMessage);

      // Assert
      expect(mockReplaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.MAP,
        '12345 '
      );
    });

    it('should replace map with empty string when smallest map ticket is not available', () => {
      // Arrange
      const mockTemplateValue = {
        smallestMapTicket: null
      } as TemplateValue;
      const mockOutputMessage = {} as Message;

      // Act
      service.replaceMap(mockTemplateValue, mockOutputMessage);

      // Assert
      expect(mockReplaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.MAP,
        ''
      );
    });
  });

  describe('replaceInning', () => {
    it('should replace inning when inning value is provided', () => {
      // Arrange
      const mockTemplateValue = {
        inning: '1,2,3'
      } as TemplateValue;
      const mockOutputMessage = {} as Message;

      // Act
      service.replaceInning(mockTemplateValue, mockOutputMessage);

      // Assert
      expect(mockReplaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.INNING,
        expect.objectContaining({
          msgEnglish: expect.stringContaining('1st, 2nd, 3rd innings'),
          msgChineseTraditional: expect.stringContaining('一, 二, 三 局'),
          msgChineseSimplified: expect.stringContaining('一, 二, 三 局'),
          msgChineseNewSimplified: expect.stringContaining('一, 二, 三 局')
        })
      );
    });

    it('should replace inning with empty string when inning value is not provided', () => {
      // Arrange
      const mockTemplateValue = {
        inning: null
      } as TemplateValue;
      const mockOutputMessage = {} as Message;

      // Act
      service.replaceInning(mockTemplateValue, mockOutputMessage);

      // Assert
      expect(mockReplaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.INNING,
        ''
      );
    });

    it('should replace inning with empty string when inning value is undefined', () => {
      // Arrange
      const mockTemplateValue = {
        inning: undefined
      } as TemplateValue;
      const mockOutputMessage = {} as Message;

      // Act
      service.replaceInning(mockTemplateValue, mockOutputMessage);

      // Assert
      expect(mockReplaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.INNING,
        ''
      );
    });
  });

  describe('private methods', () => {
    describe('getTemplateInningContent', () => {
      it('should return correct template content for single inning', () => {
        // Arrange
        const inning = '1';

        // Act
        const result = (service as any).getTemplateInningContent(inning);

        // Assert
        expect(result).toEqual({
          msgEnglish: ' at 1st innings',
          msgChineseTraditional: ' 於 一 局',
          msgChineseSimplified: ' 于 一 局',
          msgChineseNewSimplified: ' 于 一 局'
        });
      });

      it('should return correct template content for multiple innings', () => {
        // Arrange
        const inning = '1,2,3';

        // Act
        const result = (service as any).getTemplateInningContent(inning);

        // Assert
        expect(result).toEqual({
          msgEnglish: ' at 1st, 2nd, 3rd innings',
          msgChineseTraditional: ' 於 一, 二, 三 局',
          msgChineseSimplified: ' 于 一, 二, 三 局',
          msgChineseNewSimplified: ' 于 一, 二, 三 局'
        });
      });
    });

    describe('getEnglishInning', () => {
      it('should return correct English ordinal for single inning', () => {
        // Arrange
        const inning = '1';

        // Act
        const result = (service as any).getEnglishInning(inning);

        // Assert
        expect(result).toBe('1st');
      });

      it('should return correct English ordinals for multiple innings', () => {
        // Arrange
        const inning = '1,2,3';

        // Act
        const result = (service as any).getEnglishInning(inning);

        // Assert
        expect(result).toBe('1st, 2nd, 3rd');
      });
    });

    describe('getChineseTraditionalInning', () => {
      it('should return correct Chinese traditional for single inning', () => {
        // Arrange
        const inning = '1';

        // Act
        const result = (service as any).getChineseTraditionalInning(inning);

        // Assert
        expect(result).toBe('一');
      });

      it('should return correct Chinese traditional for multiple innings', () => {
        // Arrange
        const inning = '1,2,3';

        // Act
        const result = (service as any).getChineseTraditionalInning(inning);

        // Assert
        expect(result).toBe('一, 二, 三');
      });
    });

    describe('getChineseSimplifiedInning', () => {
      it('should return correct Chinese simplified for single inning', () => {
        // Arrange
        const inning = '1';

        // Act
        const result = (service as any).getChineseSimplifiedInning(inning);

        // Assert
        expect(result).toBe('一');
      });

      it('should return correct Chinese simplified for multiple innings', () => {
        // Arrange
        const inning = '1,2,3';

        // Act
        const result = (service as any).getChineseSimplifiedInning(inning);

        // Assert
        expect(result).toBe('一, 二, 三');
      });
    });
  });

  describe('edge cases', () => {
    it('should handle null templateValue in replaceSportType', () => {
      // Arrange
      const mockOutputMessage = {} as Message;

      // Act & Assert
      expect(() => {
        service.replaceSportType(null, mockOutputMessage);
      }).toThrow();
    });

    it('should handle null outputMessage in replaceSportType', () => {
      // Arrange
      const mockTemplateValue = {} as TemplateValue;

      // Act & Assert
      expect(() => {
        service.replaceSportType(mockTemplateValue, null);
      }).not.toThrow();
    });

    it('should handle undefined kickOffTime in replaceKickOffTime', () => {
      // Arrange
      const mockTemplateValue = {
        kickOffTime: undefined
      } as TemplateValue;
      const mockOutputMessage = {} as Message;

      // Act & Assert
      expect(() => {
        service.replaceKickOffTime(mockTemplateValue, mockOutputMessage);
      }).not.toThrow();
    });

    it('should handle null kickOffTime in replaceKickOffTime', () => {
      // Arrange
      const mockTemplateValue = {
        kickOffTime: null
      } as TemplateValue;
      const mockOutputMessage = {} as Message;

      // Act & Assert
      expect(() => {
        service.replaceKickOffTime(mockTemplateValue, mockOutputMessage);
      }).not.toThrow();
    });

    it('should handle empty inning string in replaceInning', () => {
      // Arrange
      const mockTemplateValue = {
        inning: ''
      } as TemplateValue;
      const mockOutputMessage = {} as Message;

      // Act
      service.replaceInning(mockTemplateValue, mockOutputMessage);

      // Assert
      expect(mockReplaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.INNING,
        ''
      );
    });
  });
});
