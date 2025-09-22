import { CheckboxType } from '../../../../../../utility/constants/config';

export class ConfirmAbnormalBetModel {
    isOpenDialog: boolean;
    isHasWarningForAbnormalBet: boolean;
    isHasWarningEditTakeNoteRequest: boolean;
    isHasWarningRemovedTickets: boolean;
    isEditingByAnotherUser: boolean;
    transIds: string;
    requestId: number;
    requestedBy: string;
    ticketsOfVIPCustomer: string;
    settledTickets: string;
    ticketsOfCustomerClass201: string;
    ticketsOfCustomerClass4K: string;
    isHasAffectedTicketSiteDBDown: boolean;
    ticketsOfCreditCashService?: string;
    ticketsOfSiteDBDown?: string;

    issueTypeName: string;
    subIssueTypeName: string;
    actionName: string;

    checkboxState: Record<string, boolean> = {
        [CheckboxType.CUSTOMER_CLASS_201]: false,
        [CheckboxType.CUSTOMER_CLASS_4K]: false,
        [CheckboxType.CREDIT_CASH_SERVICE]: false,
    };

    checkboxes: Record<string, string> = {
        [CheckboxType.CUSTOMER_CLASS_201]: '',
        [CheckboxType.CUSTOMER_CLASS_4K]: '',
        [CheckboxType.CREDIT_CASH_SERVICE]: '',
    };
}
