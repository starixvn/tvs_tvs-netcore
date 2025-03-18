import { inject } from '@angular/core';
import _ from 'lodash';
import moment from 'moment';
import { ClipboardService } from 'ngx-clipboard';
import { FilterOddsTypeConstant } from '../../../../add-request/app/add-request/event-wrong-odds-sports-book/models/filter-wrong-odds-sports-book.model';
import { DateTimeFormat, TVSRequestFilterBy } from '../../../../utility/constants/config';
import { BetTypeTicketsInfo, CopyRequestInfoQuery, CopyRequestInfoResponse, RequestInfoForCopy } from '../../../../utility/models/copy-request-info.query';
import { CommonService } from '../../../../utility/services/common.service';
import { TvDetectionService } from './tv-detection.service';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';

export class RequestDescriptionService {
  commonService = inject(CommonService);
  clipboardService = inject(ClipboardService);
  
  public async copyToClipboard(requestId: number, matchId: number, requestDetailId?: number): Promise<void> {
    const query: CopyRequestInfoQuery = {
      requestId: requestId,
      matchId: matchId,
      requestDetailId: requestDetailId
    };
    const copyInfoResponse = await this.commonService.copyRequestInfo(query);
    this.clipboardService.copyFromContent(this.createContentCopy(copyInfoResponse));
    alert(`Request No.${requestId} has been copied to clipboard.`);
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
      [IssueTypeConstant.WRONG_1ST_HDP]: this.createWrongOuContent,
      [IssueTypeConstant.WRONG_OU]: this.createWrongOuContent,
      [IssueTypeConstant.WRONG_1ST_OU]: this.createWrongOuContent,
      [IssueTypeConstant.WRONG_ODDS]: this.createWrongOddsContent
    };
    const handler = ISSUE_TYPE_HANDLERS[copyInfoResponse.requestInfo.issueTypeId.toString()];

    return handler ? handler.call(this, copyInfoResponse) : this.createOthersIssueTypeContent(copyInfoResponse);
  }

  private createReducedOversOrAbandonedContent(copyInfoResponse: CopyRequestInfoResponse): string {
    const groupBetTypes = _.groupBy(copyInfoResponse.betTypeTickets, "betTypeId");
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

  private createNotParticipateContent(copyInfoResponse: CopyRequestInfoResponse): string {
    const groupBetTypes = _.groupBy(copyInfoResponse.betTypeTickets, "betTypeId");
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
    const oddsContent = this.generateOddsContentWrongHdp(copyInfoResponse.requestInfo);
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

  private createWrongOddsSportsBookContent(copyInfoResponse: CopyRequestInfoResponse): string {
    const betTypeContent = this.generateBetTypeContent(copyInfoResponse.betTypeTickets);
    const oddsContent = this.generateOddsContentWrongOddsSportsBook(copyInfoResponse.requestInfo);

    return this.createCommonContent(copyInfoResponse, betTypeContent, oddsContent, true, false);
  }

  private generateBetTypeContent(betTypeTickets: BetTypeTicketsInfo[]): string {
    const groupBetTypes = _.groupBy(betTypeTickets, item => `"${item.betTypeId}+${item.betId}"`);
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

  private generateOddsContentWrongOu(requestInfo: RequestInfoForCopy): string {
    return `Wrong: ${requestInfo.wrongMarket}\nCorrect: ${requestInfo.actualMarket}\n`;
  }

  private generateOddsContentWrongOdds(requestInfo: RequestInfoForCopy): string {
    const handicapSubIssueTypeId = 6;
    const _1hHandicapSubIssueTypeId = 119;
    if(requestInfo.subIssueTypeId === handicapSubIssueTypeId || requestInfo.subIssueTypeId === _1hHandicapSubIssueTypeId){
      return `Wrong Odds: Home >= ${requestInfo.fromOddsNotVoidHomeOver} & =< ${requestInfo.toOddsNotVoidHomeOver}, `
      + `Away >= ${requestInfo.fromOddsNotVoidAwayUnder} & =< ${requestInfo.toOddsNotVoidAwayUnder}\n`
      + `Correct Odds: Home ${requestInfo.correctOddsHomeOver}, Away ${requestInfo.correctOddsAwayUnder}\n`;
    }

    return `Wrong Odds: Over >= ${requestInfo.fromOddsNotVoidHomeOver} & =< ${requestInfo.toOddsNotVoidHomeOver}, `
      + `Under >= ${requestInfo.fromOddsNotVoidAwayUnder} & =< ${requestInfo.toOddsNotVoidAwayUnder}\n`
      + `Correct Odds: Over ${requestInfo.correctOddsHomeOver}, Under ${requestInfo.correctOddsAwayUnder}\n`;
  }


  private createCommonContent(copyInfoResponse: CopyRequestInfoResponse, betTypeContent: string, oddsContent: string, isShowCancelCOCount: boolean, isShowMistakenBy: boolean): string {
    const cancelCashOutCount = isShowCancelCOCount ? `, Cancel Cash Out: ${copyInfoResponse.requestInfo.totalCancelCashOutCount}` : '';
    const momentGlobalShowTime = moment(copyInfoResponse.requestInfo.globalShowTime);

    const content = `Hi CSD, please void${copyInfoResponse.requestInfo.liveStatus}tickets for us\n`
      + `K.O Time: ${momentGlobalShowTime.format(DateTimeFormat.SHORT_TIME_FORMAT)}\n`
      + `League: ${copyInfoResponse.requestInfo.leagueName}\n`
      + `Match: ${copyInfoResponse.requestInfo.matchEvent}\n`
      + `Match ID: ${copyInfoResponse.requestInfo.matchId}\n`
      + `Request No: ${copyInfoResponse.requestInfo.requestId}\n`
      + `Issue Type: ${copyInfoResponse.requestInfo.issueTypeName}\n`
      + this.generateMistakenBy(copyInfoResponse.requestInfo, isShowMistakenBy)
      + betTypeContent
      + oddsContent
      + `Void Time: ${moment(copyInfoResponse.requestInfo.voidFromTime).format(DateTimeFormat.TIME_FORMAT)} - ${moment(copyInfoResponse.requestInfo.voidToTime).format(DateTimeFormat.TIME_FORMAT)} `
      + `(Single Count: ${copyInfoResponse.requestInfo.totalSingleCount}, Parlay Count: ${copyInfoResponse.requestInfo.totalParlayCount}${cancelCashOutCount})\n`
      + `${copyInfoResponse.requestInfo.remark}`

    return content;
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
