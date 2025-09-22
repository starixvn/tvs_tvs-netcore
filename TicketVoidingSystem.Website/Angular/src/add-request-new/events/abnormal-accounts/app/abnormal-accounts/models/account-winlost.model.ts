export class AccountWinlostModel {
  custId: number;
  username: string;
  givenCredit: number;
  adjustVoidLimit: number;
  currentWinning: number;
  currentLosing: number;
  estimateVoidAmount: number;
  estimateVoidAmountUnEditableTickets: number;
  winLostAfterVoid: number;
  isHighlight: boolean;
  adjustVoidLimitString: string;
  isShowInput: boolean;
  isEditedTicket: boolean;
  isCanEditTicket: boolean;
  isShowOnTable: boolean;
  transInfoAccountJson: string;
  oldAdjustVoidLimit: number;
}