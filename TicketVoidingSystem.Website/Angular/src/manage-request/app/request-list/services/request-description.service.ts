import { inject } from '@angular/core';
import groupBy from 'lodash/groupBy';
import moment from 'moment-timezone';
import { ClipboardService } from 'ngx-clipboard';
import { FilterOddsTypeConstant } from '../../../../add-request/app/add-request/event-wrong-odds-sports-book/models/filter-wrong-odds-sports-book.model';
import { DateTimeFormat, TVSRequestFilterBy } from '../../../../utility/constants/config';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { SportType } from '../../../../utility/constants/sport.constant';
import { SubIssueTypeConstant } from '../../../../utility/constants/sub-issue-type.constant';
import { BetTypeTicketsInfo, CopyRequestInfoQuery, CopyRequestInfoResponse, RequestInfoForCopy } from '../../../../utility/models/copy-request-info.query';
import { CommonService } from '../../../../utility/services/common.service';
import { AppComponent } from '../../app.component';
import { TvDetectionService } from './tv-detection.service';

export class RequestDescriptionService {
  commonService = inject(CommonService);
  clipboardService = inject(ClipboardService);
  appComponent = inject(AppComponent);

  public async copyToClipboard(requestId: number, matchId: number, requestDetailId?: number): Promise<void> {
    const query: CopyRequestInfoQuery = {
      requestId: requestId,
      matchId: matchId,
      requestDetailId: requestDetailId
    };
    const copyInfoResponse = await this.commonService.copyRequestInfo(query);
    if(!copyInfoResponse){
      alert('Copy request information was not successful. Please refresh Manage Request page and try again.');
      return;
    }
    this.clipboardService.copyFromContent(this.createContentCopy(copyInfoResponse));
    alert(`Request No.${requestId} has been copied to clipboard.`);
    this.appComponent.logAccessAction('CopyRequestInfo');
  }

  private createContentCopy(copyInfoResponse: CopyRequestInfoResponse): string {
    const ISSUE_TYPE_HANDLERS = {
      [IssueTypeConstant.REDUCED_OVER]: this.createReducedOversOrAbandonedContent,
      [IssueTypeConstant.ABANDONED]: this.createReducedOversOrAbandonedContent,
      [IssueTypeConstant.NOT_PARTICIPATE]: this.createNotParticipateContent,
      [IssueTypeConstant.WRONG_MARKET_OFFERED]: this.createWrongMarketOfferedContent,
      [IssueTypeConstant.TECHNICAL_ERROR]: this.createTechnicalErrorContent,
      [IssueTypeConstant.WRONG_ODDS_SPORTS_BOOK]: this.createWrongOddsSportsBookContent,
      [IssueTypeConstant.WRONG_HDP]: this.createWrongHdpContent,
      [IssueTypeConstant.WRONG_1ST_HDP]: this.createWrongHdpContent,
      [IssueTypeConstant.WRONG_OU]: this.createWrongOuContent,
      [IssueTypeConstant.WRONG_1ST_OU]: this.createWrongOuContent,
      [IssueTypeConstant.WRONG_ODDS]: this.createWrongOddsContent,
      [IssueTypeConstant.MATCH_EARLY_COMPLETED]: this.createMatchEarlyCompletedContent
    };
    const handler = ISSUE_TYPE_HANDLERS[copyInfoResponse.requestInfo.issueTypeId.toString()];

    return handler ? handler.call(this, copyInfoResponse) : this.createOthersIssueTypeContent(copyInfoResponse);
  }

  private createReducedOversOrAbandonedContent(copyInfoResponse: CopyRequestInfoResponse): string {
    const groupBetTypes = groupBy(copyInfoResponse.betTypeTickets, item => `"${item.betTypeId}+${item.inputtedRuns}+${item.betId}"`);
    let outputContent = '';

    for (const key in groupBetTypes) {
      const values = groupBetTypes[key];
      const inputtedRunsText = values[0].inputtedRuns ? ` - Above ${values[0].inputtedRuns} should be voided` : '';
      const betTypeContent = `${values[0].betTypeName}${inputtedRunsText}\n`;

      const playerContent = values.map(element => element.playerName ? `${element.playerName} - ${element.ticketsCount} ticket(s)\n`
        : `${element.ticketsCount} ticket(s)\n`).join('');
      outputContent += `${betTypeContent}${playerContent}\n`;

    }

    return this.createCommonContent(copyInfoResponse, outputContent, '', false, false);
  }

