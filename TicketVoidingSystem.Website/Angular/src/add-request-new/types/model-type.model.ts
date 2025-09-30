import { NotParticipateModel } from "../models/event-not-participate.model";
import { OtherIssuesModel } from "../models/event-other-issues.model";
import { RedCardModel } from "../models/event-red-card.model";
import { ReducedOverModel } from "../models/event-reduced-over.model";
import { TechnicalErrorModel } from "../models/event-technical-error.model";
import { EventTicket14Model } from "../models/event-ticket-14.model";
import { WrongHdpModel } from "../models/event-wrong-hdp.model";
import { WrongOddsSportsBookModel } from "../models/event-wrong-odds-sports-book.model";
import { WrongOddsModel } from "../models/event-wrong-odds.model";
import { WrongOuModel } from "../models/event-wrong-ou.model";
import { WrongScoreModel } from "../models/event-wrong-score.model";
import { EarlyKickOffModel } from "../models/event-eko.model";
import { WrongOfferedNameModel } from "../models/event-wrong-offered-name.model";
import { WrongMarketOfferedModel } from "../models/event-wrong-market-offered.model";
import { AbnormalAccountModel } from "../models/abnormal-account.model";
import { AbnormalBetModel } from "../models/abnormal-bet.model";
import { DuplicateTicketsModel } from "../models/event-duplicate-tickets.model";
import { RecoverTicketModel } from "../models/recover-ticket.model";

export type ModelType =
  | WrongHdpModel[]
  | WrongScoreModel[]
  | RedCardModel[]
  | TechnicalErrorModel
  | WrongOddsModel[]
  | WrongOuModel[]
  | WrongOddsSportsBookModel
  | EventTicket14Model
  | EarlyKickOffModel[]
  | WrongOfferedNameModel
  | WrongMarketOfferedModel[]
  | OtherIssuesModel
  | NotParticipateModel[]
  | ReducedOverModel[];
  | AbnormalAccountModel
  | AbnormalBetModel
  | DuplicateTicketsModel
  | RecoverTicketModel;