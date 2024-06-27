import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import moment from 'moment-timezone';
import { RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { Result } from '../../../../utility/models/result';
import { PasswordService } from '../../../../utility/services/password.service';
import { ResultModelService } from '../../../../utility/services/result-model.service';
import { AppService } from '../../app.service';
import { MessageAreaComponent } from '../../message-area/message-area.component';
import { PrimitiveProperty } from '../../models/primitive-property.model';
import { VoidMatch } from '../../models/void-match.model';
import { VoidTicketsQuery } from '../../models/void-tickets.query';
import { CheckRequestService } from '../../services/check-request.service';
import { LogChangeContentService } from '../../services/log-change-content.service';
import { PopupService } from './popup.service';
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root'
})
export class SubmitVoidService {
  constructor(
    private readonly validationService: ValidationService,
    private readonly popupService: PopupService,
    private readonly checkRequestService: CheckRequestService,
    private readonly appService: AppService,
    private readonly passwordService: PasswordService,
    private readonly logChangeContentService: LogChangeContentService) { }

  public async voidAllMatches(messageAreaComponents: MessageAreaComponent[], voidMatches: VoidMatch[],
    requestDetail: RequestDetailViewModel, primitiveProperty: PrimitiveProperty): Promise<void> {
    primitiveProperty.isBlockUI = true;
    const matchHasTickets = voidMatches.filter(item => item.voidTicketsMini.total > 0);
    const validation = this.validationService.checkValidationBeforeVoid(matchHasTickets, messageAreaComponents);
    primitiveProperty.errorMessage = validation.errorMsg;
    if (validation.isSuccessful) {
      this.popupService.showVoidBetConfirm(matchHasTickets, messageAreaComponents.map(x => x.templateMessageComponent),
        async () => { this.checkRequestModified(matchHasTickets, requestDetail, primitiveProperty, messageAreaComponents); });
    }

    primitiveProperty.isBlockUI = false;
  }

  private async checkRequestModified(matchHasTickets: VoidMatch[], requestDetail: RequestDetailViewModel,
    primitiveProperty: PrimitiveProperty, messageAreaComponents: MessageAreaComponent[]): Promise<void> {
    primitiveProperty.isBlockUI = true;
    const isRequestModified = await this.checkRequestService.isRequestModified(requestDetail.requestId, requestDetail.lastModifiedDate);
    if (!isRequestModified) {
      await this.reCheckVoidBetPermission(matchHasTickets, requestDetail, primitiveProperty, messageAreaComponents);
    }
    primitiveProperty.isBlockUI = false;
  }

  private async reCheckVoidBetPermission(matchHasTickets: VoidMatch[], requestDetail: RequestDetailViewModel,
    primitiveProperty: PrimitiveProperty, messageAreaComponents: MessageAreaComponent[]): Promise<void> {
    const validation = await this.validationService.checkVoidBetPermission(matchHasTickets, requestDetail.request.issueTypeId);
    if (validation.isSuccessful) {
      await this.logChangeContentService.writeLog(requestDetail.request.requestId, messageAreaComponents)
      await this.processVoid(matchHasTickets, requestDetail, primitiveProperty);
    } else {
      this.popupService.showWarningVoidBetPermission(validation.errorMsg);
    }
  }

  private async processVoid(matchHasTickets: VoidMatch[], requestDetail: RequestDetailViewModel, primitiveProperty: PrimitiveProperty): Promise<void> {
    const insertQueueResult = await this.insertQueue(matchHasTickets, requestDetail, primitiveProperty.userName, primitiveProperty.userPassword);
    if (insertQueueResult.isSuccessful) {
      this.popupService.showSubmitVoidRequestSuccess();
    } else {
      this.popupService.showSubmitVoidRequestError(insertQueueResult);
    }
  }

  private async insertQueue(matchHasTickets: VoidMatch[], requestDetail: RequestDetailViewModel, userName: string, userPassword: string): Promise<Result<null>> {
    for (const item of matchHasTickets) {
      const voidQuery = this.getVoidQuery(item, requestDetail, userName, userPassword);
      const result = await this.appService.insertQueue(voidQuery);

      if (!result.isSuccessful) {
        return ResultModelService.createFailResult(result.errorMsg, result.errorCode);
      }
    }

    return ResultModelService.createSuccessResult();
  }

  private getVoidQuery(voidMatch: VoidMatch, requestDetail: RequestDetailViewModel, userName: string, userPassword: string): VoidTicketsQuery {
    const voidQuery: VoidTicketsQuery = {
      requestId: requestDetail.requestId,
      singleTickets: voidMatch.voidTicketsMini.singleTickets.filter(x => !voidMatch.voidTicketsMini.uncheckedTransIds.includes(x.transId)),
      parlayTickets: voidMatch.voidTicketsMini.parlayTickets.filter(x => !voidMatch.voidTicketsMini.uncheckedTransIds.includes(x.transId)),
      cancelCashOutTickets: voidMatch.voidTicketsMini.cancelCashOutTickets.filter(x => !voidMatch.voidTicketsMini.uncheckedTransIds.includes(x.transId)),
      cricketTickets: voidMatch.voidTicketsMini.cricketTickets,
      userName: userName,
      userPassword: this.passwordService.hash(userPassword),
      reason: voidMatch.voidReason.reasonEnglish,
      reasonSC: voidMatch.voidReason.reasonChineseSimplified,
      message: voidMatch.templateMessage,
      matchId: voidMatch.matchModel.matchId,
      subIssueTypeId: voidMatch.subIssueType.subIssueTypeId,
      subIssueTypeName: voidMatch.subIssueType.subIssueTypeName,
      subIssueTypeNameCS: voidMatch.subIssueType.subIssueTypeNameCS,
      issueTypeId: requestDetail.request.issueTypeId,
      isHasSettledTicket: voidMatch.voidTicketsMini.isHasSettledTicket,
      voidFromTime: moment(new Date(voidMatch.voidTicketsMini.fromTime)).format('hh:mm:ss A'),
      voidToTime: moment(new Date(voidMatch.voidTicketsMini.toTime)).format('hh:mm:ss A'),
      voidFromDate: moment(new Date(voidMatch.voidTicketsMini.fromDate)).format('MM/DD/YYYY'),
      voidToDate: moment(new Date(voidMatch.voidTicketsMini.toDate)).format('MM/DD/YYYY'),
      decidedBy: requestDetail.request.decidedBy,
      guid: Guid.create().toString()
    };

    return voidQuery;
  }
}
