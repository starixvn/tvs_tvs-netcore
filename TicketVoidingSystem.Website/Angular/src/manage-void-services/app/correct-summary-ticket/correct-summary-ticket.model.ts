import { Result } from "../../../utility/models/result";

export class UpdateSummaryStatusModel {
  isDisableButton: boolean;
  status: string;
  isFailed: boolean;

  constructor(isDisableButton: boolean) {
    this.isDisableButton = isDisableButton;
    this.status = '';
  }
}

export class InsertBetTicket14ResultModel extends Result<null> {
  invalidTransIds: string;
  balanceUpTransIds: string;
}
