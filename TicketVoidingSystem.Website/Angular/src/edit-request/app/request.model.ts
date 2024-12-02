import { AbnormalAccountModel } from '../../add-request/app/add-request/models/abnormal-account.model';
import { AbnormalBetModel } from '../../add-request/app/add-request/models/abnormal-bet.model';
import { DuplicateTicketsModel } from '../../add-request/app/add-request/models/event-duplicate-tickets.model';
import { EarlyKickOffModel } from '../../add-request/app/add-request/models/event-eko.model';
import { NotParticipateModel } from '../../add-request/app/add-request/models/event-not-participate.model';
import { OtherIssuesModel } from '../../add-request/app/add-request/models/event-other-issues.model';
import { RedCardModel } from '../../add-request/app/add-request/models/event-red-card.model';
import { ReducedOverModel } from '../../add-request/app/add-request/models/event-reduced-over.model';
import { WrongHdpModel } from '../../add-request/app/add-request/models/event-wrong-hdp.model';
import { WrongMarketOfferedModel } from '../../add-request/app/add-request/models/event-wrong-market-offered.model';
import { WrongOddsSportsBookModel } from '../../add-request/app/add-request/models/event-wrong-odds-sports-book.model';
import { WrongOddsModel } from '../../add-request/app/add-request/models/event-wrong-odds.model';
import { WrongOfferedNameModel } from '../../add-request/app/add-request/models/event-wrong-offered-name.model';
import { WrongOuModel } from '../../add-request/app/add-request/models/event-wrong-ou.model';
import { WrongScoreModel } from '../../add-request/app/add-request/models/event-wrong-score.model';
import { RecoverTicketModel } from '../../add-request/app/add-request/models/recover-ticket.model';
import { OperatorInfo } from '../../add-request/app/add-request/others/others.model';

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
  wrongMarketOfferedModel?: WrongMarketOfferedModel;
  wrongOddsSportsBookModel?: WrongOddsSportsBookModel;
  wrongOfferedNameModel?: WrongOfferedNameModel;
  otherIssuesModel?: OtherIssuesModel;
}

export class PlayerName {
  playerNamesEnglish: string;
  playerNamesChineseTraditional: string;
  playerNamesChineseSimplified: string;
}