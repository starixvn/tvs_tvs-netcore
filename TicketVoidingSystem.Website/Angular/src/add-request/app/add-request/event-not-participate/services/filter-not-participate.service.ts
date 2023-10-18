import { Injectable } from '@angular/core';
import { CommonService } from '../../../../../utility/services/common.service';
import { AddRequestApiService } from '../../add-request-api.service';
import { FilterNotParticipateModel } from '../models/filter-not-participate.model';
import { NotParticipateBetType } from '../models/not-participate-bet-type.model';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class FilterNotParticipateService {
  constructor(
    private readonly addRequestApiService: AddRequestApiService,
    private readonly commonService: CommonService
  ) {}

  public initDefaultFilter(): FilterNotParticipateModel {
    return new FilterNotParticipateModel();
  }

  public async getNotParticipateBetTypes(matchId: number): Promise<NotParticipateBetType[]> {
    return this.addRequestApiService.getNotParticipateBetTypes(matchId);
  }
  public async getPlayers(matchId: number, betTypes: string): Promise<Player[]> {
    const oddsInfo = await this.commonService.GetOddsInfoSpecialBetTypes({matchId: matchId?.toString(), betTypes: betTypes});
    return oddsInfo as Player[];
  }
}