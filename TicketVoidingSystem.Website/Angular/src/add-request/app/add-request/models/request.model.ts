import { Message } from '../../../../utility/components/template-message/messages/message';
import { RedCardModel } from '../models/event-red-card.model';
import { WrongHdpModel } from '../models/event-wrong-hdp.model';
import { WrongOuModel } from '../models/event-wrong-ou.model';
import { WrongScoreModel } from '../models/event-wrong-score.model';
import { OperatorInfo } from '../others/others.model';

export class RequestDetailModel {
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
  lastModifiedDate: Date;
  request: RequestDetailModel;
  event: RequestEventModel;
  wrongScoreModels: WrongScoreModel[];
  dangerAcceptedModels: RedCardModel[];
  redCardModels: RedCardModel[];
  wrongHdpModels: WrongHdpModel[];
  wrongOuModels: WrongOuModel[];
  messages: Message[];
}
