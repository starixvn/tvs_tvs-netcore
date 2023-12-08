export class ConfirmAbnormalAccountModel {
  isOpenDialog: boolean;
  isAutoVoid: boolean;
  isHasWarningTicketsExistedInRequest: boolean;
  isHasWarningEditTakeNoteRequest: boolean;
  isEditingByAnotherUser: boolean;
  requestId: number;
  requestedBy: string;
  numberOfTicketsExistedInRequest: number;
}