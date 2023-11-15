export class ConfirmEarlyKickOffModel {
  isOpenDialog: boolean;
  requestId: number;
  requestedBy: string;
  isHasWarningEvent: boolean;
  isHasWarningEditTakeNoteRequest: boolean;
  isEditingByAnotherUser: boolean;
  warningRelatedEvents: string[] = [];
}