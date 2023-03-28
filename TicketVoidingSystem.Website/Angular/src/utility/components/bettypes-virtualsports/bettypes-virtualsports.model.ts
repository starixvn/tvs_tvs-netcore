export class BetTypeVirtualSport {
    id: number;
    name: string;
    checked: boolean;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
        this.checked = false;
    }
}

export class GroupBetTypeVirtualSport {
    sportTypes: Array<number>;
    betTypes: Array<BetTypeVirtualSport>;
    checked: boolean;
    display: boolean;

    constructor(ids: Array<number>, betTypes: Array<BetTypeVirtualSport>) {
        this.sportTypes = ids;
        this.betTypes = betTypes;
        this.display = false;
        this.checked = false;
    }

    changeAll() {
        this.betTypes.forEach(item => {
            item.checked = this.checked;
        });
    }

    changedItem() {
        this.checked = true;
        for (let i = 0; i < this.betTypes.length && this.checked; i++) {
            this.checked = this.betTypes[i].checked;
        }
    }

    changeDisplay(sportType: number) {
        this.display = this.sportTypes.indexOf(sportType) > -1;
        this.checked = this.display;
        this.changeAll();
    }

    getCheckedBetTypes(): number[] {
        const result = [];
        this.betTypes.forEach(item => {
            if (item.checked) {
                result.push(item.id);
            }
        });

        return result;
    }
}