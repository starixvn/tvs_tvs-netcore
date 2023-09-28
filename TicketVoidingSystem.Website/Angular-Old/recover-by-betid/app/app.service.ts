import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CheckNegativeBalanceQuery, NegativeBalance } from '../../internal/models/negative-balance';
import { Result } from '../../internal/models/result';
import { HttpRequestService } from '../../internal/services/http-request.service';
import { GetTicketsQuery, RecoverTicketsQuery } from './models/query.model';
import { TicketsModel } from './tickets/tickets.model';

@Injectable()

export class AppService {
    constructor(private httpRequestService: HttpRequestService) { }

    checkNegativeBalance(queryModel: CheckNegativeBalanceQuery): Observable<Array<NegativeBalance>> {
        const url = 'Tickets/CheckNegativeBalance';
        return this.httpRequestService.postJson(queryModel, url);
    }

    getTickets(query: GetTicketsQuery): Observable<TicketsModel> {
        const url = 'Home/RecoverByBetId/GetTickets';
        return this.httpRequestService.postJson<TicketsModel>(query, url);
    }

    recoverTicket(query: RecoverTicketsQuery): Observable<Array<Result>> {
        const url = 'Home/RecoverByBetId/RecoverTickets';
        return this.httpRequestService.postJson(query, url);
    }
}