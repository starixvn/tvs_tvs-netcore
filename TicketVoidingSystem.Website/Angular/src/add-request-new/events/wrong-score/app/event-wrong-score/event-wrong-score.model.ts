import { InfoSiteDBDownModel } from '../../../../component/info-site-db-down/info-site-db-down.model';
import { TransInfoAddRequestModel } from '../../../../models/trans-info-add-request.model';

export class PrimitiveProperty {
  filterBy: number;
  isBlock = false;
  actualScore: string;
  isShowActualScore: boolean;
  transInfoAddRequestModel: TransInfoAddRequestModel;
  isCheckedVar?: boolean;
  isHighLightVarCheck?: boolean;
  isShowRelatedEvents: boolean;
  inputRelatedMatchId?: number;
  infoSiteDBDownModel: InfoSiteDBDownModel;
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

