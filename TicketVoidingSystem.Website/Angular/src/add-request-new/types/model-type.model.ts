import { RedCardModel } from "../models/event-red-card.model";
import { TechnicalErrorModel } from "../models/event-technical-error.model";
import { EventTicket14Model } from "../models/event-ticket-14.model";
import { WrongHdpModel } from "../models/event-wrong-hdp.model";
import { WrongOddsSportsBookModel } from "../models/event-wrong-odds-sports-book.model";
import { WrongOddsModel } from "../models/event-wrong-odds.model";
import { WrongOuModel } from "../models/event-wrong-ou.model";
import { WrongScoreModel } from "../models/event-wrong-score.model";

export type ModelType =
  | WrongHdpModel[]
  | WrongScoreModel[]
  | RedCardModel[]
  | TechnicalErrorModel
  | WrongOddsModel[]
  | WrongOuModel[]
  | WrongOddsSportsBookModel
  | EventTicket14Model;