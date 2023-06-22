import { TransInfoAddRequestModel } from "../models/trans-info-add-request.model";

export class PrimitiveProperty {
  filterBy: number;
  isBlock = false;  
  actualScore: string;
  isShowActualScore: boolean;
  transInfoAddRequestModel: TransInfoAddRequestModel;
  isCheckedVar?: boolean;
  isHighLightVarCheck?: boolean;
}

export interface GetLogInfoQuery {
  requestId: number;
  matchId: number;
  actionId: number;
  issueTypeId:  number;
  subIssueTypeId:  number;
  wrongScoreModels: WrongScoreGetLogInfoQuery[];
  isShowLogOnly: boolean;
}

export class WrongScoreGetLogInfoQuery {
  scoreId: number;
  matchId: number;
  wrongScore: string;
  filterFromTransTime: string;
  filterToTransTime: string;
  subIssueTypeId: number;
  filterBy: number;
  aaTime?: number;
  paTime?: number;
  saTime?: number;
}

