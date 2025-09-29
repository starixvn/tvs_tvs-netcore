import { Result } from '../../models/result';

export class BallSequence {
    static readonly First = 1;
    static readonly Second = 2;
    static readonly Third = 3;
    static readonly LiveAll = [BallSequence.First, BallSequence.Second, BallSequence.Third];
    static readonly LiveSecondOrThird = [BallSequence.Second, BallSequence.Third];
}

export class BetTypeModel {
    id: string;
    name: string;
    liveIndicator: boolean;
    type: number;
    value: string;
    isChecked: boolean;
    ballSequence: number[];
    isShow: boolean;
}

export class BetTypesModel {
    result: Result<string>;
    betTypes: BetTypeModel[] = [];
    isChecked: boolean = false;
}