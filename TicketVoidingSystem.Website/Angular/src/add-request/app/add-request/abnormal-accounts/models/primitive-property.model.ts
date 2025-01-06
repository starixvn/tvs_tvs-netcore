import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { PermissionAddRequest } from "../../models/permission-add-request.model";
import { TransInfoAddRequestModel } from "../../models/trans-info-add-request.model";
import { AccountWinlostModel } from "./account-winlost.model";

export class PrimitiveProperty {
  isBlockUsernames: boolean;
  isCancelValidate = false;
  isShowError = false;
  isBeingMoveBetDate: boolean;
  isInvalidTotalTicket: boolean;
  isShowAccountWinLost = false;
  transInfoAddRequestModel: TransInfoAddRequestModel;
  validAccountWinlostModels: AccountWinlostModel[] = [];
  permission: PermissionAddRequest;
  minDate: NgbDateStruct;
  numberOfTicketsExistedInRequest: number;
}