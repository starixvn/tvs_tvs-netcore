import { Injectable } from '@angular/core';
import { MatchInfo, MatchInfoViewModel } from '../../../../utility/models/event.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { HttpService } from '../../../../utility/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class LeagueEventService {
  constructor(
    private readonly httpService: HttpService
  ) { }

  async getMatch(sportType: number, eventDate: string, transIds: string, isUpdRequest: boolean,
      matchId: number, actionId: number): Promise<MatchInfoViewModel> {
    return this.httpService.postJson({ sportType, eventDate, transIds, isUpdRequest, matchId, actionId }, 'api/MatchInfo/GetInfoForAddRequest');
  }

  public getMatchInfo(match: MatchModel): MatchInfo {
    const matchInfo = new MatchInfo();
    matchInfo.matchId = match.matchId;
    matchInfo.name = match.name;
    matchInfo.sportType = match.sportType;
    matchInfo.matchCode = match.matchCode;
    matchInfo.parentId = match.parentId;
    matchInfo.kickOffTime = match.kickOffTime;
    matchInfo.leagueId = match.leagueId;
    matchInfo.leagueName = match.leagueName;

    return matchInfo;
  }
}
