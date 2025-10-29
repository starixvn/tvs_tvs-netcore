
import { OperatorInfo } from '../component/others/others.model';
import { EarlyKickOffGetLogInfoQuery } from '../events/early-kick-off/app/event-early-kick-off/models/get-log-info.query';
import { NotParticipateGetLogInfoQuery } from '../events/not-participate/app/event-not-participate/models/get-log-info.query';
import { OtherIssuesGetLogInfoQuery } from '../events/other-issues/app/event-other-issues/models/get-log-info.query';
import { ReducedOverGetLogInfoQuery } from '../events/reduced-over/app/event-reduced-over/models/get-log-info.query';
import { TechnicalErrorGetLogInfoQuery } from '../events/technical-error/app/event-technical-error/models/get-log-info.query';
import { WrongHdpGetLogInfoQuery } from '../events/wrong-hdp/app/event-wrong-hdp/models/get-log-info.query';
import { WrongMarketOfferedGetLogInfoQuery } from '../events/wrong-market-offered/app/event-wrong-market-offered/models/get-log-info.query';
import { WrongOddsSportsBookGetLogInfoQuery } from '../events/wrong-odds-sports-book/app/event-wrong-odds-sports-book/models/get-log-info.query';
import { WrongOddsGetLogInfoQuery } from '../events/wrong-odds/app/event-wrong-odds/models/get-log-info.query';
import { WrongOfferedNameGetLogInfoQuery } from '../events/wrong-offered-name/app/event-wrong-offered-name/models/get-log-info.query';
import { WrongOuGetLogInfoQuery } from '../events/wrong-ou/app/event-wrong-ou/models/get-log-info.query';
import { WrongScoreGetLogInfoQuery } from '../events/wrong-score/app/event-wrong-score/event-wrong-score.model';
import { AbnormalAccountModel } from './abnormal-account.model';
import { AbnormalBetModel } from './abnormal-bet.model';
import { DuplicateTicketsModel } from './event-duplicate-tickets.model';
import { EarlyKickOffModel } from './event-eko.model';
import { NotParticipateModel } from './event-not-participate.model';
import { OtherIssuesModel } from './event-other-issues.model';
import { RedCardGetLogInfoQuery, RedCardModel } from './event-red-card.model';
import { ReducedOverModel } from './event-reduced-over.model';
import { TechnicalErrorModel } from './event-technical-error.model';
import { WrongHdpModel } from './event-wrong-hdp.model';
import { WrongMarketOfferedModel } from './event-wrong-market-offered.model';
import { WrongOddsSportsBookModel } from './event-wrong-odds-sports-book.model';
import { WrongOddsModel } from './event-wrong-odds.model';
import { WrongOfferedNameModel } from './event-wrong-offered-name.model';
import { WrongOuModel } from './event-wrong-ou.model';
import { WrongScoreModel } from './event-wrong-score.model';
import { RecoverTicketModel } from './recover-ticket.model';

export class AddRequestQuery {
  guid: string;
  sessionTime: number;
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
  wrongMarketOfferedInfo: WrongMarketOfferedModel[];
  wrongOddsSportsBookInfo: WrongOddsSportsBookModel;
  wrongOfferedNameInfo: WrongOfferedNameModel;
  otherIssuesInfo: OtherIssuesModel;
  technicalErrorInfo: TechnicalErrorModel;
  matchEarlyCompletedInfo: OtherIssuesModel;
  secondTeamBattingInfo: TechnicalErrorModel;

  transInfoJson: string;
  unMarkTransIds: string;
  markTransIds: string;
  removeTransIds: string;

  siteDBDownInfoJson?: string;
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
  wrongMarketOfferedModels?: WrongMarketOfferedGetLogInfoQuery[];
  wrongOddsSportsBookModel?: WrongOddsSportsBookGetLogInfoQuery;
  wrongOfferedNameModel?: WrongOfferedNameGetLogInfoQuery;
  otherIssuesModel?: OtherIssuesGetLogInfoQuery;
  technicalErrorModel?: TechnicalErrorGetLogInfoQuery;
  matchEarlyCompletedModel?: OtherIssuesGetLogInfoQuery;
  secondTeamBattingModel?: TechnicalErrorGetLogInfoQuery;
}
