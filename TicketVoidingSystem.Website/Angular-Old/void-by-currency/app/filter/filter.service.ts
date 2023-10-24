import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatchViewModel } from '../../../internal/components/match-detail/match.viewmodel';
import { HttpRequestService } from '../../../internal/services/http-request.service';
import { FilterModel } from './filter.model';


@Injectable()

export class FilterService {
    constructor(private httpRequestService: HttpRequestService) { }

    getFilterModel(): Observable<FilterModel> {
        const url = 'api/VoidByCurrency/GetFilterModel';
        return this.httpRequestService.getJson(url);
    }

    getMatchDetail(id: string): Observable<MatchViewModel> {
        const url = 'api/MatchInfo/GetInfoForVoidByCurrency';
        return this.httpRequestService.postJson({ matchId: parseInt(id, 10) }, url);
    }
}