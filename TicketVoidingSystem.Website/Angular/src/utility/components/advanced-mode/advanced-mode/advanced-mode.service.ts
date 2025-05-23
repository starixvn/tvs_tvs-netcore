import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../../../utility/services/http.service';
import { BetTeamAddRequest } from '../../advanced-mode-add-request/advanced-mode/advanced-mode.model';
import { BetTeam, GetPlayersQuery, Player } from './advanced-mode.model';

@Injectable({
  providedIn: 'root'
})
export class AdvancedModeService {
  private readonly httpService = inject(HttpService);

  async getBetTeams(): Promise<Array<BetTeam>> {
    const url = 'api/BetTypes/GetBetTeams';
    return this.httpService.getJson(url);
  }

  async getBetTeamsAddRequest(): Promise<BetTeamAddRequest[]> {
    return this.httpService.getJson<BetTeamAddRequest[]>('api/AddRequest/GetBetTeams');
  }

  async getPlayer(query: GetPlayersQuery): Promise<Array<Player>> {
    const url = 'BetTypes/GetPlayers';
    return this.httpService.postJson(query, url);
  }
}
