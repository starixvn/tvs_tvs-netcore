import { MatchModel } from "./match.model";

export class SportInfo {
  sportType: number;
  sportName: string;
}

export class LeagueInfo {
  leagueId: number;
  leagueName: string;
}

export class MatchInfo extends LeagueInfo {
  matchId: number;
  name: string;
  sportType?: number;
  matchCode?: string;
  parentId?: number;
  kickOffTime: string;
  eventDate?: Date;
  globalShowTime?: Date;
  matchEvent?: string
}

export class MatchInfoViewModel {
  match: MatchModel;
  errorCode: number;
  errorMsg: string;
}