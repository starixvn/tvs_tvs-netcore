import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { CommonService } from '../../../../../utility/services/common.service';
import { FilterNotParticipateModel } from '../models/filter-not-participate.model';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class FilterNotParticipateService {
  constructor(
    private readonly commonService: CommonService
  ) {}

  public initDefaultFilter(): FilterNotParticipateModel {
    return new FilterNotParticipateModel();
  }

  public async getPlayers(matchId: number): Promise<Player[]> {
    const notParticipateBetTypes = '9650,9651,9652,9653,9654,9655,9656,9657,9658,9659,9660,9661,9668,9669,9670,9671,9672,9673,9674,9675';
    const oddsInfo = await this.commonService.GetOddsInfoSpecialBetTypes({matchId: matchId?.toString(), betTypes: notParticipateBetTypes});
    const distinctPlayerById = _.uniqBy(oddsInfo, 'playerId');
    return distinctPlayerById as Player[];
  }
}