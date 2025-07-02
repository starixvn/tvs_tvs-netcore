import { LogInfoDetail } from "../../../../utility/models/log-info-detail.model";
import { ValidationMessage } from "./get-log-info.model";

export class WrongScoreModel {
    scoreId: number;
    isActive: boolean;
    wrongScore: string;
    subIssueTypeId: number;
    filterFromTransTime: string;
    filterToTransTime: string;
    logInfoDetail?: LogInfoDetail;
    messageValidationLogInfo?: ValidationMessage[];
    actualScore?: string;
    matchId?: number;
    isChecked: boolean;
    eventDate?: Date;
    voidFromTime?: string;
    voidToTime?: string;    
    aaTime?: number;
    paTime?: number;
    saTime?: number;
    filterBy: number;
    isCheckedVar?: boolean;
    tvDetectionValue: number;
    serviceAcceptTime: string;
    actualTime: string;
    minuteOffset: string;
    secondOffset: string;
    sportType: number;
    isMainMatch: boolean;
}
