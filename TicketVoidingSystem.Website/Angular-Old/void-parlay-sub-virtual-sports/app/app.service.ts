import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GroupBetTypeVirtualSport } from '../../internal/components/bettypes-virtualsports/bettypes-virtualsports.model';
import { GetMatchQuery, MatchViewModel } from '../../internal/components/match-detail/match.viewmodel';
import { HttpRequestService } from '../../internal/services/http-request.service';

import { Result } from '../../internal/models/result';
import { ExportExcelQuery, GetTicketsQuery, VoidTicketsQuery } from './models/query.model';
import { TicketsModel } from './tickets/tickets.model';

@Injectable()

export class AppService {
    constructor(private httpRequestService: HttpRequestService) { }

    getBetTypes(): Observable<Array<GroupBetTypeVirtualSport>> {
        const url = 'api/BetTypes/GetVirtualSport';
        return this.httpRequestService.getJson(url);
    }

    getMatchDetail(id: string): Observable<MatchViewModel> {
        const query: GetMatchQuery = { matchId: parseInt(id, 10), isMatch3rd: false };
        const url = 'api/MatchInfo/GetInfo';
        return this.httpRequestService.postJson(query, url);
    }

    getTickets(queryModel: GetTicketsQuery): Observable<TicketsModel> {
        const url = 'api/VirtualSports/VoidParlaySubBet/GetTickets';
        return this.httpRequestService.postJson<TicketsModel>(queryModel, url);
    }

    exportExcel(query: ExportExcelQuery) {
        const url = 'api/VirtualSports/VoidParlaySubBet/ExportExcel';
        return this.httpRequestService.downloadFile(query, url);
    }

    voidTicket(queryModel: VoidTicketsQuery): Observable<Array<Result>> {
        const url = 'api/VirtualSports/VoidParlaySubBet/VoidTickets';
        return this.httpRequestService.postJson(queryModel, url);
    }
}