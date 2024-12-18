export class ConfirmAddRequestModel {
  isOpen: boolean;
  requestId: number;
  userId: number;
  requestedBy: string;
  extraWarningModel: ExtraWarningModel;
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