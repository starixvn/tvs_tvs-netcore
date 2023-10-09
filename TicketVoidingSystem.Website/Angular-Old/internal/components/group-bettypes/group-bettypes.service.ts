import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpRequestService } from '../../services/http-request.service';

import { GetBetTypesQuery, GroupBetTypesModel } from './group-bettypes.model';

@Injectable()

export class AppService {
    constructor(private httpRequestService: HttpRequestService) { }

    getBetTeams(query: GetBetTypesQuery): Observable<GroupBetTypesModel> {
        const url = 'api/BetTypes/GetGroupBetTypesNg';
        return this.httpRequestService.postJson(query, url);
    }
}