import { TestBed } from '@angular/core/testing';
import { TemplateService } from './template.service';
import { MatchModel } from '../../../../models/match.model';
import { TemplateValue } from '../template.model';

describe('TemplateService', () => {
  let service: TemplateService;
  let mockMatch: MatchModel;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateService);
 
    mockMatch = {
      matchId: 12345,
      homeId: 1,
      homeName: 'Manchester United',
      homeNameNewSimplified: '曼联',
      homeNameSimplified: '曼联',
      homeNameTraditional: '曼聯',
      awayId: 2,
      awayName: 'Liverpool',
      awayNameNewSimplified: '利物浦',
      awayNameSimplified: '利物浦',
      awayNameTraditional: '利物浦',
      matchCode: 'MU-LIV',
      eventDate: new Date('2024-01-15T20:00:00Z'),
      globalShowTime: new Date('2024-01-15T19:30:00Z'),
      dateTime: new Date('2024-01-15T20:00:00Z'),
      leagueId: 1,
      leagueGroupId: 1,
      leagueName: 'Premier League',
      leagueNameNewSimplified: '英超',
      leagueNameSimplified: '英超',
      leagueNameTraditional: '英超',
      matchEvent: 'Premier League Match',
      matchEventSimplified: '英超比赛',
      matchEventNewSimplified: '英超比赛',
      kickOffTime: '20:00',
      startTime: new Date('2024-01-15T20:00:00Z'),
      endTime: new Date('2024-01-15T22:00:00Z'),
      sportType: 1,
      sportTypeName: 'Football',
      sportTypeNameNewSimplified: '足球',
      sportTypeNameSimplified: '足球',
      sportTypeNameTraditional: '足球',
      numberOfSubType: 0,
      name: 'Premier League Match',
      parentId: null,
      subtype: 0
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initializeTemplateValue', () => {
    it('should initialize TemplateValue with correct sport type data', () => {
      const result: TemplateValue = service.initializeTemplateValue(mockMatch);

      expect(result.sportType).toBeDefined();
      expect(result.sportType?.msgEnglish).toBe('Football');
      expect(result.sportType?.msgChineseTraditional).toBe('足球');
      expect(result.sportType?.msgChineseSimplified).toBe('足球');
      expect(result.sportType?.msgChineseNewSimplified).toBe('足球');
    });

    it('should initialize TemplateValue with correct home team name data', () => {
      const result: TemplateValue = service.initializeTemplateValue(mockMatch);

      expect(result.homeTeamName).toBeDefined();
      expect(result.homeTeamName?.msgEnglish).toBe('Manchester United');
      expect(result.homeTeamName?.msgChineseTraditional).toBe('曼聯');
      expect(result.homeTeamName?.msgChineseSimplified).toBe('曼联');
      expect(result.homeTeamName?.msgChineseNewSimplified).toBe('曼联');
    });

    it('should initialize TemplateValue with correct away team name data', () => {
      const result: TemplateValue = service.initializeTemplateValue(mockMatch);

      expect(result.awayTeamName).toBeDefined();
      expect(result.awayTeamName?.msgEnglish).toBe('Liverpool');
      expect(result.awayTeamName?.msgChineseTraditional).toBe('利物浦');
      expect(result.awayTeamName?.msgChineseSimplified).toBe('利物浦');
      expect(result.awayTeamName?.msgChineseNewSimplified).toBe('利物浦');
    });

    it('should initialize TemplateValue with correct league name data', () => {
      const result: TemplateValue = service.initializeTemplateValue(mockMatch);

      expect(result.leagueName).toBeDefined();
      expect(result.leagueName?.msgEnglish).toBe('Premier League');
      expect(result.leagueName?.msgChineseTraditional).toBe('英超');
      expect(result.leagueName?.msgChineseSimplified).toBe('英超');
      expect(result.leagueName?.msgChineseNewSimplified).toBe('英超');
    });

    it('should set sportTypeId correctly', () => {
      const result: TemplateValue = service.initializeTemplateValue(mockMatch);

      expect(result.sportTypeId).toBe(1);
    });

    it('should set matchId correctly', () => {
      const result: TemplateValue = service.initializeTemplateValue(mockMatch);

      expect(result.matchId).toBe(12345);
    });

    it('should set match reference correctly', () => {
      const result: TemplateValue = service.initializeTemplateValue(mockMatch);

      expect(result.match).toBe(mockMatch);
    });

    it('should set groupPHAffected to 0 by default', () => {
      const result: TemplateValue = service.initializeTemplateValue(mockMatch);

      expect(result.groupPHAffected).toBe(0);
    });

    it('should handle match with undefined optional fields', () => {
      const matchWithUndefinedFields: MatchModel = {
        matchId: 12345,
        homeName: 'Team A',
        awayName: 'Team B',
        matchCode: 'TEAM-A-TEAM-B',
        eventDate: new Date('2024-01-15T20:00:00Z'),
        leagueName: 'Test League',
        matchEvent: 'Test Match',
        sportType: 1,
        sportTypeName: 'Football'
      };

      const result: TemplateValue = service.initializeTemplateValue(matchWithUndefinedFields);

      expect(result.sportType?.msgEnglish).toBe('Football');
      expect(result.sportType?.msgChineseTraditional).toBeUndefined();
      expect(result.sportType?.msgChineseSimplified).toBeUndefined();
      expect(result.sportType?.msgChineseNewSimplified).toBeUndefined();

      expect(result.homeTeamName?.msgEnglish).toBe('Team A');
      expect(result.homeTeamName?.msgChineseTraditional).toBeUndefined();

      expect(result.awayTeamName?.msgEnglish).toBe('Team B');
      expect(result.awayTeamName?.msgChineseTraditional).toBeUndefined();

      expect(result.leagueName?.msgEnglish).toBe('Test League');
      expect(result.leagueName?.msgChineseTraditional).toBeUndefined();
    });
  });
});
