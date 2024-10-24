import { BetTeamAddRequestResult } from "../../../../utility/components/advanced-mode-add-request/advanced-mode/advanced-mode.model";
import { GroupBetTypeAddRequest } from "../../../../utility/components/advanced-mode-add-request/group-bet-types/group-bet-types.model";
import { LogInfoDetail } from "../../../../utility/models/log-info-detail.model";
import { ControlsAllBetTypesQuery } from '../../../../utility/components/advanced-mode-add-request/controls-all-bet-types/controls-all-bet-types.model';

export class WrongOddsSportsBookModel {
  matchId: number;
  subIssueTypeId: number;
  filterFromTransTime: string;
  filterToTransTime: string;
  voidFromTime?: string;
  voidToTime?: string;
  filterOddsType: string;
  oddsValue: string;
  fromOdds: string;
  toOdds: string;
  correctOdds: string;
  logInfoDetail: LogInfoDetail;
  liveIndicator: number;
  betTeamsResult?: BetTeamAddRequestResult[];
  groupBetTypes?: GroupBetTypeAddRequest[];
  controlsAllBetTypesQueryList?: ControlsAllBetTypesQuery[];
}