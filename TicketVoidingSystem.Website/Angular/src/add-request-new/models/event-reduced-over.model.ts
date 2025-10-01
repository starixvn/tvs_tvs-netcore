import { LogInfoDetail } from "../../utility/models/log-info-detail.model";
import { BetTypeCountModel } from "./get-log-info.model";

export class ReducedOverModel {
  matchId: number;
  subIssueTypeId: number;
  eventDate?: Date;
  logInfoDetail: LogInfoDetail;
  betTypeIds: string;
  wicketOver: string;
  filterWicketOver: string;
  playerIds: string;
  runs: string;
  live: boolean;
  nonLive: boolean;
  betTypeCount?: BetTypeCountModel[];
}