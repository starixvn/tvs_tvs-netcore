export class ConfirmWrongScoreModel {
  issueTypeName: string;
  subIssueTypeName: string;
  isOpenDialog: boolean;
  isHasWarningSettledTicket: boolean;
  isHasWarningForWrongScore: boolean;
  isHasWarningEditTakeNoteRequest: boolean;
  isEditingByAnotherUser: boolean;
  requestId: number;
  requestedBy: string;
  warningExcludedScores: string[];
}
