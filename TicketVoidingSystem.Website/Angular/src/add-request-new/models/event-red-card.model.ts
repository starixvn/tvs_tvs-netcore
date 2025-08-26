import { LogInfoDetail } from "../../utility/models/log-info-detail.model";

export class RedCardModel {
    matchId: number;
    matchCode?: string;
    matchEvent: string;
    leagueName: string;
    name?: string;
    isMainMatch: boolean;
    isChecked?: boolean;
    eventDate?: Date;
    filterBy: number;
    filterFromTransTime: string;
    filterToTransTime: string;
    isCheckedVar?: boolean;

    voidFromTime?: string;
    voidToTime?: string;
    aaTime?: number;
    paTime?: number;
    saTime?: number;

    subIssueTypeId: number;
    subIssueTypeName: string;
    matchType: number;
    logInfoDetail: LogInfoDetail;
    sportType: number;

    tvDetectionValue: number;
    serviceAcceptTime: string;
    actualTime: string;
    minuteOffset: string;
    secondOffset: string;
}

export class RedCardGetLogInfoQuery {
    matchId: number;
    filterBy: number;
    filterFromTransTime: string;
    filterToTransTime: string;
    subIssueTypeId: number;
    aaTime?: number;
    paTime?: number;
    saTime?: number;
}

