export class PrimaryBetType {
    static readonly ROOT = {
        '1': '1,1303', '2': '2,1305,157', '3': '3,1306', '20': '20,1301', '153': '153,1308', '154': '154,1311', '155': '155,1316',
        '156': '156,1312', '144': '144,163', '159': '159,406', '151': '151,410', '161': '161,407', '171': '171,408', '162': '162,409',
        '191': '191,411', '4': '4,413', '30': '30,414', '172': '172,415', '152': '152,416', '188': '188,427', '184': '184,428',
        '177': '177,430', '186': '186,431', '185': '185,432', '146': '146,433', '189': '189,434', '190': '190,435', '147': '147,436',
        '148': '148,437', '133': '133,438', '134': '134,439', '149': '149,440', '150': '150,441', '140': '140,442', '141': '141,443',
        '142': '142,444', '17': '17,183', '18': '18,178', '401': '401,461', '402': '402,462', '403': '403,463', '404': '404,464',
        '22': '22,160', '206': '206,488', '194': '194,470', '203': '203,471', '202': '202,474', '207': '207,489', '208': '208,491',
        '209': '209,492', '473': '473,11,199', '164': '396,164', '166': '399,166', '615': '615,651', '616': '616,652'
    };
}

export class NotSupportBetTypes {
    static readonly IGNORE = 11;
    static readonly ALTERNATIVE = 199;
}

const ExactHomeTeamGoals = 161;
const ExactAwayTeamGoals = 162;
const HomeTeamOverUnder = 401;
const AwayTeamOverUnder = 402;
const _1HHomeTeamOverUnder = 403;
const _1HAwayTeamOverUnder = 404;
const HomeTeamOverUnderCorners = 482;
const _1HHomeTeamOverUnderCorners = 484;
const AwayTeamOverUnderCorners = 483;
const _1HAwayTeamOverUnderCorners = 485;
const Handicap = 1;
const OverUnder = 3;
const _1HHandicap = 7;
const _1HOverUnder = 8;

export class HighlightBetTypes {
    static readonly RED = [ExactHomeTeamGoals, ExactAwayTeamGoals, HomeTeamOverUnder, AwayTeamOverUnder,
        _1HHomeTeamOverUnder, _1HAwayTeamOverUnder, HomeTeamOverUnderCorners, _1HHomeTeamOverUnderCorners,
        AwayTeamOverUnderCorners, _1HAwayTeamOverUnderCorners];
    static readonly BLUE = [Handicap, OverUnder, _1HHandicap, _1HOverUnder];
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
    redHighlight: boolean;
    blueHighlight: boolean;

    constructor(id: number, name: string, liveIndicator: boolean, type: number, isChecked: boolean) {
        this.id = id === NotSupportBetTypes.IGNORE ? NotSupportBetTypes.ALTERNATIVE : id;
        this.name = name;
        this.liveIndicator = liveIndicator;
        this.type = type;
        this.isChecked = isChecked;
        this.value = PrimaryBetType.ROOT[this.id] === undefined ? this.id.toString() : PrimaryBetType.ROOT[this.id];
        this.redHighlight = HighlightBetTypes.RED.indexOf(id) > -1;
        this.blueHighlight = HighlightBetTypes.BLUE.indexOf(id) > -1;
    }
}

export class GroupBetType {
    groupName: string;
    betTypes: BetType[] = [];
    isChecked: boolean = false;
    isShow: boolean;
}

export class GroupBetTypesModel {
    groupBetTypes: GroupBetType[] = [];
    isChecked: boolean = false;
    result: Result;
}

export class GetBetTypesQuery {
    mode: number;
    matchId: number;
    betTypes?: string;
    timeRanges?: TimeRangeModel[];
    isGetCancelCashOut?: boolean;
}

export class TimeRangeModel {
    fromDate: string;
    toDate: string;
}