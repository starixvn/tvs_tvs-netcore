import { Injectable } from '@angular/core';
import moment from 'moment-timezone';
import { AcceptType, DateTimeFormat } from '../../../../utility/constants/config';
import { CopyRequestInfoQuery, CopyRequestInfoResponse } from '../../../../utility/models/copy-request-info.query';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { CommonService } from '../../../../utility/services/common.service';
import { OperatorInfo, OperatorType } from '../others/others.model';

@Injectable({
  providedIn: 'root'
})
export class CopyRequestInfoService {
  constructor(private readonly commonService: CommonService) { }

  async copyEmailRequestInfo(requestId: number, matchId: number, operatorsList: OperatorInfo[]) {
    const query: CopyRequestInfoQuery = {
      requestId: requestId,
      matchId: matchId
    };
    const requestInfo = await this.commonService.copyRequestInfo(query);
    const emailContent = this.createContentEmail(requestInfo, operatorsList);
    const type = "text/html";
    const blob = new Blob([emailContent], { type });
    const data = [new ClipboardItem({ [type]: blob })];
    navigator.clipboard.write(data);
  }

  async copyLetstalkRequestInfo(requestId: number, matchId: number, logInfoDetail: LogInfoDetail[], operatorsList: OperatorInfo[]) {
    const query: CopyRequestInfoQuery = {
      requestId: requestId,
      matchId: matchId,
      logInfoDetails: logInfoDetail
    };
    const requestInfo = await this.commonService.copyRequestInfo(query);
    navigator.clipboard.writeText(this.createContentLetstalk(requestInfo, logInfoDetail, operatorsList));
  }

  private createContentLetstalk(requestInfo: CopyRequestInfoResponse, logInfoDetail: LogInfoDetail[], operatorsList: OperatorInfo[]): string {
    const momentGlobalShowTime = moment(requestInfo.globalShowTime);
    const content = `Date: ${momentGlobalShowTime.format(DateTimeFormat.DATE_MONTH_YEAR)}\n`
      + `Time (GMT+8): ${momentGlobalShowTime.format(DateTimeFormat.SHORT_TIME_FORMAT)}\n`
      + `League: ${requestInfo.leagueName}\n`
      + `Match: ${requestInfo.matchEvent}\n`
      + `Trader: ${this.getOperatorName(requestInfo.operators, operatorsList, OperatorType.TRADER)}\n`
      + `Suspender: ${this.getOperatorName(requestInfo.operators, operatorsList, OperatorType.SUSPENDER)}\n`
      + `Provider: ${requestInfo.provider}\n`
      + `Issue Type: ${requestInfo.issueTypeName} - ${requestInfo.subIssueTypeName}\n`
      + `Handle by: ${requestInfo.requestedBy}\n`
      + `Void settled ticket: ${requestInfo.isHasSettledTicket ? 'Yes' : 'No'}\n`
      + `Void Info:`
      + `${this.getVoidInfo(logInfoDetail)}\n`
      + `Details: ${requestInfo.remark}`;

    return content;
  }

  private getVoidInfo(logInfoDetails: LogInfoDetail[]): string {
    let voidInfo = '';
    logInfoDetails.forEach(x => {
      const minTimeValue = this.getMinTime(x);
      const item = `From: ${moment(x.voidFromTime).format(DateTimeFormat.TIME_FORMAT)} To: ${moment(x.voidToTime).format(DateTimeFormat.TIME_FORMAT)}\n`
        + `Live Score: ${x.liveScores}. Affected Single Count: ${x.singleCount}, Parlay Count: ${x.mainParlayCount}, Min Time: ${minTimeValue}\n`
        + `Cancel Cash Out: ${x.cancelCashOutCount}`

      voidInfo = `${voidInfo}\n${item}`;
    })

    return voidInfo;
  }

  private getMinTime(logInfoDetail: LogInfoDetail): string {
    if (logInfoDetail.highlightAcceptType && logInfoDetail.highlightMinTime) {
      return `${moment(logInfoDetail.highlightMinTime).format(DateTimeFormat.TIME_FORMAT)} - ${this.getAcceptType(logInfoDetail.highlightAcceptType)}`;
    }

    return '-';
  }

