import { GetTicketQueryModel } from '../models/query.model';
import { MatchViewModel } from '../../../internal/components/match-detail/match.viewmodel';

export class FilterModel {
    remark: string;
    groupLicensees: GroupLicensee[];
    currencies: Currency[];
}

export class Licensee {
    id: number;
    name: string;
    isChecked: boolean;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
        this.isChecked = false;
    }
}

export class GroupLicensee {
    groupName: string;
    licensees: Licensee[];
    isChecked: boolean;
    isCollapse: boolean;

    constructor(groupName: string, licensees: Licensee[]) {
        this.groupName = groupName;
        this.licensees = licensees;
        if (groupName.toLowerCase().indexOf('china') !== -1) {
            this.defaultChecked();
        }
        else {
            this.isChecked = false;
            this.isCollapse = true;
        }
    }

    defaultChecked() {
        this.isChecked = true;
        this.isCollapse = false;
        this.checkedGroup();
    }

    checkedGroup() {
        this.licensees.forEach(item => {
            item.isChecked = this.isChecked;
        });
    }

    checkedLicensee() {
        let temp = true;
        for (let i = 0; i < this.licensees.length && temp; i++) {
            if (!this.licensees[i].isChecked) {
                temp = false;
            }
        }

        this.isChecked = temp;
    }

    getValue(): string {
        let value = '';
        this.licensees.forEach(item => {
            value = item.isChecked ?
                value === '' ? item.name : value + ',' + item.name
                : value;
        });

        return value;
    }
}

export interface Currency {
    id: number;
    currencyCode: string;
}

export class TicketType {
    value: string;
    items: Item[];
}

export class Item {
    value: string;
    name: string;
    constructor(value: string, name: string) {
        this.value = value;
        this.name = name;
    }
}

export class FilterEvent {
    getTicketQueryModel: GetTicketQueryModel;
    matchDetail: MatchViewModel;
}