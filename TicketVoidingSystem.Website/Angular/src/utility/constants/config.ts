import { Item } from '../models/item.model';
import { Selection } from '../models/selection.model';
import { SiteDbGroupModel } from '../models/site-db-group.model';
import { SubIssueTypeConstant } from './sub-issue-type.constant';

export enum IconCheckBox {
  none = 0,
  any = 1,
  all = 2
}

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
  static readonly MARK_TICKET = 9;
}

export class Product {
  static readonly SPORTS_BOOK = 0;
  static readonly NUMBER_GAME = 1;
  static readonly VIRTUAL_SPORTS = 2;
  static readonly VIRTUAL_SPORTS_2 = 5;
  static readonly VIRTUAL_SPORTS_3 = 7;
  static readonly BET_BUILDER = 8;
  static readonly BITCOIN = 9;

  static readonly DISPLAY = {
    'Sportsbook': 0,
    'Number Game': 1,
    'Virtual Sports': 2,
    'Virtual Sports 2': 5,
    'Virtual Sports 3': 7,
    'Bet Builder': 8,
    'Bitcoin': 9
  };

  static readonly IS_MATCH_3RD = [Product.BITCOIN];
  static readonly SHOW_SEND_COLUMN = [Product.SPORTS_BOOK, Product.NUMBER_GAME, Product.BET_BUILDER];
  static readonly GET_BETTYPES = [Product.SPORTS_BOOK, Product.BET_BUILDER];
  static readonly STATIC_BETTYPES = [Product.NUMBER_GAME, Product.VIRTUAL_SPORTS, Product.BITCOIN];
}

export class SportTypeConst {
  static readonly E_SPORTS = 43;
  static readonly CRICKET = 50;
  static readonly VOLEYBALL = 6;
  static readonly TENNIS = 5;
}

export class ProductFilter {
  static readonly SELECTION_ITEMS: Selection[] = [
    {
      name: 'Sportsbook',
      value: '1',
      group: 'All'
    },
    {
      name: 'Parlay',
      value: '2',
      group: 'All'
    },
    {
      name: 'Outright',
      value: '4',
      group: 'All'
    },
    {
      name: 'Saba',
      value: '5',
      group: 'All'
    }
  ];
}

export class TicketStatus {
  static readonly RUNNING = 0;
  static readonly WAITING = 1;
  static readonly WON = 112;
  static readonly LOSE = 113;
  static readonly DRAW = 111;

  static readonly MULTIPLE_OPTIONS: Selection[] = [
    { value: TicketStatus.RUNNING.toString(), name: 'Running', group: 'All' }
  ];

  static readonly SELECTION_ITEMS: Selection[] = [
    {
      name: 'Running',
      value: TicketStatus.RUNNING.toString() + ',' + TicketStatus.WAITING.toString(),
      group: 'All'
    },
    {
      name: 'Won',
      value: TicketStatus.WON.toString(),
      group: 'All'
    },
    {
      name: 'Lose',
      value: TicketStatus.LOSE.toString(),
      group: 'All'
    },
    {
      name: 'Draw',
      value: TicketStatus.DRAW.toString(),
      group: 'All'
    }
  ];

  static readonly SELECTION_ITEMS_AUTO_VOID_POLICY: Selection[] = [
    {
      name: 'Running',
      value: TicketStatus.RUNNING.toString() + ',' + TicketStatus.WAITING.toString(),
      group: 'All'
    },
    {
      name: 'Won',
      value: TicketStatus.WON.toString(),
      group: 'All'
    }
  ];
}

export class MarkType {
  static readonly MARK_FUNCTION = 0;
  static readonly ADD_REQUEST = 1;
  static readonly AUTO = 2;
}

export class ManageRequestStatus {
  static readonly ALL_ID = -1;
  static readonly NEW_ID = 0;
  static readonly RUNNING_ID = 1;
  static readonly COMPLETED_ID = 2;
  static readonly FAILED_ID = 3;

  static readonly RUNNING = 'Running';
  static readonly FAILED = 'Failed';
  static readonly COMPLETED = 'Completed';

