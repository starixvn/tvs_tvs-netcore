import { LogInfoDetail } from "../../utility/models/log-info-detail.model";

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
}