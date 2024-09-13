import { Result } from '../../../../utility/models/result';
import { FilterModel } from '../filter/filter.model';
import { OthersModel } from '../others/others.model';
import { AbnormalAccountModel } from './abnormal-account.model';
import { AbnormalBetModel } from './abnormal-bet.model';
import { EventDetailModel } from './event-detail.model';
import { DuplicateTicketsModel } from './event-duplicate-tickets.model';
import { EarlyKickOffModel } from './event-eko.model';
import { NotParticipateModel } from './event-not-participate.model';
import { RedCardModel } from './event-red-card.model';
import { ReducedOverModel } from './event-reduced-over.model';
import { EventTicket14Model } from './event-ticket-14.model';
import { WrongHdpModel } from './event-wrong-hdp.model';
import { WrongMarketOfferedModel } from './event-wrong-market-offered.model';
import { WrongOddsSportsBookModel } from './event-wrong-odds-sports-book.model';
import { WrongOddsModel } from './event-wrong-odds.model';
import { WrongOuModel } from './event-wrong-ou.model';
import { WrongScoreModel } from './event-wrong-score.model';
import { RecoverTicketModel } from './recover-ticket.model';

export class RequestModel { // Rename AddRequestModel or remove this
  filter: FilterModel;
  eventDetail: EventDetailModel;
  abnormalBetModel: AbnormalBetModel;
  abnormalAccountModel: AbnormalAccountModel;
  duplicateTicketsModel: DuplicateTicketsModel;
  redCardModel: RedCardModel[];
  wrongScoreModels: WrongScoreModel[];
  dangerAcceptedModels: RedCardModel[];
  eventTicket14Model: EventTicket14Model;
  wrongHdpModels : WrongHdpModel[];
  wrongOuModels: WrongOuModel[];
  wrongOddsModels: WrongOddsModel[];
  wrongOddsSportsBookModel: WrongOddsSportsBookModel;
  reducedOverModels: ReducedOverModel[];
  notParticipateModels: NotParticipateModel[];
  wrongMarketOfferedModel: WrongMarketOfferedModel;
  earlyKickOffModels: EarlyKickOffModel[];
  recoverTicketModel: RecoverTicketModel;
  others: OthersModel;

  constructor() {
    this.filter = new FilterModel();
    this.eventDetail = new EventDetailModel();
    this.abnormalBetModel = new AbnormalBetModel();
    this.abnormalAccountModel = new AbnormalAccountModel();
    this.eventTicket14Model = new EventTicket14Model();
    this.duplicateTicketsModel = new DuplicateTicketsModel();
    this.recoverTicketModel = new RecoverTicketModel();
    this.wrongScoreModels = [];
    this.dangerAcceptedModels = [];
    this.wrongHdpModels = [];
    this.wrongOuModels = [];
    this.wrongOddsModels = [];
    this.reducedOverModels = [];
    this.earlyKickOffModels = [];
    this.notParticipateModels = [];
    this.wrongMarketOfferedModel = new WrongMarketOfferedModel();
    this.wrongOddsSportsBookModel = new WrongOddsSportsBookModel();
    this.others = new OthersModel();
  }
}

export interface InitializedRequestModel {
  issueTypeId: string;
  subIssueTypeId: string;
  actionId: string;
  isTest: boolean;
  transIds: string;
}

export class CheckValidTransIdModel {
  isValidTransId: boolean;
}

export class AddRequestResultModel {
  matchId: string;
  requestId: number;

  logResults: Result<null>[];
  logStageName: string;
  markedTicketsSuccessful: number[];
}

