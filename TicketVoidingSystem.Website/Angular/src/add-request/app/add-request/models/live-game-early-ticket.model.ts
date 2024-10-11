import { GroupBetTypeCountModel } from './get-log-info.model';

export class LogInfoTicketsQuery {
    logInfoTicketsJson: string;
    issueTypeId: number;
}

export class AffectedTicketsModel {
    isOpen: boolean;
    issueTypeId: number;
    logInfoTicketsJson: string;
    groupBetTypesCount: GroupBetTypeCountModel[];
    isShowDetailBetTypeCount: boolean;
}