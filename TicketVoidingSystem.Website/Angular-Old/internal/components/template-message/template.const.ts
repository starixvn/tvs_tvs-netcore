import { TemplateContent } from './template.model';

export class Format {
    static readonly EVENT_DATE = 'D/M';
}

export class VoidFunction {
    static readonly SINGLE = 0;
    static readonly EARLY_KICK_OFF = 1;
}

export class MessageTemplateId {
    static readonly NEXT_CORNER = 33;
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
    static readonly ABNORMAL_BET = 11;
    static readonly WRONG_MARKET_OFFERED = 12;
}

export class SubIssueTypeId {
    static readonly ONWARDS = '33';
    static readonly NO_ONWARDS = '34';
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

    static readonly ONWARDS: TemplateContent = {
        msgEnglish: 'onwards',
        msgChineseTraditional: '開始',
        msgChineseSimplified: '开始',
        msgChineseNewSimplified: '开始'
    };
}