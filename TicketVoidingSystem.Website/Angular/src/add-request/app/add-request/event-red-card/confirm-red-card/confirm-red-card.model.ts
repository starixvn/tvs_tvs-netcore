export class ConfirmRedCardModel {
  isOpenDialog: boolean;
  issueTypeName: string;
  subIssueTypeName: string;
  isHasWarningSettledTicket: boolean;
  isHasWarningForRedCard: boolean;
  isHasWarningEditTakeNoteRequest: boolean;
  isEditingByAnotherUser: boolean;
  requestId: number;
  userId: number;
  requestedBy: string;
}