  private getAcceptType(highlightAcceptType: number): string {
    if (highlightAcceptType === AcceptType.AUTO_ACCEPT) {
      return 'AA';
    }
    if (highlightAcceptType === AcceptType.SECOND_ACCEPT) {
      return 'SA';
    }
    if (highlightAcceptType === AcceptType.PENDING_ACCEPT) {
      return 'PA';
    }

    return '';
  }

  private createContentEmail(requestInfo: CopyRequestInfoResponse, operatorsList: OperatorInfo[]): string {
    const momentGlobalShowTime = moment(requestInfo.globalShowTime);
    const content =
      `<table border=\"1\" style=\"border-collapse: collapse;\">`
      + `<tr><th>No.</th><th>Label</th><th>Info</th></tr>`
      + `<tr><th>1</th><th style="text-align: left">Title</th><th style="text-align: left"></th></tr>`
      + `<tr><th>2</th><th style="text-align: left">Date<th style="text-align: left">${momentGlobalShowTime.format(DateTimeFormat.DATE_MONTH_YEAR)}</th></tr>`
      + `<tr><th>3</th><th style="text-align: left">Time (GMT+8)</th><th style="text-align: left">${momentGlobalShowTime.format(DateTimeFormat.SHORT_TIME_FORMAT)}</th></tr>`
      + `<tr><th>4</th><th style="text-align: left">League</th><th style="text-align: left">${requestInfo.leagueName}</th></tr>`
      + `<tr><th>5</th><th style="text-align: left">Match</th><th style="text-align: left">${requestInfo.matchEvent}</th></tr>`
      + `<tr><th>6</th><th style="text-align: left">Maxbet</th><th style="text-align: left"></th></tr>`
      + `<tr><th>7</th><th style="text-align: left">Trader</th><th style="text-align: left">${this.getOperatorName(requestInfo.operators, operatorsList, OperatorType.TRADER)}</th></tr>`
      + `<tr><th>8</th><th style="text-align: left">Suspender</th><th style="text-align: left">${this.getOperatorName(requestInfo.operators, operatorsList, OperatorType.SUSPENDER)}</th></tr>`
      + `<tr><th>9</th><th style="text-align: left">Provider</th><th style="text-align: left">${requestInfo.provider}</th></tr>`
      + `<tr><th>10</th><th style="text-align: left">Issue Type</th><th style="text-align: left">${requestInfo.issueTypeName} - ${requestInfo.subIssueTypeName}</th></tr>`
      + `<tr><th>11</th><th style="text-align: left">Problem</th><th style="text-align: left"></th></tr>`
      + `<tr><th>12</th><th style="text-align: left">Handle by</th><th style="text-align: left">${requestInfo.requestedBy}</th></tr>`
      + `<tr><th>13</th><th style="text-align: left">Market</th><th style="text-align: left"></th></tr>`
      + `<tr><th>14</th><th style="text-align: left">Suspender info</th><th style="text-align: left"></th></tr>`
      + `<tr><th>15</th><th style="text-align: left">Supervisor</th><th style="text-align: left"></th></tr>`
      + `<tr><th>16</th><th style="text-align: left">S&V</th><th style="text-align: left"></th></tr>`
      + `<tr><th>17</th><th style="text-align: left">CSD</th><th style="text-align: left"></th></tr>`
      + `<tr><th>18</th><th style="text-align: left">Source download</th><th style="text-align: left"></th></tr>`
      + `<tr><th>19</th><th style="text-align: left">Void settled ticket</th><th style="text-align: left">${requestInfo.isHasSettledTicket ? 'Yes' : 'No'}</th></tr>`
      + `</table>`;

    return content;
  }

  private getOperatorName(selectedOperator: OperatorInfo[], operatorsList: OperatorInfo[], type: number): string {
    return operatorsList.filter(x => x.operatorType === type && selectedOperator.map(y => y.operatorId).includes(x.operatorId))
      .map(t => t.userName).join(', ');
  }
}