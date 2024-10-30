import { BetTeamAddRequestResult } from "../../../../utility/components/advanced-mode-add-request/advanced-mode/advanced-mode.model";
import { GroupBetTypeAddRequest } from "../../../../utility/components/advanced-mode-add-request/group-bet-types/group-bet-types.model";
import { LogInfoDetail } from "../../../../utility/models/log-info-detail.model";
import { BetTypeCountModel } from "./get-log-info.model";
import { Selection } from '../../../../utility/models/selection.model';

export class WrongMarketOfferedModel {
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
  selectedAllBetTypes: Selection[];
}