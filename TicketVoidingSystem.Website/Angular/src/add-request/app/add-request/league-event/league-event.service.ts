import { Injectable } from '@angular/core';
import { LeagueInfo, MatchInfoViewModel } from '../../../../utility/models/event.model';
import { HttpService } from '../../../../utility/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class LeagueEventService {
  constructor(
    private readonly httpService: HttpService
  ) { }

  /* istanbul ignore next */
  async getLeagues(sportType: number, eventDate: string): Promise<LeagueInfo[]> {
    // TODO: Consider remove this api
    return this.httpService.postJson({ sportType, eventDate }, 'TicketVoiding/GetLeagues');
  }

  /* istanbul ignore next */
  async getMatch(sportType: number, eventDate: string, transIds: string, isUpdRequest: boolean,
      matchId: number, actionId: number): Promise<MatchInfoViewModel> {
    return this.httpService.postJson({ sportType, eventDate, transIds, isUpdRequest, matchId, actionId }, 'TicketVoiding/GetMatch');
  }
}
