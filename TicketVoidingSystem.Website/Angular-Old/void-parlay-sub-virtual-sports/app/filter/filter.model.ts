import { GetTicketsQuery } from '../models/query.model';
import { MatchViewModel } from '../../../internal/components/match-detail/match.viewmodel';

export class FilterEvent {
    getTicketsQuery: GetTicketsQuery;
    matchViewModel: MatchViewModel;
}