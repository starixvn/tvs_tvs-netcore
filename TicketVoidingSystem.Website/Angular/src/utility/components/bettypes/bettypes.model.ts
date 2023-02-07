import * as _ from 'lodash';
import { Product } from '../../constants/config';
import { Result } from '../../models/result';
import { PrimaryBetType } from '../advanced-mode/group-bettypes/group-bettypes.model';

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

    constructor(id: string, name: string, liveIndicator: boolean, type: number, isChecked: boolean) {
        this.id = id;
        this.name = this.renameNumberGame(id, name);
        this.ballSequence = type === Product.NUMBER_GAME ? this.getBallSequence(id) : [];
        this.liveIndicator = liveIndicator;
        this.type = type;
        this.isChecked = isChecked;
        this.value = _.isUndefined(PrimaryBetType.ROOT[this.id]) ? this.id.toString() : PrimaryBetType.ROOT[this.id];
    }

    renameNumberGame(id: string, name: string): string {
        switch (id) {
            case '85':
            case '86':
                return 'Next ' + name;

            default:
                return name;
        }
    }

    getBallSequence(id: string): number[] {
        switch (id) {
            case '88':
            case '87':
                return BallSequence.LiveSecondOrThird;

            default:
                return BallSequence.LiveAll;
        }
    }

    displayNumberGame(product: number, sportType: number, ballSequence: number[]) {
        if (product === Product.NUMBER_GAME) {
            const intId = parseInt(this.id, 10);
            if (sportType === 161) {
                const isBallSequence = ballSequence.filter(x => {
                    return this.ballSequence.indexOf(x) > -1;
                });
                this.isShow = intId >= 85 && intId <= 91 && isBallSequence.length > 0;
            } else if (sportType === 164) {
                this.isShow = intId >= 8101 && intId <= 8105;
            } else {
                this.isShow = false;
            }
        }
    }
}

export class BetTypesModel {
    result: Result<string>;
    bettypes: BetTypeModel[];
    isChecked: boolean;

    constructor(betTypes: BetTypeModel[], isChecked: boolean) {
        this.isChecked = isChecked;
        this.bettypes = [];
        betTypes.forEach(item => {
            const betType = new BetTypeModel(item.id, item.name, item.liveIndicator, item.type, isChecked);
            this.bettypes.push(betType);
        });
    }

    changeAll() {
        this.bettypes.forEach(item => {
            item.isChecked = this.isChecked;
        });
    }

    changeItem() {
        this.isChecked = true;
        this.bettypes.forEach(item => {
            if (item.isShow && !item.isChecked) {
                this.isChecked = false;
            }
        });
    }

    getCheckedBetTypes(): string[] {
        const result = [];
        this.bettypes.forEach(item => {
            if (item.isShow && item.isChecked) {
                result.push(item.id);
            }
        });

        return result;
    }

    checkDisplay(): boolean {
        let display = false;
        for (let i = 0; i < this.bettypes.length && !display; i++) {
            display = this.bettypes[i].isShow;
        }

        return display;
    }
}