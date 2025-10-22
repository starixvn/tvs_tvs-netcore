import { WrongOddsGetLogInfoQuery } from '../../events/wrong-odds/app/event-wrong-odds/models/get-log-info.query';
import { MultipleSelection } from '../../../utility/components/multiple-selection/multiple-selection.model';
import { GroupBetType, GroupBetTypesModel } from "./group-bettypes-pool-house/group-bettypes-pool-house.model";
import { LinkedLogsViewModel } from "./linked-log/linked-log.model";
import { TicketsModel } from "./tickets/tickets.model";

export class PoolHouseTicketViewModel {
  groupBetTypes: GroupBetType[];
  affectedTickets: TicketsModel;
  otherTickets: TicketsModel;
}

export class PoolHouseTicketsModel {
  isOpen: boolean;
  checkedBetTypes: string;
  query: GetPoolHouseTicketQuery;
  groupBetTypes: GroupBetType[];
  affectedTickets: TicketsModel;
  otherTickets: TicketsModel;
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