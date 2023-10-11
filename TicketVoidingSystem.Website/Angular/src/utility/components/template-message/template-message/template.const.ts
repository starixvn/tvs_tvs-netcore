import { TemplateContent } from './template.model';

export class Format {
  static readonly EVENT_DATE = 'D/M';
}

export class VoidFunction {
  static readonly SINGLE = 0;
  static readonly EARLY_KICK_OFF = 1;
  static readonly TVS_VOID_PAGE = 2;
}

export class MessageTemplateId {
  static readonly NEXT_CORNER = 33;
  static readonly NEXT_BOOKING = 40;
  static readonly NEXT_GOAL_KICK = 43;
  static readonly MATCH_COMPLETED = 41;
  static readonly NEXT_GOAL = 46;
  static readonly PENALTY_SHOOTOUT = 47;
  static readonly PENALTY_SHOOTOUT_VIRTUAL = 62;
}

export class IssueTypeId {
  static readonly DANGER_ACCEPTED = 1;
  static readonly WRONG_ODDS = 2;
  static readonly WRONG_SCORE = 3;
  static readonly WRONG_HDP = 4;
  static readonly WRONG_1ST_HDP = 5;
  static readonly WRONG_OU = 6;
  static readonly WRONG_1ST_OU = 7;
  static readonly EARLY_KICK_OFF = 8;
  static readonly WRONG_KICK_OFF_TIME = 9;
  static readonly RED_CARD = 10;
  static readonly ABNORMAL_BET = 11;
  static readonly ABNORMAL_BET_REAL_MEMBER = 15;
  static readonly WRONG_MARKET_OFFERED = 12;
  static readonly ABNORMAL_ACCOUNT = 13;
  static readonly REDUCED_OVER = 19;
  static readonly MATCH_COMPLETED = 14;
  static readonly NOT_PARTICIPATE = 21;
  static readonly OTHER_ISSUES = 18;
}

export class SubIssueTypeId {
  static readonly ONWARDS = 33;
  static readonly NO_ONWARDS = 34;
  static readonly TECHNICAL_ERROR = 108;
  static readonly GAME_CRASHED_VOID_LIVE = 109;
  static readonly ABANDONED = 110;
}

export class TemplateReplace {
  static readonly SPORT_TYPE = '{{Sport type}}';
  static readonly HOME_TEAM_NAME = '{{Home team name}}';
  static readonly AWAY_TEAM_NAME = '{{Away team name}}';
  static readonly LEAGUE_NAME = '{{League name}}';
  static readonly EVENT_DATE = '{{Event Date}}';
  static readonly EVENT_TYPE = '{{Event type}}';
  static readonly REASON = '{{Reason}}';
  static readonly SCORE = '{{Score}}';
  static readonly KO_TIME = '{{KO time}}';
  static readonly CHECK_STATEMENT = '{{CheckStatement}}';
  static readonly PLACED_FROM_TIME_RANGE = '{{PlacedFromTimeRange}}';
  static readonly FROM_TIME_RANGE = '{{FromTimeRange}}';
  static readonly PLACED_FROM_TIME_RANGE_NC = '{{PlacedFromTimeRange_NC}}';
  static readonly WRONG_SCORE_ONWARDS = '{{WrongScoreOW}}';
  static readonly ACTUAL_SCORE_ONWARDS = '{{Actual ScoreOW}}';
  static readonly ACTUAL_SCORE = '{{Actual Score}}';
  static readonly WRONG_MARKET = '{{Wrong Market}}';
  static readonly ACTUAL_MARKET = '{{Actual Market}}';
  static readonly HDP_VALUE = '{{HDP Value}}';
  static readonly AOI_MESSAGE = '{{AIOMessage}}';
  static readonly PARLAY = '{{Parlay}}';
  static readonly SPECIAL_BET_TYPE = '{{SpecialBetType}}';
  static readonly PLAYER_NAME = '{{Player Name}}';
}

export class TemplateContentConst {
  static readonly PLACED_AT: TemplateContent = {
    msgEnglish: 'placed at ',
    msgChineseTraditional: '投注於 ',
    msgChineseSimplified: '投注于 ',
    msgChineseNewSimplified: '投注于 '
  };

