import { TicketsModel } from "../../../utility/components/tickets/tickets.model";

export class GetTicketsQuery {
    transIds = '';
    abnormalBetType = '0';
    includeMainParlay = false;
}

export class TicketsViewModel extends TicketsModel {
    invalidTransIds: string;
    movedTransIds: string;
    matchId: number;
    licenseesName: string;
}
