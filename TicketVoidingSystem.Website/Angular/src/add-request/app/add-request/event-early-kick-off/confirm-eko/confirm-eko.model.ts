export class ConfirmEarlyKickOffModel {
  isOpenDialog: boolean;
  issueTypeName: string;
  actionName: string;
  requestId: number;
  requestedBy: string;
  isHasWarningEvent: boolean;
  isHasWarningEditTakeNoteRequest: boolean;
  isEditingByAnotherUser: boolean;
  isHasSettledTicket: boolean;
  warningRelatedEvents: string[] = [];
}