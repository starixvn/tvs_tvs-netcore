export class GetMatchQuery {
  matchId: number;
  isMatch3rd: boolean;
}

export class MatchModel {
  matchId: number;
  homeId: number;
  homeName: string;
  homeNameNewSimplified: string;
  homeNameSimplified: string;
  homeNameTraditional: string;
  awayId: number;
  awayName: string;
  awayNameNewSimplified: string;
  awayNameSimplified: string;
  awayNameTraditional: string;
  matchCode: string;
  eventDate: Date;
  dateTime: Date;
  leagueId: number;
  leagueGroupId : number;
  leagueName: string;
  leagueNameNewSimplified: string;
  leagueNameSimplified: string;
  leagueNameTraditional: string;
  matchEvent: string;
  matchEventSimplified: string;
  matchEventNewSimplified: string;
  kickOffTime: string;
  startTime: Date;
  endTime: Date;
  sportType: number;
  sportTypeName: string;
  sportTypeNameNewSimplified: string;
  sportTypeNameSimplified: string;
  sportTypeNameTraditional: string;
  numberOfCorner?: number;
}

export class CheckMatchWithRefNoQuery {
  matchId: number;
  fromRefNo: number;
  toRefNo: number;
  type: number;
}

export class FirstTicketTime {
  minTransDate: string;
  kickOffTime: string;
}
