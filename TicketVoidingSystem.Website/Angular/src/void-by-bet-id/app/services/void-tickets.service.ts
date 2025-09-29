import { inject, Injectable } from "@angular/core";
import { TicketsViewModel } from "../model/get-tickets.query";
import { Guid } from "guid-typescript";
import { ConfirmationComponent } from "../../../utility/components/confirmation/confirmation.component";
import { TemplateMessageComponent } from "../../../utility/components/template-message/template-message/template-message.component";
import { MatchModel } from "../../../utility/models/match.model";
import { FilterComponent } from "../filter/filter.component";
import { VoidTicketsRequest } from "../model/void-by-bet-id.model";
import { PasswordService } from '../../../utility/services/password.service';
import { SubIssueType } from "../../../utility/models/issue-type.model";
import { CheckingPermissionModel } from "../../../utility/models/checking-permission.model";
import { TicketsService } from "../../../utility/components/tickets/tickets.service";
import { GroupService } from "../../../utility/components/tickets/group.service";

interface VoidBetRequestParams {
    ticketsViewModel: TicketsViewModel;
    matchViewModel: MatchModel;
    filterComponent: FilterComponent;
    confirmationComponent: ConfirmationComponent;
    messagesComponent: TemplateMessageComponent;
    selectedSubIssueTypeId: number;
    subIssueTypes: SubIssueType[];
}

@Injectable()
export class VoidTicketsService {
    ISSUE_TYPE_ID_ABNORMAL_BET = 11;
    passwordService = inject(PasswordService);
    ticketsService = inject(TicketsService);
    groupService = inject(GroupService);
    
    createVoidBetRequest(params: VoidBetRequestParams): VoidTicketsRequest {
        const request = new VoidTicketsRequest();
        request.tickets = params.ticketsViewModel.groups.flatMap(group => this.groupService.getEnableTickets(group.tickets));
        request.transIdCrickets = params.ticketsViewModel.groups.flatMap(group => this.groupService.getTicketCricket(group.tickets));
        request.password = this.passwordService.hash(params.confirmationComponent.confirmation.userPassword);
        request.username = params.confirmationComponent.confirmation.userName;
        request.reason = params.confirmationComponent.confirmation.reason;
        request.reasonSC = params.confirmationComponent.confirmation.reasonSC;
        request.match = params.matchViewModel;
        request.abnormalBetType = params.filterComponent.abnormalBetType;
        request.message = params.messagesComponent.message;
        request.guid = `VoidByBetId-${Guid.create().toString()}`;
        this.mapSubIssueType(request, params.selectedSubIssueTypeId, params.subIssueTypes);

        return request;
    }

    mapSubIssueType(request: VoidTicketsRequest, selectedSubIssueTypeId: number, subIssueTypes: SubIssueType[]) {
        if (selectedSubIssueTypeId) {
            request.issueTypeId = this.ISSUE_TYPE_ID_ABNORMAL_BET;
            request.subIssueTypeId = selectedSubIssueTypeId;
            request.subIssueTypeName = subIssueTypes.find(x => x.subIssueTypeId === selectedSubIssueTypeId)?.subIssueTypeName;
            request.subIssueTypeNameCS = subIssueTypes.find(x => x.subIssueTypeId === selectedSubIssueTypeId)?.subIssueTypeNameCS;
        }
    }

    createCheckingPermissionModel(ticketsViewModel: TicketsViewModel, matchViewModel: MatchModel) {
        const checkingPermissionModel = new CheckingPermissionModel();
        checkingPermissionModel.setParam(this.ticketsService.getAllTicket(ticketsViewModel.groups), matchViewModel?.matchId,
            'void-by-bet-id-check-void-bet-permission', true, false, false);

        return checkingPermissionModel;
    }
}