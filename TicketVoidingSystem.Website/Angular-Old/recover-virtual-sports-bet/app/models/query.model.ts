import { BetId } from "../../../internal/models/bet-id.model";

export class Query {
    ticketType: string;
    type: string;
    matchId: number;
    tickets?: BetId[];
    transIds?: string;
}