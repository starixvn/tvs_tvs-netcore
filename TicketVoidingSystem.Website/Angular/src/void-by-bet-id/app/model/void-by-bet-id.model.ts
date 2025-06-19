import { BetID } from "../../../utility/models/bet-id.model";
import { MatchModel } from "../../../utility/models/match.model";
import { Message } from "../../../utility/components/template-message/messages/message";

export class PrimitiveProperty {
    isBlockUI = false;
    isShowRemoveInvalid = false;
    isShowMatch = false;
    isShowMessages = false;
    isShowReason = false;
    isShowTickets = false;
}

export class VoidTicketsRequest {
    tickets: BetID[];
    transIdCrickets: BetID[];
    password: string;
    username: string;
    reason: string;
    reasonSC: string;
    message?: Message;
    guid: string;
    match: MatchModel;
    abnormalBetType: number;
    issueTypeId: number;
    subIssueTypeId: number;
    subIssueTypeName: string;
    subIssueTypeNameCS: string;
}