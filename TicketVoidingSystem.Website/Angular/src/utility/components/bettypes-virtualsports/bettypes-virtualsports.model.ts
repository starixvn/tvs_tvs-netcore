import { Result } from './../../models/signal-r.model';

export class BetTypeVirtualSport {
    id: number;
    name: string;
    checked: boolean;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
        this.checked = true;
    }
}

export class GroupBetTypeVirtualSport {
    betTypes: Array<BetTypeVirtualSport>;
    result: Result;
    checked: boolean;
    constructor(betTypes: Array<BetTypeVirtualSport>) {
        this.betTypes = betTypes;
        this.result = new Result();
        this.checked = betTypes?.length > 0;
        this.changeAll();
    }

    changeAll() {
        this.betTypes.forEach(item => {
            item.checked = this.checked;
        });
    }
}