  cloneGroupBetTypes(betTypeTickets: BetTypeTicketsInfo[]) {
    return groupBy(betTypeTickets, item => `"${item.betTypeId}+${item.betId}"`);
  }

  private createNotParticipateContent(copyInfoResponse: CopyRequestInfoResponse): string {
    const groupBetTypes = this.cloneGroupBetTypes(copyInfoResponse.betTypeTickets);
    let betTypeContent = '';

    for (const key in groupBetTypes) {
      const values = groupBetTypes[key];
      const currentContent = `${values[0].betTypeName}\n`;
      const playerContent = values.map(element => `${element.playerName} - ${element.ticketsCount} ticket(s)\n`).join('');
      betTypeContent += `${currentContent}${playerContent}\n`;
    }

    return this.createCommonContent(copyInfoResponse, betTypeContent, '', false, false);
  }

  private createWrongMarketOfferedContent(copyInfoResponse: CopyRequestInfoResponse): string {
    const betTypeContent = this.generateBetTypeContent(copyInfoResponse.betTypeTickets);
    return this.createCommonContent(copyInfoResponse, betTypeContent, '', true, true);
  }

  private createWrongHdpContent(copyInfoResponse: CopyRequestInfoResponse): string {
    const mainSubTypeHdp = [SubIssueTypeConstant.WRONG_HDP, SubIssueTypeConstant.WRONG_1ST_HDP];
    const oddsContent = mainSubTypeHdp.includes(copyInfoResponse.requestInfo.subIssueTypeId)
      ? this.generateOddsContentWrongHdp(copyInfoResponse.requestInfo)
      : this.generateOddsContentHdpVirtualHeadReverse(copyInfoResponse.requestInfo);

    return this.createCommonContent(copyInfoResponse, '', oddsContent, false, true);
  }

  private createWrongOuContent(copyInfoResponse: CopyRequestInfoResponse): string {
    const oddsContent = this.generateOddsContentWrongOu(copyInfoResponse.requestInfo);
    return this.createCommonContent(copyInfoResponse, '', oddsContent, false, true);
  }

  private createWrongOddsContent(copyInfoResponse: CopyRequestInfoResponse): string {
    const oddsContent = this.generateOddsContentWrongOdds(copyInfoResponse.requestInfo);
    return this.createCommonContent(copyInfoResponse, '', oddsContent, false, true);
  }

  private createTechnicalErrorContent(copyInfoResponse: CopyRequestInfoResponse): string {
    const betTypeContent = this.generateBetTypeContent(copyInfoResponse.betTypeTickets);
    return this.createCommonContent(copyInfoResponse, betTypeContent, '', false, false);
  }

  private createMatchEarlyCompletedContent(copyInfoResponse: CopyRequestInfoResponse): string {
    const betTypeContent = this.generateBetTypeContent(copyInfoResponse.betTypeTickets);
    return this.createCommonContent(copyInfoResponse, betTypeContent, '', false, false);
  }

  private createWrongOddsSportsBookContent(copyInfoResponse: CopyRequestInfoResponse): string {
    const betTypeContent = this.generateBetTypeContent(copyInfoResponse.betTypeTickets);
    const oddsContent = this.generateOddsContentWrongOddsSportsBook(copyInfoResponse.requestInfo);

    return this.createCommonContent(copyInfoResponse, betTypeContent, oddsContent, true, false);
  }

  private generateBetTypeContent(betTypeTickets: BetTypeTicketsInfo[]): string {
    const groupBetTypes = this.cloneGroupBetTypes(betTypeTickets);
    let betTypeContent = '';

    for (const key in groupBetTypes) {
      const values = groupBetTypes[key];
      const currentContent = `${values[0].betTypeName}\n`;
      const playerContent = values.map(element => `${element.playerName ? (element.playerName + ' - ') : ''}${element.ticketsCount} ticket(s)\n`).join('');
      betTypeContent += `${currentContent}${playerContent}\n`;
    }

    return betTypeContent;
  }

