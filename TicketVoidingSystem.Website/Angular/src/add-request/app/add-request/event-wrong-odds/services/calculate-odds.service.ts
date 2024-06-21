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
      oddsInfo.matchId = match.matchId;
      oddsInfo.parentId = match.parentId;
      oddsInfo.subtype = match.subtype ?? 0;
      oddsInfo.subIssueTypeId = subIssueTypeId;
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

  public updateCorrectOddsAwayUnder(oddsInfo: OddsInfoModel): void {
    const precision = 2; // Define the number of decimal places
    const correctOddsHomeOverNum = Number(oddsInfo.correctOddsHomeOver);
    const spreadNum = Number(oddsInfo.spread);

    const sum = correctOddsHomeOverNum + spreadNum;
    const correctOddsAwayUnderNum = sum >= 1 ? 2 - sum : -sum;
    
    oddsInfo.correctOddsAwayUnder = correctOddsAwayUnderNum.toFixed(precision);
    this.calculateOddsRange(oddsInfo);
  }

  public calculateOddsRange(oddsInfo: OddsInfoModel): void {
    const precision = 2;
    const allowanceRateNum = Number(oddsInfo.allowanceRate)/100; 
    const correctOddsHomeOverNum = Number(oddsInfo.correctOddsHomeOver);
    const correctOddsAwayUnderNum = Number(oddsInfo.correctOddsAwayUnder);

    const aboveHomeOver = correctOddsHomeOverNum + allowanceRateNum;
    const aboveAwayUnder = correctOddsAwayUnderNum + allowanceRateNum;
    oddsInfo.toOddsNotVoidHomeOver = aboveHomeOver >= 1 ? -2 + aboveHomeOver : aboveHomeOver;
    oddsInfo.toOddsNotVoidAwayUnder = aboveAwayUnder >= 1 ? -2 + aboveAwayUnder : aboveAwayUnder;

    const belowHomeOver = correctOddsHomeOverNum - allowanceRateNum;
    const belowAwayUnder = correctOddsAwayUnderNum - allowanceRateNum;
    oddsInfo.fromOddsNotVoidHomeOver = belowHomeOver <= -1 ? 2 + belowHomeOver: belowHomeOver;
    oddsInfo.fromOddsNotVoidAwayUnder = belowAwayUnder <= -1 ? 2 + belowAwayUnder: belowAwayUnder;
    
    console.log(oddsInfo.toOddsNotVoidHomeOver.toFixed(precision));
    console.log(oddsInfo.toOddsNotVoidAwayUnder.toFixed(precision));
    console.log(oddsInfo.fromOddsNotVoidHomeOver.toFixed(precision));
    console.log(oddsInfo.fromOddsNotVoidAwayUnder.toFixed(precision));
  }
}