  static readonly AT: TemplateContent = {
    msgEnglish: 'at',
    msgChineseTraditional: '投注於',
    msgChineseSimplified: '投注于',
    msgChineseNewSimplified: '投注于'
  };

  static readonly SCORE: TemplateContent = {
    msgEnglish: 'Score',
    msgChineseTraditional: '比分',
    msgChineseSimplified: '比分',
    msgChineseNewSimplified: '比分'
  };

  static readonly CHECK_STATEMENT: TemplateContent = {
    msgEnglish: 'Kindly double check your statement again. ',
    msgChineseTraditional: '請重新檢查您的帳目. ',
    msgChineseSimplified: '请重新检查您的帐目. ',
    msgChineseNewSimplified: '请重新检查您的帐目. '
  };
  static readonly LIVE: TemplateContent = {
    msgEnglish: '*Live*',
    msgChineseTraditional: '*走地*',
    msgChineseSimplified: '*走地*',
    msgChineseNewSimplified: '*走地*'
  };

  static readonly EARLY: TemplateContent = {
    msgEnglish: '*Early*',
    msgChineseTraditional: '*早盤*',
    msgChineseSimplified: '*早盘*',
    msgChineseNewSimplified: '*早盘*'
  };

  static readonly PLACED_FROM: TemplateContent = {
    msgEnglish: 'placed from',
    msgChineseTraditional: '投注從',
    msgChineseSimplified: '投注从',
    msgChineseNewSimplified: '投注从'
  };

  static readonly FROM: TemplateContent = {
    msgEnglish: 'from',
    msgChineseTraditional: '從',
    msgChineseSimplified: '从',
    msgChineseNewSimplified: '从'
  };

  static readonly GMT_8: TemplateContent = {
    msgEnglish: '(GMT+8)',
    msgChineseTraditional: '(北京時間)',
    msgChineseSimplified: '(北京时间)',
    msgChineseNewSimplified: '(北京时间)'
  };

  static readonly DATE_TIME = 'D/M h:mm:ss A';

  static readonly ONWARDS: TemplateContent = {
    msgEnglish: 'onwards',
    msgChineseTraditional: '開始',
    msgChineseSimplified: '开始',
    msgChineseNewSimplified: '开始'
  };

  static readonly ACCEPTED_FROM: TemplateContent = {
    msgEnglish: 'accepted from',
    msgChineseTraditional: '接受從',
    msgChineseSimplified: '接受从',
    msgChineseNewSimplified: '接受从'
  };

  static readonly AIO_MESSAGE: TemplateContent = {
    msgEnglish: ' (Including Affected More Bet Types product)',
    msgChineseTraditional: ' (包括有被影響更多投註類型产品)',
    msgChineseSimplified: ' (包括有被影响更多投注类型产品)',
    msgChineseNewSimplified: ' (包括有被影响更多投注类型产品)'
  };

  static readonly PARLAY: TemplateContent = {
    msgEnglish: '[Parlay]',
    msgChineseTraditional: '[串關]',
    msgChineseSimplified: '[串关]',
    msgChineseNewSimplified: '[串关]'
  };

  static readonly FIRST_HALF: TemplateContent = {
    msgEnglish: '1H ',
    msgChineseTraditional: '上半場',
    msgChineseSimplified: '上半场',
    msgChineseNewSimplified: '上半场'
  };

  static readonly OVER: TemplateContent = {
    msgEnglish: 'Over',
    msgChineseTraditional: '大盤',
    msgChineseSimplified: '大盘',
    msgChineseNewSimplified: '大盘'
  };

  static readonly UNDER: TemplateContent = {
    msgEnglish: 'Under',
    msgChineseTraditional: '小盤',
    msgChineseSimplified: '小盘',
    msgChineseNewSimplified: '小盘'
  };

  static readonly ODDS: TemplateContent = {
    msgEnglish: 'Odds',
    msgChineseTraditional: '賠率',
    msgChineseSimplified: '赔率',
    msgChineseNewSimplified: '赔率'
  };
}
