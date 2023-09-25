export class GetMatchQuery {
    matchId: number;
    isMatch3rd: boolean;
}

export class MatchViewModel {
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
    leagueName: string;
    leagueNameNewSimplified: string;
    leagueNameSimplified: string;
    leagueNameTraditional: string;
    matchEvent: string;
    matchEventSimplified: string;
    matchEventNewSimplified: string;
    kickOffTime: Date;
    sportType: number;
    sportTypeName: string;
    sportTypeNameNewSimplified: string;
    sportTypeNameSimplified: string;
    sportTypeNameTraditional: string;
    isOutright: boolean;
}
