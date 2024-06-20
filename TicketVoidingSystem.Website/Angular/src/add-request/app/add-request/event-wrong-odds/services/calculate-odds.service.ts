import { Injectable } from '@angular/core';
import { OddsInfoModel } from '../models/filter-wrong-odds.model';
import { MatchModel } from '../../../../../utility/models/match.model';
import { CommonService } from '../../../../../utility/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class CalculateOddsService {

  constructor(
    private readonly commonService: CommonService
  ) {}

  public async updateOddsInfo(oddsInfo: OddsInfoModel, match: MatchModel, subIssueTypeId: string): Promise<void> {
    if(match){
      oddsInfo.matchId = match.matchId,
      oddsInfo.parentId = match.parentId,
      oddsInfo.subtype = match.subtype ?? 0,
      oddsInfo.subIssueTypeId = subIssueTypeId
      const maxBetAndSpread =  await this.commonService.getMaxBetAndSpreadOfEvent(oddsInfo);
      oddsInfo.maxBet = maxBetAndSpread.maxBet;
      oddsInfo.spread = maxBetAndSpread.spread;
      this.updateAllowanceRate(oddsInfo);
    };
  }

  public updateAllowanceRate(oddsInfo: OddsInfoModel): void {
    const maxBetDefault = 80000;
    const spreadDefault = 0.15;
    if(oddsInfo.maxBet >= maxBetDefault){
      oddsInfo.allowanceRate = "20";
    }
    else if(Number(oddsInfo.spread) > spreadDefault){
      oddsInfo.allowanceRate = "30";
    }
    else{
      oddsInfo.allowanceRate = "25";
    }
  }
}
