import { Injectable } from '@angular/core';

import { GetBetTypesQuery, GroupBetTypesModel } from './group-bettypes.model';
import { HttpService } from '../../../../utility/services/http.service';

@Injectable()

export class AppService {
  constructor(private readonly httpService: HttpService) { }

  async getBetTeams(query: GetBetTypesQuery): Promise<GroupBetTypesModel> {
    const url = 'BetTypes/GetGroupBetTypesNg';
    return this.httpService.postJson(query, url);
  }
}
