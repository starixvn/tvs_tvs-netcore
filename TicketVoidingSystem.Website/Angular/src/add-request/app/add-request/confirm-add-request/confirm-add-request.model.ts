export class ConfirmAddRequestModel {
  isOpen: boolean;
  issueTypeName: string;
  subIssueTypeName: string;
  requestId: number;
  userId: number;
  requestedBy: string;
  voidAction: string;
  warningRelatedEvents: string[] = [];
  isHasSettledTicket: boolean;
  isHasWarningTicket: boolean;
  isHasWarningTakenNote: boolean;
  isEditingByAnotherUser: boolean;
  isShowSubIssueType: boolean;
}

export class ExtraWarningModel {
  title: string;
  messages: string[];
}