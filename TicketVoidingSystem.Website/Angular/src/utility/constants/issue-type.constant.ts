export class IssueTypeConstant {
  static readonly ABNORMAL_BET = '11';
  static readonly AB_REAL_MEMBER = '15';
  static readonly ABNORMAL_ACCOUNT = '13';
  static readonly EARLY_KICK_OFF = '8';
  static readonly WRONG_KICK_OFF = '9';
  static readonly DANGER_ACCEPTED = '1';
  static readonly RED_CARD = '10';
  static readonly WRONG_ODDS = '2';
  static readonly WRONG_SCORE = '3';
  static readonly WRONG_OU = '6';
  static readonly WRONG_1ST_OU = '7';
  static readonly WRONG_HDP = '4';
  static readonly WRONG_1ST_HDP = '5';
  static readonly WRONG_QUARTER_HDP = '16';
  static readonly ARCHIVED_TICKET = '17';
  static readonly OTHER_ISSUES = '18';
  static readonly REDUCED_OVER = '19';
  static readonly DUPLICATE_TICKETS = '20';
  static readonly NOT_PARTICIPATE = '21';
  static readonly RECOVER_TICKET = '22';
  static readonly ABANDONED = '23';
  static readonly WRONG_MARKET_OFFERED = '12';
  static readonly TECHNICAL_ERROR = '24';
  static readonly WRONG_ODDS_SPORTS_BOOK = '25';
  static readonly WRONG_OFFERED_NAME = '26';
  static readonly MATCH_COMPLETED = '14';
  static readonly MATCH_EARLY_COMPLETED = '27';
  
  static readonly NAME_WRITE_LOG = new Map<string, string>([
    [IssueTypeConstant.ABNORMAL_BET, 'ABNORMAL_BET'],
    [IssueTypeConstant.ABNORMAL_ACCOUNT, 'ABNORMAL_ACCOUNT'],
    [IssueTypeConstant.EARLY_KICK_OFF, 'EARLY_KICK_OFF'],
    [IssueTypeConstant.WRONG_KICK_OFF, 'WRONG_KICK_OFF'],
    [IssueTypeConstant.DANGER_ACCEPTED, 'DANGER_ACCEPTED'],
    [IssueTypeConstant.RED_CARD, 'RED_CARD'],
    [IssueTypeConstant.WRONG_ODDS, 'WRONG_ODDS'],
    [IssueTypeConstant.WRONG_SCORE, 'WRONG_SCORE'],
    [IssueTypeConstant.WRONG_OU, 'WRONG_OU'],
    [IssueTypeConstant.WRONG_1ST_OU, 'WRONG_1ST_OU'],
    [IssueTypeConstant.WRONG_HDP, 'WRONG_HDP'],
    [IssueTypeConstant.WRONG_1ST_HDP, 'WRONG_1ST_HDP'],
    [IssueTypeConstant.WRONG_QUARTER_HDP, 'WRONG_QUARTER_HDP'],
    [IssueTypeConstant.ARCHIVED_TICKET, 'ARCHIVED_TICKET'],
    [IssueTypeConstant.OTHER_ISSUES, 'OTHER_ISSUES'],
    [IssueTypeConstant.REDUCED_OVER, 'REDUCED_OVER'],
    [IssueTypeConstant.DUPLICATE_TICKETS, 'DUPLICATE_TICKETS'],
    [IssueTypeConstant.NOT_PARTICIPATE, 'NOT_PARTICIPATE'],
    [IssueTypeConstant.RECOVER_TICKET, 'RECOVER_TICKET'],
    [IssueTypeConstant.ABANDONED, 'ABANDONED'],
    [IssueTypeConstant.WRONG_MARKET_OFFERED, 'WRONG_MARKET_OFFERED'],
    [IssueTypeConstant.TECHNICAL_ERROR, 'TECHNICAL_ERROR'],
    [IssueTypeConstant.WRONG_ODDS_SPORTS_BOOK, 'WRONG_ODDS_SPORTS_BOOK'],
    [IssueTypeConstant.WRONG_OFFERED_NAME, 'WRONG_OFFERED_NAME'],
    [IssueTypeConstant.MATCH_COMPLETED, 'MATCH_COMPLETED'],
    [IssueTypeConstant.MATCH_EARLY_COMPLETED, 'MATCH_EARLY_COMPLETED']
  ]);

  static readonly NAVIGATE_ADD_REQUEST = new Map<string, string>([
    [IssueTypeConstant.ABNORMAL_BET, 'AbnormalBet'],
    [IssueTypeConstant.ABNORMAL_ACCOUNT, 'AbnormalAccount'],
    [IssueTypeConstant.EARLY_KICK_OFF, 'EarlyKickOff'],
    [IssueTypeConstant.WRONG_KICK_OFF, 'WrongKickOff'],
    [IssueTypeConstant.DANGER_ACCEPTED, 'DangerAccepted'],
    [IssueTypeConstant.RED_CARD, 'RedCard'],
    [IssueTypeConstant.WRONG_ODDS, 'WrongOdds'],
    [IssueTypeConstant.WRONG_SCORE, 'WrongScore'],
    [IssueTypeConstant.WRONG_OU, 'WrongOU'],
    [IssueTypeConstant.WRONG_1ST_OU, 'Wrong1stOU'],
    [IssueTypeConstant.WRONG_HDP, 'WrongHDP'],
    [IssueTypeConstant.WRONG_1ST_HDP, 'Wrong1stHDP'],
    [IssueTypeConstant.WRONG_QUARTER_HDP, 'WrongQuarterHDP'],
    [IssueTypeConstant.ARCHIVED_TICKET, 'ArchivedTicket'],
    [IssueTypeConstant.OTHER_ISSUES, 'OtherIssues'],
    [IssueTypeConstant.REDUCED_OVER, 'ReducedOver'],
    [IssueTypeConstant.DUPLICATE_TICKETS, 'DuplicateTickets'],
    [IssueTypeConstant.NOT_PARTICIPATE, 'NotParticipate'],
    [IssueTypeConstant.RECOVER_TICKET, 'RecoverTicket'],
    [IssueTypeConstant.ABANDONED, 'Abandoned'],
    [IssueTypeConstant.WRONG_MARKET_OFFERED, 'WrongMarketOffered'],
    [IssueTypeConstant.TECHNICAL_ERROR, 'TechnicalError'],
    [IssueTypeConstant.WRONG_ODDS_SPORTS_BOOK, 'WrongOddsSportsBook'],
    [IssueTypeConstant.WRONG_OFFERED_NAME, 'WrongOfferedName'],
    [IssueTypeConstant.MATCH_COMPLETED, 'MatchCompleted'],
    [IssueTypeConstant.MATCH_EARLY_COMPLETED, 'MatchEarlyCompleted']
  ]);
}

