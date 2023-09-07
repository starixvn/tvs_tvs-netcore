import { LogInfoDetail } from "../../../../utility/models/log-info-detail.model";

export class NotParticipateModel {
  matchId: number;
  subIssueTypeId: number;
  eventDate?: Date;
  logInfoDetail: LogInfoDetail;
  betTypeId: number;
  playerIds: string;
}