import '../../extensions/string.extension';
import { GroupService } from './group.service';
import { TicketModel } from './ticket.model';

export class GroupModel {
    name: string;
    isCheckAll: boolean;
    isExpanded: boolean;
    isDisabled: boolean;
    tickets: Array<TicketModel>;
    disabledTickets: Array<string>;
    
    constructor(
        name: string,
        tickets: Array<TicketModel>) {
        GroupService.mapTickets(this, tickets);
        GroupService.setValue(this, name);
    }
}
