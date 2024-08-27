export class ConfirmDangerAcceptedModel {
  isOpenDialog: boolean;
  issueTypeName: string;
  subIssueTypeName: string;
  requestId: number;
  requestedBy: string;
  isHasSettledTicket: boolean;
  isHasWarningEvent: boolean;
  isHasWarningEditTakeNoteRequest: boolean;
  isEditingByAnotherUser: boolean;
  warningRelatedEvents: string[] = [];
  isHasWarningRangeTime: boolean;
}