export class ConfirmWrongScoreModel {
  issueTypeName: string;
  subIssueTypeName: string;
  isOpenDialog: boolean;
  isHasSettledTicket: boolean;
  isHasWarningForWrongScore: boolean;
  isHasWarningEditTakeNoteRequest: boolean;
  isEditingByAnotherUser: boolean;
  requestId: number;
  requestedBy: string;
  warningRelatedEvents: string[] = [];
  warningExcludedScores: string[];
  isHasAffectedTicketSiteDBDown: boolean;
  isMarkTicketSiteDbDown: boolean = true;
}