  private generateOddsContentWrongOddsSportsBook(requestInfo: RequestInfoForCopy): string {
    const wrongOdds = requestInfo.filterOddsType === FilterOddsTypeConstant.RANGE
      ? `${requestInfo.fromOdds} -> ${requestInfo.toOdds}` : requestInfo.oddsValue;

    return `Wrong Odds: ${wrongOdds}\nCorrect Odds: ${requestInfo.correctOdds}\n`;
  }

  private generateOddsContentWrongHdp(requestInfo: RequestInfoForCopy): string {
    if(requestInfo.filterFavoriteType === 'h'){
      return `Wrong Home: ${requestInfo.favoriteValue}\nCorrect Home: ${requestInfo.actualMarket}\n`;
    }
    return `Wrong Away: ${requestInfo.favoriteValue}\nCorrect Away: ${requestInfo.actualMarket}\n`;
  }

  private generateOddsContentHdpVirtualHeadReverse(requestInfo: RequestInfoForCopy): string {
    const subTypeHdpAway = [SubIssueTypeConstant.AWAY_VIRTUAL_HEAD_REVERSED_HDP, SubIssueTypeConstant.AWAY_VIRTUAL_HEAD_REVERSED_1ST_HDP];

    const firstTeamName = subTypeHdpAway.includes(requestInfo.subIssueTypeId) ? requestInfo.awayName : requestInfo.homeName;
    const secondTeamName = subTypeHdpAway.includes(requestInfo.subIssueTypeId) ? requestInfo.homeName : requestInfo.awayName;
    return `Wrong: ${firstTeamName} ${requestInfo.hdpValue}\nCorrect: ${secondTeamName} ${requestInfo.hdpValue}\n`;
  }

  private generateOddsContentWrongOu(requestInfo: RequestInfoForCopy): string {
    return `Wrong: ${requestInfo.wrongMarket}\nCorrect: ${requestInfo.actualMarket}\n`;
  }

  private isShowLiveScores(requestInfo: RequestInfoForCopy): boolean {
    const isWrongOddsShowLiveScores = requestInfo.issueTypeId.toString() === IssueTypeConstant.WRONG_ODDS
    && (requestInfo.subIssueTypeId === SubIssueTypeConstant.HANDICAP || requestInfo.subIssueTypeId === SubIssueTypeConstant.FIRST_HALF_HANDICAP);
    const isHandicapShowLiveScores = [IssueTypeConstant.WRONG_HDP, IssueTypeConstant.WRONG_1ST_HDP].includes(requestInfo.issueTypeId.toString());
    const isWrongOuShowLiveScores = [IssueTypeConstant.WRONG_OU, IssueTypeConstant.WRONG_1ST_OU].includes(requestInfo.issueTypeId.toString());

    return SportType.SOCCER === requestInfo.sportType  &&
     (isHandicapShowLiveScores || isWrongOuShowLiveScores || isWrongOddsShowLiveScores);
  }

  private generateLiveScores(requestInfo: RequestInfoForCopy): string {
    if(!this.isShowLiveScores(requestInfo)){
      return '';
    }
    return requestInfo.liveScores ? `Live Score: ${requestInfo.liveScores}\n` : 'Live Score: \n';
  }

  private generateOddsContentWrongOdds(requestInfo: RequestInfoForCopy): string {
    if(requestInfo.subIssueTypeId === SubIssueTypeConstant.HANDICAP || requestInfo.subIssueTypeId === SubIssueTypeConstant.FIRST_HALF_HANDICAP){
      return `Wrong Odds:\n`
      + `Home: >= ${requestInfo.toOddsNotVoidHomeOver} & =< ${requestInfo.fromOddsNotVoidHomeOver}\n`
      + `Away: >= ${requestInfo.toOddsNotVoidAwayUnder} & =< ${requestInfo.fromOddsNotVoidAwayUnder}\n`
      + `Correct Odds:\n`
      + `Home: ${requestInfo.correctOddsHomeOver}\n`
      + `Away: ${requestInfo.correctOddsAwayUnder}\n`;
    }

    return `Wrong Odds:\n`
      + `Over: >= ${requestInfo.toOddsNotVoidHomeOver} & =< ${requestInfo.fromOddsNotVoidHomeOver}\n`
      + `Under: >= ${requestInfo.toOddsNotVoidAwayUnder} & =< ${requestInfo.fromOddsNotVoidAwayUnder}\n`
      + `Correct Odds:\n`
      + `Over: ${requestInfo.correctOddsHomeOver}\n`
      + `Under: ${requestInfo.correctOddsAwayUnder}\n`;
  }

