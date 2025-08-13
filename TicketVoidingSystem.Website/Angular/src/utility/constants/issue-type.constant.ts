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
    [IssueTypeConstant.ABNORMAL_BET, 'TicketVoidingSystem/AbnormalBet/Add'],
    [IssueTypeConstant.ABNORMAL_ACCOUNT, 'TicketVoidingSystem/AbnormalAccount/Add'],
    [IssueTypeConstant.EARLY_KICK_OFF, 'TicketVoidingSystem/EarlyKickOff/Add'],
    [IssueTypeConstant.WRONG_KICK_OFF, 'TicketVoidingSystem/WrongKickOff/Add'],
    [IssueTypeConstant.DANGER_ACCEPTED, 'TicketVoidingSystem/DangerAccepted/Add'],
    [IssueTypeConstant.RED_CARD, 'TicketVoidingSystem/RedCard/Add'],
    [IssueTypeConstant.WRONG_ODDS, 'TicketVoidingSystem/WrongOdds/Add'],
    [IssueTypeConstant.WRONG_SCORE, 'TicketVoidingSystem/WrongScore/Add'],
    [IssueTypeConstant.WRONG_OU, 'TicketVoidingSystem/WrongOU/Add'],
    [IssueTypeConstant.WRONG_1ST_OU, 'TicketVoidingSystem/Wrong1stOU/Add'],
    [IssueTypeConstant.WRONG_HDP, 'TicketVoidingSystem/WrongHDP/Add'],
    [IssueTypeConstant.WRONG_1ST_HDP, 'TicketVoidingSystem/Wrong1stHDP/Add'],
    [IssueTypeConstant.WRONG_QUARTER_HDP, 'TicketVoidingSystem/WrongQuarterHDP/Add'],
    [IssueTypeConstant.ARCHIVED_TICKET, 'TicketVoidingSystem/ArchivedTicket/Add'],
    [IssueTypeConstant.OTHER_ISSUES, 'TicketVoidingSystem/OtherIssues/Add'],
    [IssueTypeConstant.REDUCED_OVER, 'TicketVoidingSystem/ReducedOver/Add'],
    [IssueTypeConstant.DUPLICATE_TICKETS, 'TicketVoidingSystem/DuplicateTickets/Add'],
    [IssueTypeConstant.NOT_PARTICIPATE, 'TicketVoidingSystem/NotParticipate/Add'],
    [IssueTypeConstant.RECOVER_TICKET, 'TicketVoidingSystem/RecoverTicket/Add'],
    [IssueTypeConstant.ABANDONED, 'TicketVoidingSystem/Abandoned/Add'],
    [IssueTypeConstant.WRONG_MARKET_OFFERED, 'TicketVoidingSystem/WrongMarketOffered/Add'],
    [IssueTypeConstant.TECHNICAL_ERROR, 'TicketVoidingSystem/TechnicalError/Add'],
    [IssueTypeConstant.WRONG_ODDS_SPORTS_BOOK, 'TicketVoidingSystem/WrongOddsSportsBook/Add'],
    [IssueTypeConstant.WRONG_OFFERED_NAME, 'TicketVoidingSystem/WrongOfferedName/Add'],
    [IssueTypeConstant.MATCH_COMPLETED, 'TicketVoidingSystem/MatchCompleted/Add'],
    [IssueTypeConstant.MATCH_EARLY_COMPLETED, 'TicketVoidingSystem/MatchEarlyCompleted/Add']
  ]);

  static readonly NAVIGATE_EDIT_REQUEST = new Map<string, string>([
    [IssueTypeConstant.ABNORMAL_BET, 'TicketVoidingSystem/ArchivedTicket/Edit'],
    [IssueTypeConstant.ABNORMAL_ACCOUNT, 'TicketVoidingSystem/AbnormalAccount/Edit'],
    [IssueTypeConstant.EARLY_KICK_OFF, 'TicketVoidingSystem/EarlyKickOff/Edit'],
    [IssueTypeConstant.WRONG_KICK_OFF, 'TicketVoidingSystem/WrongKickOff/Edit'],
    [IssueTypeConstant.DANGER_ACCEPTED, 'TicketVoidingSystem/DangerAccepted/Edit'],
    [IssueTypeConstant.RED_CARD, 'TicketVoidingSystem/RedCard/Edit'],
    [IssueTypeConstant.WRONG_ODDS, 'TicketVoidingSystem/WrongOdds/Edit'],
    [IssueTypeConstant.WRONG_SCORE, 'TicketVoidingSystem/WrongScore/Edit'],
    [IssueTypeConstant.WRONG_OU, 'TicketVoidingSystem/WrongOU/Edit'],
    [IssueTypeConstant.WRONG_1ST_OU, 'TicketVoidingSystem/Wrong1stOU/Edit'],
    [IssueTypeConstant.WRONG_HDP, 'TicketVoidingSystem/WrongHDP/Edit'],
    [IssueTypeConstant.WRONG_1ST_HDP, 'TicketVoidingSystem/Wrong1stHDP/Edit'],
    [IssueTypeConstant.WRONG_QUARTER_HDP, 'TicketVoidingSystem/WrongQuarterHDP/Edit'],
    [IssueTypeConstant.ARCHIVED_TICKET, 'TicketVoidingSystem/ArchivedTicket/Edit'],
    [IssueTypeConstant.OTHER_ISSUES, 'TicketVoidingSystem/OtherIssues/Edit'],
    [IssueTypeConstant.REDUCED_OVER, 'TicketVoidingSystem/ReducedOver/Edit'],
    [IssueTypeConstant.DUPLICATE_TICKETS, 'TicketVoidingSystem/DuplicateTickets/Edit'],
    [IssueTypeConstant.NOT_PARTICIPATE, 'TicketVoidingSystem/NotParticipate/Edit'],
    [IssueTypeConstant.RECOVER_TICKET, 'TicketVoidingSystem/RecoverTicket/Edit'],
    [IssueTypeConstant.ABANDONED, 'TicketVoidingSystem/Abandoned/Edit'],
    [IssueTypeConstant.WRONG_MARKET_OFFERED, 'TicketVoidingSystem/WrongMarketOffered/Edit'],
    [IssueTypeConstant.TECHNICAL_ERROR, 'TicketVoidingSystem/TechnicalError/Edit'],
    [IssueTypeConstant.WRONG_ODDS_SPORTS_BOOK, 'TicketVoidingSystem/WrongOddsSportsBook/Edit'],
    [IssueTypeConstant.WRONG_OFFERED_NAME, 'TicketVoidingSystem/WrongOfferedName/Edit'],
    [IssueTypeConstant.MATCH_COMPLETED, 'TicketVoidingSystem/MatchCompleted/Edit'],
    [IssueTypeConstant.MATCH_EARLY_COMPLETED, 'TicketVoidingSystem/MatchsEarlyCompleted/Edit']
  ]);
}

