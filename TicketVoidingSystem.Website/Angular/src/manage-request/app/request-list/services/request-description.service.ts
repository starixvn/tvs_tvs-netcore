import { Injectable } from '@angular/core';
import _ from 'lodash';
import moment from 'moment';
import { ClipboardService } from 'ngx-clipboard';
import { StaticService } from 'src/utility/services/static.service';
import { DateTimeFormat, TVSRequestFilterBy } from '../../../../utility/constants/config';
import { CopyRequestInfoQuery, CopyRequestInfoResponse } from '../../../../utility/models/copy-request-info.query';
import { CommonService } from '../../../../utility/services/common.service';

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
    if (StaticService.isReducedOver(copyInfoResponse.requestInfo.issueTypeId.toString())) {
      return this.createReducedOversOrAbandonedContent(copyInfoResponse);
    }

    if (StaticService.isNotParticipate(copyInfoResponse.requestInfo.issueTypeId.toString())) {
      return this.createNotParticipateContent(copyInfoResponse);
    }

    return this.createOthersIssueTypeContent(copyInfoResponse);
  }

  private createReducedOversOrAbandonedContent(copyInfoResponse: CopyRequestInfoResponse): string {
    const betTypeContent = copyInfoResponse.betTypeTickets
      .map(element => {
        const inputtedRunsText = element.inputtedRuns ? ` - ${element.inputtedRuns} and above should be voided` : '';
        return `${element.betTypeName}${inputtedRunsText}\n`
          + `${element.ticketsCount} ticket(s)\n\n`;
      }).join('');

    return this.createCommonContent(copyInfoResponse, betTypeContent);
  }

  private createNotParticipateContent(copyInfoResponse: CopyRequestInfoResponse): string {
    const groupBetTypes = _.groupBy(copyInfoResponse.betTypeTickets, "betTypeId");
    let betTypeContent = '';
    
    for (let key in groupBetTypes) {
      const values = groupBetTypes[key];
      let currentContent = `${values[0].betTypeName}\n`;
      var playerContent = values.map(element => `${element.playerName} - ${element.ticketsCount} ticket(s)\n`).join('');
      betTypeContent += `${currentContent}${playerContent}\n`;
    }

    return this.createCommonContent(copyInfoResponse, betTypeContent);
  }

  private createCommonContent(copyInfoResponse: CopyRequestInfoResponse, betTypeContent: string): string {
    const content = `Hi CSD, please void${copyInfoResponse.requestInfo.liveStatus}tickets for us\n`
      + `League: ${copyInfoResponse.requestInfo.leagueName}\n`
      + `Match: ${copyInfoResponse.requestInfo.matchEvent}\n`
      + `Match ID: ${copyInfoResponse.requestInfo.matchId}\n`
      + `Request No: ${copyInfoResponse.requestInfo.requestId}\n`
      + `Issue Type: ${copyInfoResponse.requestInfo.issueTypeName}\n\n`
      + betTypeContent
      + `Void Time: ${moment(copyInfoResponse.requestInfo.voidFromTime).format(DateTimeFormat.TIME_FORMAT)} - ${moment(copyInfoResponse.requestInfo.voidToTime).format(DateTimeFormat.TIME_FORMAT)} `
      + `(Single Count: ${copyInfoResponse.requestInfo.totalSingleCount}, Parlay Count: ${copyInfoResponse.requestInfo.totalParlayCount})\n`
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
      + `Provider: ${copyInfoResponse.requestInfo.provider}\n`
      + `Start Void Time: ${moment(copyInfoResponse.requestInfo.voidFromTime)
        .format(DateTimeFormat.TIME_FORMAT)} (${copyInfoResponse.requestInfo.filterBy === TVSRequestFilterBy.CHECK_TIME ? "Accept time" : "Trans time"})`

    return content;
  }
}
