import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpRequestService } from '../../internal/services/http-request.service';
import { MatchViewModel, GetMatchQuery } from '../../internal/components/match-detail/match.viewmodel';
import { GroupBetTypeVirtualSport } from '../../internal/components/bettypes-virtualsports/bettypes-virtualsports.model';

import { GetTicketsQuery, VoidTicketsQuery, ExportExcelQuery } from './models/query.model';
import { Result } from '../../internal/models/result';
import { TicketsModel } from './tickets/tickets.model';

@Injectable()

export class AppService {
    constructor(private httpRequestService: HttpRequestService) { }

    getBetTypes(): Observable<Array<GroupBetTypeVirtualSport>> {
        const url = 'BetTypes/GetVirtualSport';
        return this.httpRequestService.getJson(url);
    }

    getMatchDetail(id: string): Observable<MatchViewModel> {
        const query: GetMatchQuery = { matchId: parseInt(id, 10), isMatch3rd: false };
        const url = 'Match/GetInfo';
        return this.httpRequestService.postJson(query, url);
    }

    getTickets(queryModel: GetTicketsQuery): Observable<TicketsModel> {
        const url = 'VirtualSports/VoidParlaySubBet/GetTickets';
        return this.httpRequestService.postJson<TicketsModel>(queryModel, url);
    }

    exportExcel(query: ExportExcelQuery) {
        const url = 'VirtualSports/VoidParlaySubBet/ExportExcel';
        return this.httpRequestService.downloadFile(query, url);
    }

    voidTicket(queryModel: VoidTicketsQuery): Observable<Array<Result>> {
        const url = 'VirtualSports/VoidParlaySubBet/VoidTickets';
        return this.httpRequestService.postJson(queryModel, url);
    }
}