import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../../../internal/services/http.service';
import { HttpRequestService } from '../../services/http-request.service';
import { BetTeam, GetOddsInfoQuery, GetPlayersQuery, OddsInfo, Player } from './advanced-mode.model';

@Injectable()

export class AdvancedModeService {
    constructor(
        private readonly httpRequestService: HttpRequestService,
        private readonly httpService: HttpService
    ) { }

    async getBetTeams(): Promise<Array<BetTeam>> {
        const url = 'BetTypes/GetBetTeams';
        return this.httpService.getJson(url);
    }

    async GetOddsInfoSpecialBetTypes(query: GetOddsInfoQuery): Promise<Array<OddsInfo>> {
        const url = 'BetTypes/GetOddsInfoSpecialBetTypes';
        return this.httpService.postJson(query, url);
    }

    getPlayer(query: GetPlayersQuery): Observable<Array<Player>> {
        const url = 'BetTypes/GetPlayers';
        return this.httpRequestService.postJson(query, url);
    }
}