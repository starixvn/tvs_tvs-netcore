export class SportsType {
  static readonly SPORTS_BOOK = 0;
  static readonly VIRTUAL_SPORTS = 1;
  static readonly NUMBER_GAME = 2;
  static readonly BETTRADE = 4;
  static readonly CASH_OUT = 5;
}

export class ModeType {
  static readonly SPORT_BOOK = 0;
  static readonly NUMBER_GAME = 1;
  static readonly EARLY_KICKOFF = 2;
  static readonly TICKET_LISTING = 3;
  static readonly PARLAY = 4;
  static readonly VIRTUAL_SPORTS = 5;
}

export class Product {
  static readonly SPORTS_BOOK = 0;
  static readonly NUMBER_GAME = 1;
  static readonly VIRTUAL_SPORTS = 2;
  static readonly METRIC_GAMING = 4;
  static readonly VIRTUAL_SPORTS_2 = 5;
  static readonly BET_BUILDER = 8;

  static readonly DISPLAY = {
    'Sportsbook': 0,
    'Number Game': 1,
    'Virtual Sports': 2,
    'Metric Gaming': 4,
    'Virtual Sports 2': 5,
    'Bet Builder': 8
  };

  static readonly IS_MATCH_3RD = [];
  static readonly SHOW_SEND_COLUMN = [Product.SPORTS_BOOK, Product.NUMBER_GAME, Product.BET_BUILDER];
}

export class SportTypeConst {
  static readonly E_SPORTS = 43;
}

export class FunctionConst {
  static readonly VOID_BY_CURRENCY = 0;
  static readonly VOID_EKO_BET = 1;
  static readonly VOID_PARLAY_BET = 2;
}