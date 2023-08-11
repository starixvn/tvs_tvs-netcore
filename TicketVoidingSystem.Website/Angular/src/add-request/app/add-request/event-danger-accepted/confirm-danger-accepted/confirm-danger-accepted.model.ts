export class ConfirmDangerAcceptedModel {
  isOpenDialog: boolean;
  issueTypeName: string;
  subIssueTypeName: string;
  requestId: number;
  requestedBy: string;
  isHasWarningSettledTicket: boolean;
  isHasWarningEvent: boolean;
  isHasWarningEditTakeNoteRequest: boolean;
  isEditingByAnotherUser: boolean;
  warningRelatedEvents: string[] = [];
}