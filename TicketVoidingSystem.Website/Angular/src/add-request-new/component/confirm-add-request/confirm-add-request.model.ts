export class ConfirmAddRequestModel {
  isOpen: boolean;
  requestId: number;
  userId: number;
  requestedBy: string;
  checkBoxConfirmModel: CheckBoxConfirmModel;
  extraWarningModel: ExtraWarningModel;
  isHasSettledTicket: boolean;
  isHasWarningTicket: boolean;
  isHasWarningTakenNote: boolean;
  isEditingByAnotherUser: boolean;
  isShowSubIssueType: boolean;
  isHasAffectedTicketSiteDBDown: boolean;
  isMarkTicketSiteDbDown: boolean;
}

export class ExtraWarningModel {
  title: string;
  messages: string[];
}

export class CheckBoxConfirmModel {
  title: string;
  items: CheckBoxItem[];
}

export class CheckBoxItem {
  message: string;
  key: string;
  value: boolean;
  label: string;
}