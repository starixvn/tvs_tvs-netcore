import { OperatorInfo } from "../../../add-request-new/component/others/others.model";

export class AddRemarkModel {
  remarkId?: number;
  matchId: number;
  isOpen = false;
  isCheckedVar: boolean;
  isHighLightVarCheck: boolean;
  mistakenBy: string;
  decidedBy: string;
  performedBy: string;
  iptv: string;
  provider: string;
  source: string;
  remark: string;
  message: string;
  description: string;
  actionId: string;
  operatorsList: OperatorInfo[];
  isTest: boolean;
}