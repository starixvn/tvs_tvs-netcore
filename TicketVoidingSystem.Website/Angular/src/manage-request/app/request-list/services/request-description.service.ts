import { Injectable } from '@angular/core';
import _ from 'lodash';
import moment from 'moment';
import { ClipboardService } from 'ngx-clipboard';
import { FilterOddsTypeConstant } from '../../../../add-request/app/add-request/event-wrong-odds-sports-book/models/filter-wrong-odds-sports-book.model';
import { DateTimeFormat, TVSRequestFilterBy } from '../../../../utility/constants/config';
import { BetTypeTicketsInfo, CopyRequestInfoQuery, CopyRequestInfoResponse, RequestInfoForCopy } from '../../../../utility/models/copy-request-info.query';
import { CommonService } from '../../../../utility/services/common.service';
import { StaticService } from '../../../../utility/services/static.service';

@Injectable({
  providedIn: 'root'
})
export class RequestDescriptionService {
  constructor(
    private readonly commonService: CommonService,
    private readonly clipboardService: ClipboardService
  ) { }

  public async copyToClipboard(requestId: number, matchId: number): Promise<void> {
    const query: CopyRequestInfoQuery = {
      requestId: requestId,
      matchId: matchId
    };
    const copyInfoResponse = await this.commonService.copyRequestInfo(query);
    this.clipboardService.copyFromContent(this.createContentCopy(copyInfoResponse));
    alert(`Request No.${requestId} has been copied to clipboard.`);
  }

  private createContentCopy(copyInfoResponse: CopyRequestInfoResponse): string {
    if (StaticService.isReducedOver(copyInfoResponse.requestInfo.issueTypeId.toString()) || StaticService.isAbandoned(copyInfoResponse.requestInfo.issueTypeId.toString())) {
      return this.createReducedOversOrAbandonedContent(copyInfoResponse);
    }

    if (StaticService.isNotParticipate(copyInfoResponse.requestInfo.issueTypeId.toString())) {
      return this.createNotParticipateContent(copyInfoResponse);
    }

    if (StaticService.isWrongMarketOffered(copyInfoResponse.requestInfo.issueTypeId.toString())) {
      return this.createWrongMarketOfferedContent(copyInfoResponse);
    }

    if (StaticService.isTechnicalError(copyInfoResponse.requestInfo.issueTypeId.toString())) {
      return this.createTechnicalErrorContent(copyInfoResponse);
    }

    if (StaticService.isWrongOddsSportsBook(copyInfoResponse.requestInfo.issueTypeId.toString())) {
      return this.createWrongOddsSportsBookContent(copyInfoResponse);
    }

    return this.createOthersIssueTypeContent(copyInfoResponse);
  }

  private createReducedOversOrAbandonedContent(copyInfoResponse: CopyRequestInfoResponse): string {
    const groupBetTypes = _.groupBy(copyInfoResponse.betTypeTickets, "betTypeId");
    let outputContent = '';

    for (let key in groupBetTypes) {
      const values = groupBetTypes[key];
      const inputtedRunsText = values[0].inputtedRuns ? ` - Above ${values[0].inputtedRuns} should be voided` : '';
      const betTypeContent = `${values[0].betTypeName}${inputtedRunsText}\n`;

      let playerContent = values.map(element => element.playerName ? `${element.playerName} - ${element.ticketsCount} ticket(s)\n`
        : `${element.ticketsCount} ticket(s)\n`).join('');
      outputContent += `${betTypeContent}${playerContent}\n`;

    }

    return this.createCommonContent(copyInfoResponse, outputContent, '', false, false);
  }

  private createNotParticipateContent(copyInfoResponse: CopyRequestInfoResponse): string {
    const groupBetTypes = _.groupBy(copyInfoResponse.betTypeTickets, "betTypeId");
    let betTypeContent = '';

    for (let key in groupBetTypes) {
      const values = groupBetTypes[key];
      let currentContent = `${values[0].betTypeName}\n`;
      let playerContent = values.map(element => `${element.playerName} - ${element.ticketsCount} ticket(s)\n`).join('');
      betTypeContent += `${currentContent}${playerContent}\n`;
    }

    return this.createCommonContent(copyInfoResponse, betTypeContent, '', false, false);
  }

  private createWrongMarketOfferedContent(copyInfoResponse: CopyRequestInfoResponse): string {
    const betTypeContent = this.generateBetTypeContent(copyInfoResponse.betTypeTickets);
    return this.createCommonContent(copyInfoResponse, betTypeContent, '', true, true);
  }

  private createTechnicalErrorContent(copyInfoResponse: CopyRequestInfoResponse): string {
    const betTypeContent = this.generateBetTypeContent(copyInfoResponse.betTypeTickets);
    return this.createCommonContent(copyInfoResponse, betTypeContent, '', true, false);
  }

  private createWrongOddsSportsBookContent(copyInfoResponse: CopyRequestInfoResponse): string {
    const betTypeContent = this.generateBetTypeContent(copyInfoResponse.betTypeTickets);
    const oddsContent = this.generateOddsContent(copyInfoResponse.requestInfo);

    return this.createCommonContent(copyInfoResponse, betTypeContent, oddsContent, true, false);
  }

  private generateBetTypeContent(betTypeTickets: BetTypeTicketsInfo[]): string {
    const groupBetTypes = _.groupBy(betTypeTickets, item => `"${item.betTypeId}+${item.betId}"`);
    let betTypeContent = '';

    for (let key in groupBetTypes) {
      const values = groupBetTypes[key];
      let currentContent = `${values[0].betTypeName}\n`;
      let playerContent = values.map(element => `${element.playerName ? (element.playerName + ' - ') : ''}${element.ticketsCount} ticket(s)\n`).join('');
      betTypeContent += `${currentContent}${playerContent}\n`;
    }

    return betTypeContent;
  }

  private generateOddsContent(requestInfo: RequestInfoForCopy): string {
    const wrongOdds = requestInfo.filterOddsType === FilterOddsTypeConstant.RANGE
      ? `${requestInfo.fromOdds} -> ${requestInfo.toOdds}` : requestInfo.oddsValue;

    return `Wrong Odds: ${wrongOdds}\nCorrect Odds: ${requestInfo.correctOdds}\n`;
  }

  private createCommonContent(copyInfoResponse: CopyRequestInfoResponse, betTypeContent: string, oddsContent: string, isShowCancelCOCount: boolean, isShowMistakenBy: boolean): string {
    const cancelCashOutCount = isShowCancelCOCount ? `, Cancel Cash Out: ${copyInfoResponse.requestInfo.totalCancelCashOutCount}` : '';
    const content = `Hi CSD, please void${copyInfoResponse.requestInfo.liveStatus}tickets for us\n`
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
      + `Provider: ${StaticService.getProviderInfo(copyInfoResponse.requestInfo)}\n`
      + `Start Void Time: ${moment(copyInfoResponse.requestInfo.voidFromTime)
        .format(DateTimeFormat.TIME_FORMAT)} (${copyInfoResponse.requestInfo.filterBy === TVSRequestFilterBy.CHECK_TIME ? "Accept time" : "Trans time"})`

    return content;
  }

  private generateMistakenBy(requestInfo: RequestInfoForCopy, isShowMistakenBy: boolean): string {
    return isShowMistakenBy ? `Mistaken By: ${requestInfo.mistakenBy}\n\n` : '\n';
  }
}
