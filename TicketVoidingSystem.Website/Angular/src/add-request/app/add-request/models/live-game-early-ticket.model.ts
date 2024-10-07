import { BetTypeAddRequest } from '../../../../utility/components/advanced-mode-add-request/group-bet-types/group-bet-types.model';
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
    checkedBetTypes?: BetTypeAddRequest[];
}