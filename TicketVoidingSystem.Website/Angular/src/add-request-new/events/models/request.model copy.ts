import { OperatorInfo } from "../../../add-request-new/component/others/others.model";
import { AbnormalAccountModel } from "./abnormal-account.model";
import { AbnormalBetModel } from "./abnormal-bet.model";
import { DuplicateTicketsModel } from "./event-duplicate-tickets.model";
import { EarlyKickOffModel } from "./event-eko.model";
import { NotParticipateModel } from "./event-not-participate.model";
import { OtherIssuesModel } from "./event-other-issues.model";
import { RedCardModel } from "./event-red-card.model";
import { ReducedOverModel } from "./event-reduced-over.model";
import { TechnicalErrorModel } from "./event-technical-error.model";
import { WrongHdpModel } from "./event-wrong-hdp.model";
import { WrongMarketOfferedModel } from "./event-wrong-market-offered.model";
import { WrongOddsSportsBookModel } from "./event-wrong-odds-sports-book.model";
import { WrongOddsModel } from "./event-wrong-odds.model";
import { WrongOfferedNameModel } from "./event-wrong-offered-name.model";
import { WrongOuModel } from "./event-wrong-ou.model";
import { WrongScoreModel } from "./event-wrong-score.model";
import { RecoverTicketModel } from "./recover-ticket.model";

export class RequestDetailModel {
  requestId: number;
  sportType: number;
  issueTypeId: number;
  actionId: number;
  mistakenBy: string;
  decidedBy: string;
  operators: OperatorInfo[];
  provider: string;
  source: string;
  remark: string;
  isTest: boolean;
  isVoided: boolean;
  requestedBy: string;
  userId: number;
  voidedBy: string;
  briefInfoNote: string;
}

export class RequestEventModel {
  matchId: number;
  subIssueTypeId: number;
  eventDate: Date;
  parentId: number;
  leagueId: number;
  homeId: number;
  awayId: number;
  kickOffTime: Date;
  transIds: string;
  htHomeScore?: number;
  htAwayScore?: number;
  finalHomeScore?: number;
  finalAwayScore?: number;
  liveScores?: string;
  globalShowTime: Date;
  filterFromTransTime?: Date;
  filterToTransTime?: Date;
  aaTime?: number;
  paTime? : number;
  saTime? : number;
  filterBy?: number;
  singleCount?: number;
  mainParlayCount?: number;
  minSingleTransId?: number;
  maxSingleTransId?: number;
  minMainParlayTransId?: number;
  maxMainParlayTransId?: number;
  voidFromTime: Date;
  voidToTime: Date;
  usernames?: string;
  productIds?: string;
  statusIds?: string;
  fromDate?: string;
  toDate?: string;
}

export class RequestDetailViewModel {
  requestId: number;
  playerNames: PlayerName[];
  lastModifiedDate: Date;
  request: RequestDetailModel;
  event?: RequestEventModel;
  wrongScoreModels?: WrongScoreModel[];
  duplicateTicketsModel?: DuplicateTicketsModel;
  dangerAcceptedModels?: RedCardModel[];
  redCardModels?: RedCardModel[];
  wrongHdpModels?: WrongHdpModel[];
  wrongOuModels?: WrongOuModel[];
  wrongOddsModels?: WrongOddsModel[];
  reducedOverModels?: ReducedOverModel[];
  notParticipateModels?: NotParticipateModel[];
  earlyKickOffModels?: EarlyKickOffModel[];
  abnormalAccountModel?: AbnormalAccountModel;
  recoverTicketModel?: RecoverTicketModel;
  abnormalBetModel?: AbnormalBetModel;
  wrongMarketOfferedModels?: WrongMarketOfferedModel[];
  wrongOddsSportsBookModel?: WrongOddsSportsBookModel;
  wrongOfferedNameModel?: WrongOfferedNameModel;
  otherIssuesModel?: OtherIssuesModel;
  technicalErrorModel?: TechnicalErrorModel;
}

export class PlayerName {
  playerNamesEnglish: string;
  playerNamesChineseTraditional: string;
  playerNamesChineseSimplified: string;
}