  static readonly MULTIPLE_OPTIONS: Selection[] = [
    { value: ManageRequestStatus.ALL_ID.toString(), name: 'All' },
    { value: ManageRequestStatus.NEW_ID.toString(), name: 'New' },
    { value: ManageRequestStatus.RUNNING_ID.toString(), name: 'Running' },
    { value: ManageRequestStatus.FAILED_ID.toString(), name: 'Failed' },
    { value: ManageRequestStatus.COMPLETED_ID.toString(), name: 'Completed' }
  ];
}

export class TVSRequestActionType {
  static readonly AUTO_VOID_WINNING_ID = 1;
  static readonly AUTO_VOID_INSTANT_ID = 4;
  static readonly AUTO_VOID_INSTANT_WITH_POLICY_ID = 10;
  static readonly AUTO_VOID_5M_BEFORE_KO_ID = 6;
  static readonly AUTO_VOID_10M_BEFORE_KO_ID = 7;
  static readonly AUTO_VOID_INSTANT_WITHOUT_POLICY = 8;
  static readonly MANUAL_VOID_ID = 5;
  static readonly TAKE_NOTE_ID = 2;
  static readonly WAITING_ID = 3;
  static readonly AUTO_VOID_RESULT_KEYED_ID = 9;
  static readonly MANUAL_VOID = 'Manual Void';
}

export class DateTimeFormat {
  static readonly DATE_FORMAT = 'YYYY/MM/DD';
  static readonly DATE_MONTH_YEAR = 'DD MMMM yyyy';
  static readonly TIME_FORMAT = 'hh:mm:ss.SSS A';
  static readonly SHORT_TIME_FORMAT = 'hh:mm A';
  static readonly FULL_DATE_TIME_FORMAT = 'YYYY/MM/DD hh:mm:ss.SSS A';
}

export class TVSRequestFilterBy {
  static readonly BET_ID = 0;
  static readonly TRANS_TIME = 1;
  static readonly CHECK_TIME = 2;
  static readonly ABNORMAL = 3;
  static readonly TRANS_TIME_AND_CHECK_TIME = 4;
}

export class TeamFavorite {
  static readonly HOME = 0;
  static readonly AWAY = 1;
}

export class AbnormalFilterBy {
  static readonly SINGLE = null;
  static readonly MIX_PARLAY = 1;

  items: Item[] = [
    { name: 'Single ticket', value: AbnormalFilterBy.SINGLE },
    { name: 'Mix Parlay ticket', value: AbnormalFilterBy.MIX_PARLAY }
  ];

  duplicateTicketsFilterItems: Item[] = [
    { name: 'Single ticket', value: AbnormalFilterBy.SINGLE },
    { name: 'Parlay ticket', value: AbnormalFilterBy.MIX_PARLAY }
  ];
}

export class MatchType {
  static readonly NORMAL = 0;
  static readonly CHILD = 1;
  static readonly LINK = 2;
}

export class TVSLeagueEventDisplayType {
  static readonly VERTICAL = 1;
  static readonly HORIZONTAL = 2;
}

export class AcceptType {
  static readonly AUTO_ACCEPT = 1;
  static readonly SECOND_ACCEPT = 2;
  static readonly PENDING_ACCEPT = 3;
}

export class ABExceptionListLevel {
  static readonly All = '0';
  static readonly Super = '4';
  static readonly Master = '3';
  static readonly Agent = '2';
  static readonly Member = '1';

  static readonly MULTIPLE_OPTIONS: Selection[] = [
    { value: ABExceptionListLevel.All, name: 'All' },
    { value: ABExceptionListLevel.Super, name: 'Super' },
    { value: ABExceptionListLevel.Master, name: 'Master' },
    { value: ABExceptionListLevel.Agent, name: 'Agent' },
    { value: ABExceptionListLevel.Member, name: 'Member' }
  ];
}

export class ABExceptionListVoidVIP {
  static readonly No = '0';
  static readonly Yes = '1';
  static readonly NA = '-1';

