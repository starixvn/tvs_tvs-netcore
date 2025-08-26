import { BetTeamAddRequestResult } from "../../utility/components/advanced-mode-add-request/advanced-mode/advanced-mode.model";
import { GroupBetTypeAddRequest } from "../../utility/components/advanced-mode-add-request/group-bet-types/group-bet-types.model";
import { LogInfoDetail } from "../../utility/models/log-info-detail.model";
import { Selection } from '../../utility/models/selection.model';
import { BetTypeCountModel } from "./get-log-info.model";

export class WrongMarketOfferedModel {
  id: number;
  requestDetailId: number;
  matchId: number;
  subIssueTypeId: number;
  eventDate?: Date;
  filterFromTransTime: string;
  filterToTransTime: string;
  voidFromTime?: string;
  voidToTime?: string;
  logInfoDetail: LogInfoDetail;
  betTeamsResult?: BetTeamAddRequestResult[];
  groupBetTypes?: GroupBetTypeAddRequest[];
  betTypeCount: BetTypeCountModel[];
  allBetTypesSelection: Selection[];
}