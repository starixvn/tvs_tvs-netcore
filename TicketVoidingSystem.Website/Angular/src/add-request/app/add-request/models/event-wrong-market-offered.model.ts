import { BetTeamAddRequestResult } from "../../../../utility/components/advanced-mode-add-request/advanced-mode/advanced-mode.model";
import { GroupBetTypeAddRequest } from "../../../../utility/components/advanced-mode-add-request/group-bet-types/group-bet-types.model";
import { LogInfoDetail } from "../../../../utility/models/log-info-detail.model";
import { BetTypeCountModel } from "./get-log-info.model";
import { ControlsAllBetTypesQuery } from '../../../../utility/components/advanced-mode-add-request/controls-all-bet-types/controls-all-bet-types.model';

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
  controlsAllBetTypesQueryList: ControlsAllBetTypesQuery[];
}