  private iddShowOnlyIssueTypeName(copyInfoResponse: CopyRequestInfoResponse){
    return !copyInfoResponse.requestInfo.subIssueTypeName
      || copyInfoResponse.requestInfo.subIssueTypeName === copyInfoResponse.requestInfo.issueTypeName
  }

  private createCommonContent(copyInfoResponse: CopyRequestInfoResponse, betTypeContent: string, oddsContent: string, isShowCancelCOCount: boolean, isShowMistakenBy: boolean): string {
    const cancelCashOutCount = isShowCancelCOCount ? `, Cancel Cash Out: ${copyInfoResponse.requestInfo.totalCancelCashOutCount}` : '';
    const momentGlobalShowTime = moment(copyInfoResponse.requestInfo.globalShowTime);
    const issueTypeName = this.iddShowOnlyIssueTypeName(copyInfoResponse)
      ? copyInfoResponse.requestInfo.issueTypeName
      : `${copyInfoResponse.requestInfo.issueTypeName} - ${copyInfoResponse.requestInfo.subIssueTypeName}`;
    const content = `Hi CSD, please void${copyInfoResponse.requestInfo.liveStatus}tickets for us\n`
      + `K.O Time: ${momentGlobalShowTime.format(DateTimeFormat.SHORT_TIME_FORMAT)}\n`
      + `League: ${copyInfoResponse.requestInfo.leagueName}\n`
      + `Match: ${copyInfoResponse.requestInfo.matchEvent}\n`
      + `Match ID: ${copyInfoResponse.requestInfo.matchId}\n`
      + `Request No: ${copyInfoResponse.requestInfo.requestId}\n`
      + `Issue Type: ${issueTypeName}` + this.generateInputtedOuValue(copyInfoResponse.requestInfo) + this.generateInputtedHdpValue(copyInfoResponse.requestInfo) + '\n'
      + this.generateMistakenBy(copyInfoResponse.requestInfo, isShowMistakenBy)
      + betTypeContent
      + oddsContent
      + this.generateVoidTimeAndTicketCount(copyInfoResponse, cancelCashOutCount)
      + this.generateRemark(copyInfoResponse.requestInfo)
      + this.generateLiveScores(copyInfoResponse.requestInfo);

    return content;
  }

  private generateVoidTimeAndTicketCount(model: CopyRequestInfoResponse, cancelCashOutCount: string): string {
    const issueTypesHavePoolHouse = [
      IssueTypeConstant.WRONG_ODDS, IssueTypeConstant.WRONG_HDP, IssueTypeConstant.WRONG_1ST_HDP,
      IssueTypeConstant.WRONG_OU, IssueTypeConstant.WRONG_1ST_OU
    ];

    if(issueTypesHavePoolHouse.includes(model.requestInfo.issueTypeId.toString())){
      return this.generateVoidTimeAndTicketCountIssueTypeHavePoolHouse(model, cancelCashOutCount);
    }
    return this.generateVoidTimeAndTicketCountIssueTypeNotHavePoolHouse(model, cancelCashOutCount);
  }

  private generateVoidTimeAndTicketCountIssueTypeNotHavePoolHouse(model: CopyRequestInfoResponse, cancelCashOutCount: string): string {
    return `Void Time: ${moment(model.requestInfo.voidFromTime).format(DateTimeFormat.TIME_FORMAT)} - ${moment(model.requestInfo.voidToTime).format(DateTimeFormat.TIME_FORMAT)} `
      + `(Single Count: ${model.requestInfo.totalSingleCount}, Parlay Count: ${model.requestInfo.totalParlayCount}${cancelCashOutCount})\n`
  }

