import { CheckboxType } from '../../../../../../utility/constants/config';

export class ConfirmAbnormalAccountModel {
  isOpen: boolean;
  requestId: number;
  userId: number;
  requestedBy: string;
  isHasWarningAbnormalAccount: boolean;
  isHasWarningTakenNote: boolean;
  isEditingByAnotherUser: boolean;
  numberOfTicketsExistedInRequest: number;
  allUsernames: string;
  usernamesOfCreditCashService: string;
  isHasAffectedTicketSiteDBDown: boolean;
  isMarkTicketSiteDbDown: boolean;
  issueTypeName: string;
  subIssueTypeName: string;
  actionName: string;

  checkboxState: Record<string, boolean> = {
    [CheckboxType.CREDIT_CASH_SERVICE]: false,
};

checkboxes: Record<string, string> = {
    [CheckboxType.CREDIT_CASH_SERVICE]: '',
};
}
