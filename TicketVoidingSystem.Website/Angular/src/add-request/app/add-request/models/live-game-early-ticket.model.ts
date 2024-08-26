import { TicketsModel } from '../pool-house-ticket/tickets/tickets.model';
import { BetTypeAddRequest } from '../../../../utility/components/advanced-mode-add-request/group-bet-types/group-bet-types.model';
import { MultipleSelection } from '../../../../utility/components/multiple-selection/multiple-selection';

export class LogInfoTicketsQuery {
    logInfoTicketsJson: string;
    issueTypeId: number;
}

export class AffectedTicketsModel {
    isOpen: boolean;
    tickets: TicketsModel;
    groupBetTypesCount: string[];
    isShowDetailBetTypeCount: boolean;
    checkedBetTypes?: BetTypeAddRequest[];
    filterBetTypes?: MultipleSelection;
}