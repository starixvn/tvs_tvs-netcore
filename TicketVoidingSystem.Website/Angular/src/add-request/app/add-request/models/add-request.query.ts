import { EarlyKickOffGetLogInfoQuery } from '../event-early-kick-off/models/get-log-info.query';
import { NotParticipateGetLogInfoQuery } from '../event-not-participate/models/get-log-info.query';
import { ReducedOverGetLogInfoQuery } from '../event-reduced-over/models/get-log-info.query';
import { WrongHdpGetLogInfoQuery } from '../event-wrong-hdp/models/get-log-info.query';
import { WrongMarketOfferedGetLogInfoQuery } from '../event-wrong-market-offered/models/get-log-info.query';
import { WrongOddsGetLogInfoQuery } from '../event-wrong-odds/models/get-log-info.query';
import { WrongOuGetLogInfoQuery } from '../event-wrong-ou/models/get-log-info.query';
import { WrongScoreGetLogInfoQuery } from '../event-wrong-score/event-wrong-score.model';
import { OperatorInfo } from '../others/others.model';
import { AbnormalAccountModel } from './abnormal-account.model';
import { AbnormalBetModel } from './abnormal-bet.model';
import { DuplicateTicketsModel } from './event-duplicate-tickets.model';
import { EarlyKickOffModel } from './event-eko.model';
import { NotParticipateModel } from './event-not-participate.model';
import { RedCardGetLogInfoQuery, RedCardModel } from './event-red-card.model';
import { ReducedOverModel } from './event-reduced-over.model';
import { WrongHdpModel } from './event-wrong-hdp.model';
import { WrongMarketOfferedModel } from './event-wrong-market-offered.model';
import { WrongOddsModel } from './event-wrong-odds.model';
import { WrongOuModel } from './event-wrong-ou.model';
import { WrongScoreModel } from './event-wrong-score.model';
import { RecoverTicketModel } from './recover-ticket.model';

export class AddRequestQuery {
  guid: string;
  sessionTime: number;
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
  earlyKickOffInfo: EarlyKickOffModel[];
  abnormalAccountInfo: AbnormalAccountModel;
  duplicateTicketsInfo: DuplicateTicketsModel;
  recoverTicketInfo: RecoverTicketModel;
  abnormalBetInfo: AbnormalBetModel;
  WrongMarketOfferedInfo: WrongMarketOfferedModel;

  transInfoJson: string;
  unMarkTransIds: string;
  markTransIds: string;
  removeTransIds: string;
}

export interface CheckValidTransIdQuery {
  matchId: number;
  fromTransId: number;
  toTransId: number;
}

export class GetLogInfoQuery {
  requestId?: number;
  actionId?: number;
  subIssueTypeId?: number;
  issueTypeId?: number;
  isShowLogOnly?: boolean;
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
  earlyKickOffModels?: EarlyKickOffGetLogInfoQuery[];
  wrongMarketOfferedModel?: WrongMarketOfferedGetLogInfoQuery;
}
