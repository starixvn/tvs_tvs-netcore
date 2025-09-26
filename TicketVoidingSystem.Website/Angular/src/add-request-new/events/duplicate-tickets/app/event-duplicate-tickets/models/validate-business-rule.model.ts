import { TransInfoAddRequestModel } from "../../../../../models/trans-info-add-request.model";
import { ValidationDuplicateTickets } from "./check-duplicate-tickets.model";

export class ValidationBusinessRuleOutput {
  isValid: boolean;
  validationDuplicateTickets: ValidationDuplicateTickets;
  transInfoAddRequestModel: TransInfoAddRequestModel;
}