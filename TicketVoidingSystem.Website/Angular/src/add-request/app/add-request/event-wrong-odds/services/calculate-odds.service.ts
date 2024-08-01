import { Injectable } from '@angular/core';
import { MatchModel } from '../../../../../utility/models/match.model';
import { AddRequestApiService } from '../../add-request-api.service';
import { FilterWrongOddsModel, MaxBetAndSpreadQuery } from '../models/filter-wrong-odds.model';

@Injectable({
  providedIn: 'root'
})
export class CalculateOddsService {

  constructor(
    private readonly addRequestApiService: AddRequestApiService
  ) {}

  public async updateOddsInfo(oddsInfo: FilterWrongOddsModel, match: MatchModel, subIssueTypeId: string): Promise<void> {
    if(match.matchId){
      const maxBetAndSpreads =  await this.addRequestApiService.getMaxBetAndSpreadOfEvent(this.createMaxBetAndSpreadQuery(match));
      oddsInfo.maxBetAndSpreadInfo = maxBetAndSpreads;
      this.updateMaxBetAndSpread(oddsInfo, subIssueTypeId);
      this.updateAllowanceRate(oddsInfo);
    };
  }

  public createMaxBetAndSpreadQuery(match: MatchModel): MaxBetAndSpreadQuery{
    return {
      matchId: match.matchId,
      parentId: match.parentId,
      subtype: match.subtype ?? 0
    } as MaxBetAndSpreadQuery;
  }

  public resetOddsInfo(oddsInfo: FilterWrongOddsModel, subIssueTypeId: string){
    this.updateMaxBetAndSpread(oddsInfo, subIssueTypeId);
    this.updateAllowanceRate(oddsInfo);
    oddsInfo.correctOddsHomeOver = "";
    oddsInfo.correctOddsAwayUnder = "";
  }
  
  public updateMaxBetAndSpread(oddsInfo: FilterWrongOddsModel, subIssueTypeId: string){
    if(oddsInfo.maxBetAndSpreadInfo?.length > 0){
      oddsInfo.maxBet = oddsInfo.maxBetAndSpreadInfo.find(x => x.subIssueTypeId === subIssueTypeId)?.maxBet ?? 0;
      oddsInfo.spread = oddsInfo.maxBetAndSpreadInfo.find(x => x.subIssueTypeId === subIssueTypeId)?.spread ?? "";
    }
    else {
      oddsInfo.maxBet = 0;
      oddsInfo.spread = "";
    }
  }

  public updateAllowanceRate(oddsInfo: FilterWrongOddsModel): void {
    const maxBetDefault = 80000;
    const spreadDefault = 0.15;
    if(oddsInfo.maxBetAndSpreadInfo?.length === 0 || oddsInfo.maxBet >= maxBetDefault || (Number(oddsInfo.spread) === 0 && oddsInfo.maxBet === 0)){
      oddsInfo.allowanceRate = "20";
    }
    else if(Number(oddsInfo.spread) > spreadDefault){
      oddsInfo.allowanceRate = "30";
    }
    else{
      oddsInfo.allowanceRate = "25";
    }
  }

  public updateCorrectOddsAwayUnder(oddsInfo: FilterWrongOddsModel): void {
    const precision = 2; // Define the number of decimal places
    if(!oddsInfo.correctOddsHomeOver || !oddsInfo.spread){
      return;
    }

    const correctOddsHomeOverNum = Number(oddsInfo.correctOddsHomeOver);
    const spreadNum = Number(oddsInfo.spread);
    const sum = correctOddsHomeOverNum + spreadNum;
    const correctOddsAwayUnderNum = sum >= 1 ? 2 - sum : -sum;
    
    oddsInfo.correctOddsAwayUnder = correctOddsAwayUnderNum.toFixed(precision);
  }

  public calculateOddsRange(oddsInfo: FilterWrongOddsModel): void {
    const precision = 2;
    if(!oddsInfo.correctOddsHomeOver || !oddsInfo.correctOddsAwayUnder){
      return;
    }

    const allowanceRateNum = Number(oddsInfo.allowanceRate)/100; 
    const correctOddsHomeOverNum = Number(oddsInfo.correctOddsHomeOver);
    const correctOddsAwayUnderNum = Number(oddsInfo.correctOddsAwayUnder);

    const aboveHomeOver = correctOddsHomeOverNum + allowanceRateNum;
    const aboveAwayUnder = correctOddsAwayUnderNum + allowanceRateNum;
    oddsInfo.toOddsNotVoidHomeOver = (aboveHomeOver >= 1 ? -2 + aboveHomeOver : aboveHomeOver).toFixed(precision);
    oddsInfo.toOddsNotVoidAwayUnder = (aboveAwayUnder >= 1 ? -2 + aboveAwayUnder : aboveAwayUnder).toFixed(precision);

    const belowHomeOver = correctOddsHomeOverNum - allowanceRateNum;
    const belowAwayUnder = correctOddsAwayUnderNum - allowanceRateNum;
    oddsInfo.fromOddsNotVoidHomeOver = (belowHomeOver <= -1 ? 2 + belowHomeOver: belowHomeOver).toFixed(precision);
    oddsInfo.fromOddsNotVoidAwayUnder = (belowAwayUnder <= -1 ? 2 + belowAwayUnder: belowAwayUnder).toFixed(precision);
  }
}
