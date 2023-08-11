import { Injectable } from '@angular/core';
import { HttpService } from '../../../../utility/services/http.service';
import { BetTeam, GetPlayersQuery, Player } from './advanced-mode.model';


@Injectable()

export class AdvancedModeService {
  constructor(private readonly httpService: HttpService) { }

  async getBetTeams(): Promise<Array<BetTeam>> {
    const url = 'api/BetTypes/GetBetTeams';
    return this.httpService.getJson(url);
  }

  async getPlayer(query: GetPlayersQuery): Promise<Array<Player>> {
    const url = 'BetTypes/GetPlayers';
    return this.httpService.postJson(query, url);
  }
}
