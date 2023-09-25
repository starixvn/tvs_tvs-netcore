export class PrimaryBetType {
    static readonly ROOT = {
        '1': '1,1303', '2': '2,1305,157', '3': '3,1306', '20': '20,1301', '153': '153,1308', '154': '154,1311', '155': '155,1316',
        '156': '156,1312', '144': '144,163', '159': '159,406', '151': '151,410', '161': '161,407', '171': '171,408', '162': '162,409',
        '191': '191,411', '4': '4,413', '30': '30,414', '172': '172,415', '152': '152,416', '188': '188,427', '184': '184,428',
        '177': '177,430', '186': '186,431', '185': '185,432', '146': '146,433', '189': '189,434', '190': '190,435', '147': '147,436',
        '148': '148,437', '133': '133,438', '134': '134,439', '149': '149,440', '150': '150,441', '140': '140,442', '141': '141,443',
        '142': '142,444', '17': '17,183', '18': '18,178', '401': '401,461', '402': '402,462', '403': '403,463', '404': '404,464',
        '22': '22,160', '206': '206,488', '194': '194,470', '203': '203,471', '202': '202,474', '207': '207,489', '208': '208,491',
        '209': '209,492', '473': '473,11,199', '164': '396,164', '166': '399,166'
    };
}

export class NotSupportBetTypes {
    static readonly IGNORE = 11;
    static readonly ALTERNATIVE = 199;
}

export class HighlightBetTypes {
    static readonly VALUE = [161, 162, 401, 402, 403, 404, 482, 483, 484, 485];
}

export class Result {
    errorCode: number;
    errorMsg: string;
}

export class BetType {
    id: number;
    name: string;
    liveIndicator: boolean;
    type: number;
    value: string;
    isChecked: boolean;
    highlight: boolean;

    constructor(id: number, name: string, liveIndicator: boolean, type: number, isChecked: boolean) {
        this.id = id === NotSupportBetTypes.IGNORE ? NotSupportBetTypes.ALTERNATIVE : id;
        this.name = name;
        this.liveIndicator = liveIndicator;
        this.type = type;
        this.isChecked = isChecked;
        this.value = PrimaryBetType.ROOT[this.id] === undefined ? this.id.toString() : PrimaryBetType.ROOT[this.id];
        this.highlight = HighlightBetTypes.VALUE.indexOf(id) > -1;
    }
}

export class GroupBetType {
    groupName: string;
    betTypes: BetType[];
    isChecked: boolean;
    isShow: boolean;

    constructor(groupName: string, betTypes: BetType[], isChecked: boolean) {
        this.isShow = true;
        this.groupName = groupName;
        this.isChecked = isChecked;
        this.renderBetTypes(betTypes, isChecked);
    }

    renderBetTypes(betTypes: BetType[], isChecked: boolean) {
        this.betTypes = [];
        betTypes.forEach(item => {
            const betType = new BetType(
                parseInt(item.id.toString(), 10),
                item.name,
                item.liveIndicator,
                item.type,
                isChecked
            );
            this.betTypes.push(betType);
        });
    }

    changeCheckedGroupToBetType() {
        this.betTypes.forEach(betType => {
            betType.isChecked = this.isChecked && this.isShow;
        });
    }

    changeCheckedBetTypeToGroup() {
        let temp = true;
        for (let i = 0; i < this.betTypes.length && temp; i++) {
            temp = this.betTypes[i].isChecked;
        }
        this.isChecked = temp;
    }

    getCheckedBetTypes(): number[] {
        const value: Array<number> = [];
        this.betTypes.forEach(betType => {
            if (betType.isChecked) {
                value.push(betType.id);
            }
        });

        return value;
    }

    getValueCheckedBetTypes(): string[] {
        const value: Array<string> = [];
        this.betTypes.forEach(betType => {
            if (betType.isChecked) {
                value.push(betType.value);
            }
        });

        return value;
    }

    hasBetType(id: number): boolean {
        const index = this.betTypes.findIndex(x => x.id.toString() === id.toString());
        return index > -1;
    }
}

export class GroupBetTypesModel {
    groupBetTypes: GroupBetType[];
    isChecked: boolean;
    result: Result;

    constructor(groups: Array<GroupBetType>, isChecked: boolean) {
        this.isChecked = isChecked;
        this.groupBetTypes = [];
        groups.forEach(item => {
            const group = new GroupBetType(item.groupName, item.betTypes, isChecked);
            this.groupBetTypes.push(group);
        });
    }

    changeCheckedModelToGroup() {
        this.groupBetTypes.forEach(group => {
            group.isChecked = this.isChecked && group.isShow;
            group.changeCheckedGroupToBetType();
        });
    }

    changeCheckedGroupToModel() {
        let checkedAll = true;
        let hideAll = true;
        for (let i = 0; i < this.groupBetTypes.length && checkedAll; i++) {
            if (this.groupBetTypes[i].isShow) {
                checkedAll = this.groupBetTypes[i].isChecked;
            }
            if (hideAll) {
                hideAll = !this.groupBetTypes[i].isShow;
            }
        }

        this.isChecked = checkedAll && !hideAll;
    }

    getCheckedBetTypes(): number[] {
        let value: Array<number> = [];
        this.groupBetTypes.forEach(group => {
            value = value.concat(group.getCheckedBetTypes());
        });

        return value;
    }

    getValueCheckedBetTypes(): string {
        let value: Array<string> = [];
        this.groupBetTypes.forEach(group => {
            value = value.concat(group.getValueCheckedBetTypes());
        });

        return value.join(',');
    }

    getAllBetType(): BetType[] {
        let value = [];
        this.groupBetTypes.forEach(group => {
            value = value.concat(group.betTypes);
        });

        return value;
    }

    hasBetType(id: number): boolean {
        let result = false;
        this.groupBetTypes.forEach(group => {
            if (group.hasBetType(id)) {
                result = true;
            }
        });

        return result;
    }
}

export class GetBetTypesQuery {
    mode: number;
    matchId: number;
}