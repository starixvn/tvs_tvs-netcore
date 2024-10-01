import { MatchModel } from '../../../../utility/models/match.model';

export class EarlyKickOffModel {
  matchId: number;
  subIssueTypeId: number;
  isMainMatch: boolean;
  matchCode?: string;
  leagueName?: string;
  name?: string;
  eventDate: Date;
  kickOffTime: string;
  match?: MatchModel
  sportType: number;
}