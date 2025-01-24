import { inject } from '@angular/core';
import { Guid } from 'guid-typescript';
import moment from 'moment-timezone';
import { Result } from '../../../utility/models/result';
import { PasswordService } from '../../../utility/services/password.service';
import { ResultModelService } from '../../../utility/services/result-model.service';
import { AppService } from '../app.service';
import { VoidPageCommonItem } from '../models/void-page-common-item.model';
import { VoidTicketsQuery } from '../models/void-tickets.query';

export class InsertQueueService {
  appService = inject(AppService);
  passwordService = inject(PasswordService);

  public async insertQueue(voidPageItems: VoidPageCommonItem[], userName: string, userPassword: string): Promise<Result<null>> {
    for (const item of voidPageItems) {
      const voidQuery = this.getVoidQuery(item, userName, userPassword);
      const result = await this.appService.insertQueue(voidQuery);

      if (!result.isSuccessful) {
        return ResultModelService.createFailResult(result.errorMsg, result.errorCode);
      }
    }

    return ResultModelService.createSuccessResult();
  }

  private getVoidQuery(voidPageCommonItem: VoidPageCommonItem, userName: string, userPassword: string): VoidTicketsQuery {
    const voidQuery: VoidTicketsQuery = {
      requestId: voidPageCommonItem.detailViewModel.requestId,
      singleTickets: voidPageCommonItem.voidTicketsMini.singleTickets.filter(x => !voidPageCommonItem.voidTicketsMini.uncheckedTransIds.includes(x.transId)),
      parlayTickets: voidPageCommonItem.voidTicketsMini.parlayTickets.filter(x => !voidPageCommonItem.voidTicketsMini.uncheckedTransIds.includes(x.transId)),
      cancelCashOutTickets: voidPageCommonItem.voidTicketsMini.cancelCashOutTickets.filter(x => !voidPageCommonItem.voidTicketsMini.uncheckedTransIds.includes(x.transId)),
      cricketTickets: voidPageCommonItem.voidTicketsMini.cricketTickets,
      userName: userName,
      userPassword: this.passwordService.hash(userPassword),
      reason: voidPageCommonItem.voidReason?.reasonEnglish,
      reasonSC: voidPageCommonItem.voidReason?.reasonChineseSimplified,
      message: voidPageCommonItem.templateMessage,
      matchId: voidPageCommonItem.matchModel?.matchId,
      subIssueTypeId: voidPageCommonItem.subIssueType.subIssueTypeId,
      subIssueTypeName: voidPageCommonItem.subIssueType.subIssueTypeName,
      subIssueTypeNameCS: voidPageCommonItem.subIssueType.subIssueTypeNameCS,
      issueTypeId: voidPageCommonItem.detailViewModel.request.issueTypeId,
      isHasSettledTicket: voidPageCommonItem.voidTicketsMini.isHasSettledTicket,
      voidFromTime: moment(new Date(voidPageCommonItem.voidTicketsMini.fromTime)).format('hh:mm:ss A'),
      voidToTime: moment(new Date(voidPageCommonItem.voidTicketsMini.toTime)).format('hh:mm:ss A'),
      voidFromDate: moment(new Date(voidPageCommonItem.voidTicketsMini.fromDate)).format('MM/DD/YYYY'),
      voidToDate: moment(new Date(voidPageCommonItem.voidTicketsMini.toDate)).format('MM/DD/YYYY'),
      decidedBy: voidPageCommonItem.detailViewModel.request.decidedBy,
      guid: Guid.create().toString()
    };

    return voidQuery;
  }
}
