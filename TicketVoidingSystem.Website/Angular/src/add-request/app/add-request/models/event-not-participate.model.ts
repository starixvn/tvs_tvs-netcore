import { LogInfoDetail } from "../../../../utility/models/log-info-detail.model";

export class NotParticipateModel {
  matchId: number;
  subIssueTypeId: number;
  eventDate?: Date;
  logInfoDetail: LogInfoDetail;
  betTypeIds: string;
  playerId: number;
  playerNames: string;
}