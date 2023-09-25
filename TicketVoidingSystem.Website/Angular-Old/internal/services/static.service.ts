import { FunctionConst } from "../../internal/shared/config";

export class StaticService {
  static checkHandlingCashOutAsUnSettledTicketByFunction(functionId: number): boolean {
    return functionId === FunctionConst.VOID_BY_CURRENCY || functionId === FunctionConst.VOID_EKO_BET;
  }
}