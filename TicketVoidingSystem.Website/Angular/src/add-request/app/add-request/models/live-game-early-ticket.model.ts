import { TicketsModel } from '../pool-house-ticket/tickets/tickets.model';
import { BetTypeAddRequest } from '../../../../utility/components/advanced-mode-add-request/group-bet-types/group-bet-types.model';
import { MultipleSelection } from '../../../../utility/components/multiple-selection/multiple-selection';
import { GroupBetTypeCountModel } from './get-log-info.model';

export class LogInfoTicketsQuery {
    logInfoTicketsJson: string;
    issueTypeId: number;
}

export class AffectedTicketsModel {
    isOpen: boolean;
    tickets: TicketsModel;
    groupBetTypesCount: GroupBetTypeCountModel[];
    isShowDetailBetTypeCount: boolean;
    checkedBetTypes?: BetTypeAddRequest[];
    filterBetTypes?: MultipleSelection;
}