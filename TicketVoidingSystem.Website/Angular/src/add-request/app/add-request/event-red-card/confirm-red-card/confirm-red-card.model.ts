export class ConfirmRedCardModel {
  isOpenDialog: boolean;
  issueTypeName: string;
  subIssueTypeName: string;
  isHasSettledTicket: boolean;
  isHasWarningForRedCard: boolean;
  isHasWarningEditTakeNoteRequest: boolean;
  isEditingByAnotherUser: boolean;
  requestId: number;
  userId: number;
  requestedBy: string;
  isHasWarningEvent: boolean;
  warningRelatedEvents: string[] = [];
}