  private generateVoidTimeAndTicketCountIssueTypeHavePoolHouse(model: CopyRequestInfoResponse, cancelCashOutCount: string): string {
    return `Void Time: ${moment(model.requestInfo.voidFromTime).format(DateTimeFormat.TIME_FORMAT)} - ${moment(model.requestInfo.voidToTime).format(DateTimeFormat.TIME_FORMAT)}\n`
      + `LG/Early - Single Count: ${model.requestInfo.liveGameEarlySingleCount}\n`
      + `PH - Single Count: ${model.requestInfo.poolHouseSingleCount}, Parlay Count: ${model.requestInfo.totalParlayCount}${cancelCashOutCount}\n`
  }

  private generateInputtedOuValue(requestInfo: RequestInfoForCopy): string {
    const subTypeOverUnder = [SubIssueTypeConstant.OVER_UNDER, SubIssueTypeConstant.FIRST_HALF_OVER_UNDER];
    if(requestInfo.issueTypeId.toString() === IssueTypeConstant.WRONG_ODDS && subTypeOverUnder.includes(requestInfo.subIssueTypeId)){
      return ` @${requestInfo.wrongOu}`;
    }
    return '';
  }

  private generateInputtedHdpValue(requestInfo: RequestInfoForCopy): string {
    const subTypeHandicap = [SubIssueTypeConstant.HANDICAP, SubIssueTypeConstant.FIRST_HALF_HANDICAP];
    if(requestInfo.issueTypeId.toString() === IssueTypeConstant.WRONG_ODDS && subTypeHandicap.includes(requestInfo.subIssueTypeId)){
      return requestInfo.filterFavoriteType === 'h'
        ? ` @Home -${requestInfo.favoriteValue}`
        : ` @Away -${requestInfo.favoriteValue}`;
    }

    return '';
  }

  private generateRemark(requestInfo: RequestInfoForCopy): string {
    const IssueTypesShowRemark = [IssueTypeConstant.WRONG_KICK_OFF, IssueTypeConstant.TECHNICAL_ERROR,
      IssueTypeConstant.REDUCED_OVER, IssueTypeConstant.ABANDONED, IssueTypeConstant.WRONG_ODDS_SPORTS_BOOK,
      IssueTypeConstant.NOT_PARTICIPATE, IssueTypeConstant.MATCH_EARLY_COMPLETED];
    if(requestInfo.remark && IssueTypesShowRemark.includes(requestInfo.issueTypeId.toString())){
      return `${requestInfo.remark}\n`;
    }
    return '';
  }

  private createOthersIssueTypeContent(copyInfoResponse: CopyRequestInfoResponse): string {
    const momentGlobalShowTime = moment(copyInfoResponse.requestInfo.globalShowTime);
    const content = `K.O Time: ${momentGlobalShowTime.format(DateTimeFormat.SHORT_TIME_FORMAT)}\n`
      + `League: ${copyInfoResponse.requestInfo.leagueName}\n`
      + `Match: ${copyInfoResponse.requestInfo.matchEvent}\n`
      + `Match ID: ${copyInfoResponse.requestInfo.matchId}\n`
      + `Request No: ${copyInfoResponse.requestInfo.requestId}\n`
      + `Issue Type: ${copyInfoResponse.requestInfo.issueTypeName} - ${copyInfoResponse.requestInfo.subIssueTypeName}\n`
      + `VAR: ${copyInfoResponse.requestInfo.isCheckedVar ? 'YES' : 'NO'}\n`
      + `Provider: ${TvDetectionService.getProviderInfo(copyInfoResponse.requestInfo)}\n`
      + `Start Void Time: ${moment(copyInfoResponse.requestInfo.voidFromTime)
        .format(DateTimeFormat.TIME_FORMAT)} (${copyInfoResponse.requestInfo.filterBy === TVSRequestFilterBy.CHECK_TIME ? "Accept time" : "Trans time"})`
      + TvDetectionService.getTvDetection(copyInfoResponse.requestInfo);

    return content;
  }

  private generateMistakenBy(requestInfo: RequestInfoForCopy, isShowMistakenBy: boolean): string {
    requestInfo.mistakenBy = requestInfo.mistakenBy ?? '';
    return isShowMistakenBy ? `Mistaken By: ${requestInfo.mistakenBy}\n\n` : '\n';
  }
}
