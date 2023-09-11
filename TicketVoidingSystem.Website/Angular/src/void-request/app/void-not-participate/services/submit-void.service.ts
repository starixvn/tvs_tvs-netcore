import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import moment from 'moment-timezone';
import { TemplateMessageComponent } from '../../../../utility/components/template-message/template-message/template-message.component';
import { LABELS } from '../../../../utility/constants/labels';
import { Result } from '../../../../utility/models/result';
import { PasswordService } from '../../../../utility/services/password.service';
import { ResultModelService } from '../../../../utility/services/result-model.service';
import { AppService } from '../../app.service';
import { CommonPrimitiveProperty } from '../../models/common-primitive-property.model';
import { VoidPageCommonItem } from '../../models/void-page-common-item.model';
import { VoidTicketsQuery } from '../../models/void-tickets.query';
import { CheckRequestService } from '../../services/check-request.service';
import { PopupService } from '../../services/popup.service';
import { VoidNotParticipateModel } from '../models/void-page-not-participate.model';
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root'
})
export class SubmitVoidService {
  constructor(
    private readonly appService: AppService,
    private readonly popupService: PopupService,
    private readonly passwordService: PasswordService,
    private readonly validationService: ValidationService,
    private readonly checkRequestService: CheckRequestService
  ) { }

  public async voidDuplicateTickets(templateMessageComponent: TemplateMessageComponent, voidPageItem: VoidNotParticipateModel,
    primitiveProperty: CommonPrimitiveProperty): Promise<void> {
    primitiveProperty.isBlockUI = true;
    const validation = this.validationService.checkValidationBeforeVoid(voidPageItem, templateMessageComponent);
    primitiveProperty.errorMessage = validation.errorMsg;
    if (validation.isSuccessful) {
      this.popupService.showVoidBetConfirm(
        this.getConfirmMessage(),
        async () => {
          this.checkRequestModified(voidPageItem, primitiveProperty);
        });
    }

    primitiveProperty.isBlockUI = false;
  }

  private async checkRequestModified(voidPageItem: VoidNotParticipateModel, primitiveProperty: CommonPrimitiveProperty): Promise<void> {
    primitiveProperty.isBlockUI = true;
    const isRequestModified = await this.checkRequestService.isRequestModified(voidPageItem.detailViewModel.requestId, voidPageItem.detailViewModel.lastModifiedDate);
    if (!isRequestModified) {
      await this.reCheckVoidBetPermission(voidPageItem, primitiveProperty);
    }
    primitiveProperty.isBlockUI = false;
  }

  private async reCheckVoidBetPermission(voidPageItem: VoidNotParticipateModel,
    primitiveProperty: CommonPrimitiveProperty): Promise<void> {
    const validation = await this.validationService.checkVoidBetPermission(voidPageItem);
    if (validation.isSuccessful) {
      await this.processVoid(voidPageItem, primitiveProperty);
    } else {
      this.popupService.showWarningVoidBetPermission(validation.errorMsg);
    }
  }

  private async processVoid(voidPageItem: VoidNotParticipateModel, primitiveProperty: CommonPrimitiveProperty): Promise<void> {
    const insertQueueResult = await this.insertQueue(voidPageItem, primitiveProperty.userName, primitiveProperty.userPassword);
    if (insertQueueResult.isSuccessful) {
      this.popupService.showSubmitVoidRequestSuccess();
    } else {
      this.popupService.showSubmitVoidRequestError(insertQueueResult);
    }
  }

  private async insertQueue(voidPageItem: VoidNotParticipateModel, userName: string, userPassword: string): Promise<Result<null>> {
    const voidQuery = this.getVoidQuery(voidPageItem, userName, userPassword);
    const result = await this.appService.insertQueue(voidQuery);

    if (!result.isSuccessful) {
      return ResultModelService.createFailResult(result.errorMsg, result.errorCode);
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

  private getConfirmMessage(): string {
    return `<div>${LABELS.CONFIRM_VOID_ALL_TICKETS}</div>`;
  }
}
