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
  static readonly BET_BUILDER = 8;
  static readonly BITCOIN = 9;

  static readonly DISPLAY = {
    'Sportsbook': 0,
    'Number Game': 1,
    'Virtual Sports': 2,
    'Virtual Sports 2': 5,
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

export class TicketStatus {
  static readonly RUNNING = 0;
  static readonly WAITING = 1;
  static readonly WON = 112;
  static readonly LOSE = 113;
  static readonly DRAW = 111;

  static readonly MULTIPLE_OPTIONS: Selection[] = [
    { value: TicketStatus.RUNNING.toString(), name: 'Running', group: 'All' }
  ];

  static readonly SELECTION_ITEMS:  Selection[] = [
    {
      name: 'Running',
      value: TicketStatus.RUNNING.toString() + ',' + TicketStatus.WAITING.toString()
    },
    {
      name: 'Won',
      value: TicketStatus.WON.toString()
    },
    {
      name: 'Lose',
      value: TicketStatus.LOSE.toString()
    },
    {
      name: 'Draw',
      value: TicketStatus.DRAW.toString()
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
  static readonly AUTO_VOID_5M_BEFORE_KO_ID = 6;
  static readonly AUTO_VOID_10M_BEFORE_KO_ID = 7;
  static readonly AUTO_VOID_INSTANT_WITHOUT_POLICY = 8;
  static readonly MANUAL_VOID_ID = 5;
  static readonly TAKE_NOTE_ID = 2;
  static readonly WAITING_ID = 3;

  static readonly MANUAL_VOID = 'Manual Void';
}

export class DateTimeFormat {
  static readonly DATE_FORMAT = 'YYYY/MM/DD';

  static readonly TIME_FORMAT = 'hh:mm:ss.SSS A';
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
}

export class MatchType {
  static readonly NORMAL = 0;
  static readonly CHILD = 1;
  static readonly LINK = 2;
}

export class TVSLeagueEventDisplayType {
  static readonly VERTICAL = 1;
  static readonly HORIZONTAL  = 2;
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
    SubIssueTypeConstant.NO_INDICATION_AWAY_SCORE_NO_ONWARDS,
    SubIssueTypeConstant.NO_INDICATION_HOME_SCORE_NO_ONWARDS,
    SubIssueTypeConstant.WRONG_INDICATION_SCORE_NO_ONWARDS,
    SubIssueTypeConstant.WRONG_INDICATION_SWAP_TEAM_SCORE_NO_ONWARDS
  ];

  static readonly SUBTYPE_ONWARDS: number[] = [
    SubIssueTypeConstant.WRONG_INDICATION_SCORE_ONWARDS,
    SubIssueTypeConstant.NO_INDICATION_AWAY_SCORE_ONWARDS,
    SubIssueTypeConstant.NO_INDICATION_HOME_SCORE_ONWARDS,
    SubIssueTypeConstant.WRONG_INDICATION_SWAP_TEAM_SCORE_ONWARDS,
  ];
}

export class FunctionConst {
  static readonly SINGLE = 0;
  static readonly EARLY_KICK_OFF = 1;
  static readonly TVS_VOID_PAGE = 2;
  static readonly MARK_TICKETS = 3;
}

export class SiteDbGroupConstant {
  static readonly CentralDb = 0;
  static readonly SiteDb1 = 1;
  static readonly SiteDb2 = 2;

  static readonly ServerList: SiteDbGroupModel[] = [
    { id: SiteDbGroupConstant.CentralDb, serverName: 'CentralDb' },
    { id: SiteDbGroupConstant.SiteDb1, serverName: 'SiteDb1' },
    { id: SiteDbGroupConstant.SiteDb2, serverName: 'SiteDb2' },
  ];
}
