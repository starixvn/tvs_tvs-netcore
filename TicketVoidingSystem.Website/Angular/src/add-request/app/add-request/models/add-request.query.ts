import { NotParticipateGetLogInfoQuery } from '../event-not-participate/models/get-log-info.query';
import { ReducedOverGetLogInfoQuery } from '../event-reduced-over/models/get-log-info.query';
import { WrongHdpGetLogInfoQuery } from '../event-wrong-hdp/models/get-log-info.query';
import { WrongOddsGetLogInfoQuery } from '../event-wrong-odds/models/get-log-info.query';
import { WrongOuGetLogInfoQuery } from '../event-wrong-ou/models/get-log-info.query';
import { WrongScoreGetLogInfoQuery } from '../event-wrong-score/event-wrong-score.model';
import { OperatorInfo } from '../others/others.model';
import { AbnormalAccountModel } from './abnormal-account.model';
import { DuplicateTicketsModel } from './event-duplicate-tickets.model';
import { NotParticipateModel } from './event-not-participate.model';
import { RedCardGetLogInfoQuery, RedCardModel } from './event-red-card.model';
import { ReducedOverModel } from './event-reduced-over.model';
import { WrongHdpModel } from './event-wrong-hdp.model';
import { WrongOddsModel } from './event-wrong-odds.model';
import { WrongOuModel } from './event-wrong-ou.model';
import { WrongScoreModel } from './event-wrong-score.model';

export class AddRequestQuery {
  guid: string;
  sportType: number;
  subIssueTypeId: string;
  actionId: string;
  provider: string;
  source: string;
  decidedBy: string;
  mistakenBy: string;
  remark: string;
  isTest: boolean;
  issueTypeId: string;
  operatorsList: OperatorInfo[];
  isVoided: boolean;

  requestId?: number;
  matchId: number;
  kickOffTime: string;
  filterBy?: number;
  transIds: string;
  isHasUusTickets: boolean;
  isConfirmCalculator: boolean;

  wrongScoreInfo: WrongScoreModel[];
  dangerAcceptedInfo: RedCardModel[];
  redCardInfo: RedCardModel[];
  wrongHdpInfo: WrongHdpModel[];
  wrong1stHdpInfo: WrongHdpModel[];
  wrongOuInfo: WrongOuModel[];
  wrong1stOuInfo: WrongOuModel[];
  wrongOddsInfo: WrongOddsModel[];
  reducedOverInfo: ReducedOverModel[];
  notParticipateInfo: NotParticipateModel[];
  abnormalAccountInfo: AbnormalAccountModel;
  duplicateTicketsInfo: DuplicateTicketsModel;

  transInfoJson: string;
  unMarkTransIds: string;
  markTransIds: string;
  removeTransIds: string;

  subIssueTypeName: string;
  listBetteam: string;
  listBettype: string;
}

export interface CheckValidTransIdQuery {
  matchId: number;
  fromTransId: number;
  toTransId: number;
}

export class GetLogInfoQuery {
  matchId?: number;
  requestId?: number;
  actionId?: number;
  subIssueTypeId?: number;
  issueTypeId?: number;
  isShowLogOnly?: boolean;
  kickOffTime?: string;
  wrongScoreModels?: WrongScoreGetLogInfoQuery[];
  dangerAcceptedModels?: RedCardGetLogInfoQuery[];
  redCardModels?: RedCardGetLogInfoQuery[];
  wrongHdpModels?: WrongHdpGetLogInfoQuery[];
  wrong1stHdpModels?: WrongHdpGetLogInfoQuery[];
  wrongOuModels?: WrongOuGetLogInfoQuery[];
  wrong1stOuModels?: WrongOuGetLogInfoQuery[];
  wrongOddsModels?: WrongOddsGetLogInfoQuery[];
  reducedOverModels?: ReducedOverGetLogInfoQuery[];
  notParticipateModels?: NotParticipateGetLogInfoQuery[];
}
