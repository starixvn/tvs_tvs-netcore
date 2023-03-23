import { Injectable } from '@angular/core';
import { HttpService } from '../../../../utility/services/http.service';
import { BetTeam, GetOddsInfoQuery, GetPlayersQuery, OddsInfo, Player } from './advanced-mode.model';


@Injectable()

export class AdvancedModeService {
  constructor(private readonly httpService: HttpService) { }

  async getBetTeams(): Promise<Array<BetTeam>> {
    const url = 'api/BetTypes/GetBetTeams';
    return this.httpService.getJson(url);
  }

  async GetOddsInfoSpecialBetTypes(query: GetOddsInfoQuery): Promise<Array<OddsInfo>> {
    const url = 'api/BetTypes/GetOddsInfoSpecialBetTypes';
    return this.httpService.postJson(query, url);
  }

  async getPlayer(query: GetPlayersQuery): Promise<Array<Player>> {
    const url = 'BetTypes/GetPlayers';
    return this.httpService.postJson(query, url);
  }
}