  static readonly MULTIPLE_OPTIONS: Selection[] = [
    { value: ABExceptionListVoidVIP.Yes, name: 'Yes', group: 'All' },
    { value: ABExceptionListVoidVIP.No, name: 'No', group: 'All' },
    { value: ABExceptionListVoidVIP.NA, name: 'N/A', group: 'All' }
  ];
}

export class TimeZone {
  static readonly AMERICA_CARACAS = 'America/Caracas';
  static readonly ASIA_MANILA = 'Asia/Manila';
}

export class SubIssueTypeGroup {
  static readonly SUBTYPE_HAVE_HIDE_OPTION: number[] = [
    SubIssueTypeConstant.GOAL,
    SubIssueTypeConstant.MAIN_CORNER,
    SubIssueTypeConstant.NEXT_CORNER,
    SubIssueTypeConstant.PEN_GOAL_VAR_PEN_GOAL,
    SubIssueTypeConstant.BET_FC_PEN_GOAL_GOAL,
    SubIssueTypeConstant.GOAL_PEN_1ST_2ND_MARK,
    SubIssueTypeConstant.GOAL_PEN_FOUL_OBS,
    SubIssueTypeConstant.GOAL_PEN_FOUL_NOT_ALLOWANCE,
    SubIssueTypeConstant.NEXT_GOAL
  ];

  static readonly SUBTYPE_NO_ONWARDS: number[] = [
    SubIssueTypeConstant.NO_INDICATION_AWAY_GOAL_NO_ONWARDS,
    SubIssueTypeConstant.NO_INDICATION_HOME_GOAL_NO_ONWARDS,
    SubIssueTypeConstant.NO_INDICATION_AWAY_BOOKING_NO_ONWARDS,
    SubIssueTypeConstant.NO_INDICATION_HOME_BOOKING_NO_ONWARDS,
    SubIssueTypeConstant.WRONG_INDICATION_SCORE_NO_ONWARDS,
    SubIssueTypeConstant.WRONG_INDICATION_SWAP_TEAM_SCORE_NO_ONWARDS
  ];

  static readonly SUBTYPE_ONWARDS: number[] = [
    SubIssueTypeConstant.NO_INDICATION_AWAY_GOAL_ONWARDS,
    SubIssueTypeConstant.NO_INDICATION_HOME_GOAL_ONWARDS,
    SubIssueTypeConstant.NO_INDICATION_AWAY_BOOKING_ONWARDS,
    SubIssueTypeConstant.NO_INDICATION_HOME_BOOKING_ONWARDS,
    SubIssueTypeConstant.WRONG_INDICATION_SCORE_ONWARDS,
    SubIssueTypeConstant.WRONG_INDICATION_SWAP_TEAM_SCORE_ONWARDS,
  ];

  static readonly SUBTYPE_VAR: number[] = [
    SubIssueTypeConstant.GOAL,
    SubIssueTypeConstant.GOAL_AWAY,
    SubIssueTypeConstant.GOAL_HOME,
    SubIssueTypeConstant.PEN_GOAL_VAR_PEN_GOAL,
    SubIssueTypeConstant.PEN_GOAL_VAR_PEN_GOAL_HOME,
    SubIssueTypeConstant.PEN_GOAL_VAR_PEN_GOAL_AWAY,
    SubIssueTypeConstant.BET_FC_PEN_GOAL_GOAL,
    SubIssueTypeConstant.BET_FC_PEN_GOAL_GOAL_HOME,
    SubIssueTypeConstant.BET_FC_PEN_GOAL_GOAL_AWAY,
    SubIssueTypeConstant.RED_CARD_VAR_HOME,
    SubIssueTypeConstant.RED_CARD_VAR_AWAY,
    SubIssueTypeConstant._2YC_HOME,
    SubIssueTypeConstant._2YC_AWAY,
    SubIssueTypeConstant.BETRADAR_FC_RED_CARD_HOME,
    SubIssueTypeConstant.BETRADAR_FC_RED_CARD_AWAY,
    SubIssueTypeConstant.MAIN_BOOKING_HOME,
    SubIssueTypeConstant.MAIN_BOOKING_AWAY,
    SubIssueTypeConstant.GOAL_PEN_1ST_2ND_MARK,
    SubIssueTypeConstant.GOAL_PEN_1ST_2ND_MARK_HOME,
    SubIssueTypeConstant.GOAL_PEN_1ST_2ND_MARK_AWAY,
    SubIssueTypeConstant.WRONG_INDICATION_HOME_RC,
    SubIssueTypeConstant.WRONG_INDICATION_AWAY_RC,
    SubIssueTypeConstant.NO_INDICATION_HOME_BOOKING_NO_ONWARDS,
    SubIssueTypeConstant.NO_INDICATION_HOME_BOOKING_ONWARDS,
    SubIssueTypeConstant.NO_INDICATION_AWAY_BOOKING_NO_ONWARDS,
    SubIssueTypeConstant.NO_INDICATION_AWAY_BOOKING_ONWARDS,
    SubIssueTypeConstant.WRONG_INDICATION_SCORE_NO_ONWARDS,
    SubIssueTypeConstant.WRONG_INDICATION_SCORE_ONWARDS
  ];
}

