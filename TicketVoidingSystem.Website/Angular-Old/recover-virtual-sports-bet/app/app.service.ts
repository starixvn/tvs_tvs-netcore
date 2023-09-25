import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpRequestService } from '../../internal/services/http-request.service';
import { MatchViewModel, GetMatchQuery } from '../../internal/components/match-detail/match.viewmodel';

import { Query } from './models/query.model';
import { Result } from '../../internal/models/result';
import { TicketsModel } from './tickets/tickets.model';

@Injectable()

export class AppService {
    constructor(private httpRequestService: HttpRequestService) { }

    getMatchDetail(id: string): Observable<MatchViewModel> {
        const query: GetMatchQuery = { matchId: parseInt(id, 10), isMatch3rd: false };
        const url = 'Match/GetInfo';
        return this.httpRequestService.postJson(query, url);
    }

    getTickets(query: Query): Observable<TicketsModel> {
        const url = 'VirtualSports/RecoverVirtualSportsBet/GetTickets';
        return this.httpRequestService.postJson<TicketsModel>(query, url);
    }

    recoverTicket(query: Query): Observable<Array<Result>> {
        const url = 'VirtualSports/RecoverVirtualSportsBet/RecoverTickets';
        return this.httpRequestService.postJson(query, url);
    }
}