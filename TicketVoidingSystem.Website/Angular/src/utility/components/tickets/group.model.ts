import '../../extensions/string.extension';
import { TicketModel } from './ticket.model';

export class GroupModel {
    name: string;
    isCheckAll: boolean;
    isExpanded: boolean;
    isDisabled: boolean;
    tickets: Array<TicketModel>;
    disabledTickets: Array<string>;
}
