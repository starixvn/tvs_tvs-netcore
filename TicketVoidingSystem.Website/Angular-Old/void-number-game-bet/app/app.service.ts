import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BetTypesModel } from '../../internal/components/bettypes/bettypes.model';
import { GetBetTypesQuery } from '../../internal/components/group-bettypes/group-bettypes.model';
import { GetMatchQuery, MatchViewModel } from '../../internal/components/match-detail/match.viewmodel';
import { CheckNegativeBalanceQuery, NegativeBalance } from '../../internal/models/negative-balance';
import { Result } from '../../internal/models/result';
import { HttpRequestService } from '../../internal/services/http-request.service';
import { GetTicketsQuery, VoidTicketsQuery } from './models/query.model';
import { TicketsModel } from './tickets/tickets.model';

@Injectable()

export class AppService {
    constructor(private httpRequestService: HttpRequestService) { }

    getBetTypes(query: GetBetTypesQuery): Observable<BetTypesModel> {
        const url = 'api/BetTypes/GetBetTypes';
        return this.httpRequestService.postJson(query, url);
    }

    getMatchInfo(id: string): Observable<MatchViewModel> {
        const query: GetMatchQuery = { matchId: parseInt(id, 10), isMatch3rd: false };
        const url = 'api/MatchInfo/GetInfo';
        return this.httpRequestService.postJson(query, url);
    }

    getTickets(queryModel: GetTicketsQuery): Observable<TicketsModel> {
        const url = 'api/VoidNumberGameBet/GetVoidTickets';
        return this.httpRequestService.postJson<TicketsModel>(queryModel, url);
    }

    exportExcel(query: GetTicketsQuery) {
        const url = 'api/VoidNumberGameBet/ExportExcel';
        return this.httpRequestService.downloadFile(query, url);
    }

    checkNegativeBalance(queryModel: CheckNegativeBalanceQuery): Observable<Array<NegativeBalance>> {
        const url = 'api/SharedApi/CheckNegativeBalance';
        return this.httpRequestService.postJson(queryModel, url);
    }

    voidTicket(queryModel: VoidTicketsQuery): Observable<Array<Result>> {
        const url = 'api/VoidNumberGameBet/VoidTickets';
        return this.httpRequestService.postJson(queryModel, url);
    }
}