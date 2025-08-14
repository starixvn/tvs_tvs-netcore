
export class LastTimeScore {
    scoreId: number;
    lastTime: string;
}

export class LastTimeScoreQuery {
    scoreId: number;
    matchId: number;
    actionId: number;
    filterBy: number;
    filterFromTransTime: string;
}