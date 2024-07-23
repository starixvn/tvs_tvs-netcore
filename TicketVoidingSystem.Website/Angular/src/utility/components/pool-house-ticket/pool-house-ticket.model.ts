import { WrongOddsGetLogInfoQuery } from "../../../add-request/app/add-request/event-wrong-odds/models/get-log-info.query";
import { MultipleSelection } from "../multiple-selection/multiple-selection";
import { GroupBetType, GroupBetTypesModel } from "./group-bettypes-pool-house/group-bettypes-pool-house.model";
import { LinkedLogsViewModel } from "./linked-log/linked-log.model";
import { TicketsModel } from "./tickets/tickets.model";

export class PoolHouseTicketViewModel {
  groupBetTypes: GroupBetType[];
  affectedTickets: TicketsModel;
  otherTickets: TicketsModel;
  isAffectedGroup1X2: boolean;
  isAffectedGroup1H1X2: boolean;
  isAffectedGroupAIO: boolean;
}

export class PoolHouseTicketsModel {
  isOpen: boolean;
  checkedBetTypes: string;
  query: GetPoolHouseTicketQuery;
  groupBetTypes: GroupBetType[];
  affectedTickets: TicketsModel;
  otherTickets: TicketsModel;
  isAffectedGroup1X2: boolean;
  isAffectedGroup1H1X2: boolean;
  isAffectedGroupAIO: boolean;

  linkedLogsViewModel: LinkedLogsViewModel;
}

export class GetPoolHouseTicketQuery {
  matchId: number;
  actionId: number;
  requestId: number;
  issueTypeId: number;
  subIssueTypeId: number;
  homeFavorite: string;
  awayFavorite: string;
  hdpValue: string;
  wrongMarket: string;
  isLinkGroup1X2: boolean;
  isLinkGroupAIO: boolean;
  filterFromTransTime: string;
  filterToTransTime: string;
  liveIndicator: number;
  wrongOddsInfo: WrongOddsGetLogInfoQuery[];
}

export class PoolHouseTicketsSection {
  isAffected: boolean;
  name: string;
  groupBetTypesModel: GroupBetTypesModel;
  filterBetTypes?: MultipleSelection;
  tickets: TicketsModel;
  isCollapsed: boolean;
}