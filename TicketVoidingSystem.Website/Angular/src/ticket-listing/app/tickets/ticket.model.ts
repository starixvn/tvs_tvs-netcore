import { PagingModel } from '../../../utility/components/paging/paging.model';
import { SummaryItem } from '../summary/summary.model';

export class TicketModel {
  betId: string;
  transDate: string;
  member: string;
  choice: string;
  odds: string;
  ballSequence: number;
  stake: string;
  winLoss: string;
  currency: string;
  betType: string;
  status: string;
  secondAcceptFlag: string;
  isMarked: boolean;
  subTransId: string;
  isHybrid: boolean;
}

export class TicketsModel {
  title: string;
  totalItems: number;
  pagingModel: PagingModel;
  tickets: TicketModel[];
  item: SummaryItem;
}
