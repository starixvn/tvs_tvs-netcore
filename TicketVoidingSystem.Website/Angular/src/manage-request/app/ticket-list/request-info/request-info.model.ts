
export class GeneralInfo {
    voidedTimeString: string;
    kickOffTimeString?: string;
    leagueName?: string;
    matchEvent?: string;
    totalTicketsProcessed: number;
    totalCancelCashOutProcessed: number;
    decidedBy: string;
    requestedBy: string;
    negativeBalanceUsers: string;
    voidingHistoryIds: string;
    licenseeNames: string;
    cancelCashOutLicenseesName: string;
    generalBetTypeCombinations: string;
    scoreResult: string;
    reason: string;
    singleTransIds: string;
    recoveredTimeString: string;
}

export class GroupUserVoidMessage {
    matchId: number;
    voidedBy: string;
    messages: UserVoidMessage[];
}

export class UserVoidMessage {
    voidedBy: string;
    contentEnglish: string;
    contentChineseSimplified: string;
}

export class GeneralInfoViewModel {
    constructor() {
        this.generalInfoModel = new GeneralInfo();
        this.userVoidMessages = [];
        this.succeedEmails = [];
        this.failedEmails = [];
    }
    generalInfoModel: GeneralInfo;
    userVoidMessages: GroupUserVoidMessage[];
    succeedEmails: string[];
    failedEmails: string[];
}

export class TabInfoRequest {
    id: string;
    name: string;
}