export class FunctionConst {
  static readonly SINGLE = 0;
  static readonly EARLY_KICK_OFF = 1;
  static readonly TVS_VOID_PAGE = 2;
  static readonly MARK_TICKETS = 3;
}

export class PoolHouseTicketValue {
  static readonly SELECT_ALL_BETTYPE = 'All';
  static readonly NOT_AFFECTED = '-1';
}

export class SiteDbGroupConstant {
  static readonly CentralDb = 0;
  static readonly SiteDb1 = 1;
  static readonly SiteDb2 = 2;
  static readonly SiteDb3 = 3;

  static readonly ServerList: SiteDbGroupModel[] = [
    { id: SiteDbGroupConstant.CentralDb, serverName: 'CentralDb' },
    { id: SiteDbGroupConstant.SiteDb1, serverName: 'SiteDb1' },
    { id: SiteDbGroupConstant.SiteDb2, serverName: 'SiteDb2' },
    { id: SiteDbGroupConstant.SiteDb3, serverName: 'SiteDb3' }
  ];
}

export class ActionVoidByIssueTypeConst {
  static readonly REDUCED_OVER: number[] = [
    TVSRequestActionType.AUTO_VOID_RESULT_KEYED_ID,
    TVSRequestActionType.MANUAL_VOID_ID,
    TVSRequestActionType.TAKE_NOTE_ID
  ];
  static readonly WRONG_ODDS: number[] = [
    TVSRequestActionType.MANUAL_VOID_ID,
    TVSRequestActionType.TAKE_NOTE_ID,
    TVSRequestActionType.WAITING_ID
  ];
  static readonly DANGER_ACCEPTED: number[] = [
    TVSRequestActionType.MANUAL_VOID_ID,
    TVSRequestActionType.TAKE_NOTE_ID,
    TVSRequestActionType.WAITING_ID
  ];
  static readonly WRONG_SCORE: number[] = [
    TVSRequestActionType.MANUAL_VOID_ID,
    TVSRequestActionType.TAKE_NOTE_ID,
    TVSRequestActionType.WAITING_ID
  ];
  static readonly WRONG_HDP: number[] = [
    TVSRequestActionType.MANUAL_VOID_ID,
    TVSRequestActionType.TAKE_NOTE_ID,
    TVSRequestActionType.WAITING_ID
  ];
  static readonly WRONG_1ST_HDP: number[] = [
    TVSRequestActionType.MANUAL_VOID_ID,
    TVSRequestActionType.TAKE_NOTE_ID,
    TVSRequestActionType.WAITING_ID
  ];
  static readonly WRONG_OU: number[] = [
    TVSRequestActionType.MANUAL_VOID_ID,
    TVSRequestActionType.TAKE_NOTE_ID,
    TVSRequestActionType.WAITING_ID
  ];
  static readonly WRONG_1ST_OU: number[] = [
    TVSRequestActionType.MANUAL_VOID_ID,
    TVSRequestActionType.TAKE_NOTE_ID,
    TVSRequestActionType.WAITING_ID
  ];
  static readonly EARLY_KICK_OFF: number[] = [
    TVSRequestActionType.MANUAL_VOID_ID,
    TVSRequestActionType.AUTO_VOID_INSTANT_ID,
    TVSRequestActionType.TAKE_NOTE_ID,
    TVSRequestActionType.WAITING_ID
  ];
  static readonly WRONG_KICK_OFF: number[] = [
    TVSRequestActionType.MANUAL_VOID_ID,
    TVSRequestActionType.AUTO_VOID_INSTANT_ID,
    TVSRequestActionType.TAKE_NOTE_ID,
    TVSRequestActionType.WAITING_ID
  ];
  static readonly RED_CARD: number[] = [
    TVSRequestActionType.MANUAL_VOID_ID,
    TVSRequestActionType.TAKE_NOTE_ID,
    TVSRequestActionType.WAITING_ID
  ];
  static readonly ABNORMAL_BET_SINGLE: number[] = [
    TVSRequestActionType.AUTO_VOID_WINNING_ID,
    TVSRequestActionType.AUTO_VOID_INSTANT_ID,
    TVSRequestActionType.AUTO_VOID_INSTANT_WITHOUT_POLICY,
    TVSRequestActionType.AUTO_VOID_5M_BEFORE_KO_ID,
    TVSRequestActionType.AUTO_VOID_10M_BEFORE_KO_ID,
    TVSRequestActionType.MANUAL_VOID_ID,
    TVSRequestActionType.TAKE_NOTE_ID,
    TVSRequestActionType.WAITING_ID
  ];
  static readonly ABNORMAL_BET_MIX_PARLAY: number[] = [
    TVSRequestActionType.AUTO_VOID_WINNING_ID,
    TVSRequestActionType.AUTO_VOID_INSTANT_ID,
    TVSRequestActionType.MANUAL_VOID_ID,
    TVSRequestActionType.TAKE_NOTE_ID,
    TVSRequestActionType.WAITING_ID
  ];
  static readonly ABNORMAL_ACCOUNT: number[] = [
    TVSRequestActionType.MANUAL_VOID_ID,
    TVSRequestActionType.AUTO_VOID_INSTANT_ID,
    TVSRequestActionType.AUTO_VOID_INSTANT_WITH_POLICY_ID,
    TVSRequestActionType.TAKE_NOTE_ID,
    TVSRequestActionType.WAITING_ID
  ];
  static readonly ABNORMAL_BET_REAL_MEMBER: number[] = [
    TVSRequestActionType.AUTO_VOID_WINNING_ID,
    TVSRequestActionType.AUTO_VOID_INSTANT_ID,
    TVSRequestActionType.AUTO_VOID_INSTANT_WITHOUT_POLICY,
    TVSRequestActionType.AUTO_VOID_5M_BEFORE_KO_ID,
    TVSRequestActionType.AUTO_VOID_10M_BEFORE_KO_ID,
    TVSRequestActionType.MANUAL_VOID_ID,
    TVSRequestActionType.TAKE_NOTE_ID,
    TVSRequestActionType.WAITING_ID
  ];
  static readonly ARCHIVED_TICKET: number[] = [
    TVSRequestActionType.MANUAL_VOID_ID
  ];
  static readonly DUPLICATE_TICKETS_AUTO_ADD_REQUEST: number[] = [
    TVSRequestActionType.MANUAL_VOID_ID,
    TVSRequestActionType.AUTO_VOID_INSTANT_ID,
    TVSRequestActionType.TAKE_NOTE_ID
  ];
  static readonly DUPLICATE_TICKETS_ADD_REQUEST: number[] = [
    TVSRequestActionType.MANUAL_VOID_ID,
    TVSRequestActionType.TAKE_NOTE_ID
  ];
  static readonly NOT_PARTICIPATE: number[] = [
    TVSRequestActionType.AUTO_VOID_RESULT_KEYED_ID,
    TVSRequestActionType.MANUAL_VOID_ID,
    TVSRequestActionType.TAKE_NOTE_ID
  ];
}