export class ConfirmAbnormalAccountModel {
  isOpenDialog: boolean;
  isHasWarningTicketsExistedInRequest: boolean;
  isHasWarningEditTakeNoteRequest: boolean;
  isEditingByAnotherUser: boolean;
  requestId: number;
  requestedBy: string;
  numberOfTicketsExistedInRequest: number;
}