import { inject, Injectable } from '@angular/core';
import { TemplateMessageComponent } from '../../../utility/components/template-message/template-message/template-message.component';
import { LABELS } from '../../../utility/constants/labels';
import { Result } from '../../../utility/models/result';
import { ResultModelService } from '../../../utility/services/result-model.service';
import { StaticService } from '../../../utility/services/static.service';
import { MessageAreaComponent } from '../message-area/message-area.component';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { VoidPageCommonItem } from '../models/void-page-common-item.model';
import { CheckRequestService } from '../services/check-request.service';
import { PopupService } from '../services/popup.service';
import { CheckVoidPermissionService } from './check-void-permission.service';
import { InsertQueueService } from './insert-queue.service';
import { LogChangeContentService } from './log-change-content.service';

@Injectable(
  { providedIn: 'root' }
)
export class SubmitVoidService {
  popupService = inject(PopupService);
  insertQueueService = inject(InsertQueueService);
  checkRequestService = inject(CheckRequestService);
  checkVoidPermissionService = inject(CheckVoidPermissionService);
  logChangeContentService = inject(LogChangeContentService);

  public async submitVoid(messageAreaComponents: MessageAreaComponent[], voidPageItems: VoidPageCommonItem[],
    primitiveProperty: CommonPrimitiveProperty): Promise<void> {
    primitiveProperty.isBlockUI = true;
    const validation = this.checkValidationBeforeVoid(voidPageItems, messageAreaComponents);
    primitiveProperty.errorMessage = validation.errorMsg;
    if (validation.isSuccessful) {
      this.popupService.showVoidBetConfirm(this.getConfirmMessage(voidPageItems, messageAreaComponents),
        async () => {
          this.checkRequestModified(voidPageItems, primitiveProperty, messageAreaComponents);
        });
    }

    primitiveProperty.isBlockUI = false;
  }

  private async checkRequestModified(voidPageItem: VoidPageCommonItem[], primitiveProperty: CommonPrimitiveProperty, messageAreaComponents: MessageAreaComponent[]): Promise<void> {
    primitiveProperty.isBlockUI = true;
    const isRequestModified = await this.checkRequestService.isRequestModified(voidPageItem[0].detailViewModel.requestId, voidPageItem[0].detailViewModel.lastModifiedDate);
    if (!isRequestModified) {
      await this.reCheckVoidBetPermission(voidPageItem, primitiveProperty, messageAreaComponents);
    }
    primitiveProperty.isBlockUI = false;
  }

  private async reCheckVoidBetPermission(voidPageItems: VoidPageCommonItem[], primitiveProperty: CommonPrimitiveProperty, messageAreaComponents: MessageAreaComponent[]): Promise<void> {
    const validation = await this.checkVoidPermissionService.checkVoidBetPermission(voidPageItems);
    if (validation.isSuccessful) {
      await this.logChangeContentService.writeLog(voidPageItems[0].detailViewModel.request.requestId, messageAreaComponents)
      await this.processVoid(voidPageItems, primitiveProperty);
    } else {
      this.popupService.showWarningVoidBetPermission(validation.errorMsg);
    }
  }

  private async processVoid(voidPageItems: VoidPageCommonItem[], primitiveProperty: CommonPrimitiveProperty): Promise<void> {
    const insertQueueResult = await this.insertQueueService.insertQueue(voidPageItems, primitiveProperty.userName, primitiveProperty.userPassword);
    if (insertQueueResult.isSuccessful) {
      this.popupService.showSubmitVoidRequestSuccess();
    } else {
      this.popupService.showSubmitVoidRequestError(insertQueueResult);
    }
  }

  private checkValidationBeforeVoid(voidPageItems: VoidPageCommonItem[], messageAreaComponents: MessageAreaComponent[]): Result<null> {
    if (voidPageItems.every(x => x.voidTicketsMini.total === 0)) {
      return ResultModelService.createFailResult(LABELS.ALL_TICKETS_VOIDED, 1);
    }

    return this.issueTypesHaveMessage(voidPageItems)
      ? this.validateIssueTypeHaveMessage(voidPageItems, messageAreaComponents)
      : this.validateIssueTypeHaveNotMessage(voidPageItems);
  }

  private validateIssueTypeHaveNotMessage(voidPageItems: VoidPageCommonItem[]): Result<null> {
    for (const item of voidPageItems) {
      const textInvalidMatch = item.matchModel ? ` (MatchId: ${item.matchModel.matchId})` : '';
      if (item.voidReason?.reasonEnglish === '' || item.voidReason?.reasonChineseSimplified === '') {
        return ResultModelService.createFailResult(`${LABELS.INPUT_REASON}${textInvalidMatch}`, 1);
      }
    }

    return ResultModelService.createSuccessResult();
  }

  private validateIssueTypeHaveMessage(voidPageItems: VoidPageCommonItem[], messageAreaComponents: MessageAreaComponent[]): Result<null> {
    for (const item of voidPageItems) {
      const messageComponent = item.matchModel
        ? messageAreaComponents.map(x => x.templateMessageComponent).find(x => x.id === item.id)
        : messageAreaComponents[0].templateMessageComponent;
      const textInvalidMatch = item.matchModel ? ` (MatchId: ${item.matchModel.matchId})` : '';

      if (!messageComponent.checkValidation()) {
        return ResultModelService.createFailResult(`${LABELS.INVALID_TEMPLATE_MESSAGE}${textInvalidMatch}`, 1);
      }

      this.mapValidMessageToVoidPageItem(item, messageComponent);

      if (item.voidReason?.reasonEnglish === '' || item.voidReason?.reasonChineseSimplified === '') {
        return ResultModelService.createFailResult(`${LABELS.INPUT_REASON}${textInvalidMatch}`, 1);
      }
    }

    return ResultModelService.createSuccessResult();
  }

  private mapValidMessageToVoidPageItem(voidPageItem: VoidPageCommonItem, templateMessageComponent: TemplateMessageComponent) {
    voidPageItem.templateMessage = templateMessageComponent.message;
  }

  private getConfirmMessage(voidPageItems: VoidPageCommonItem[], messageAreaComponents: MessageAreaComponent[]): string {
    const warningInputs = this.issueTypesHaveMessage(voidPageItems)
      ? this.getWarningInputsInTemplateMessage(voidPageItems, messageAreaComponents.map(x => x.templateMessageComponent))
      : '';

    return `${warningInputs}<div>${LABELS.CONFIRM_VOID_ALL_TICKETS}</div>`;
  }

  private getWarningInputsInTemplateMessage(voidPageItem: VoidPageCommonItem[], templateMessageComponents: TemplateMessageComponent[]): string {
    if (templateMessageComponents.some(x => x.isHasWarningForDynamicInput())) {
      const matchesHaveWarning = this.getMatchesHaveWarning(voidPageItem, templateMessageComponents);
      if (matchesHaveWarning.length > 0) {
        const matchIdList = `- Match Id: ${matchesHaveWarning.join(', ')}`;
        const warningMessage = `<div><i class="fa fa-exclamation-triangle pt-2 text-warn"></i>There are some message info you do not input in these matches:</div>
                                    <div>${matchIdList}</div></br>`;

        return warningMessage;
      }
    }

    return '';
  }

  private getMatchesHaveWarning(voidPageItems: VoidPageCommonItem[], templateMessageComponents: TemplateMessageComponent[]): number[] {
    const voidPageItemsHasTickets = voidPageItems.filter(item => item.voidTicketsMini.total > 0);
    const matchHasWarning = voidPageItemsHasTickets.filter(voidPageItem =>
      templateMessageComponents.find(x => x.id === voidPageItem.id).isHasWarningForDynamicInput());

    return matchHasWarning.map(x => x.matchModel.matchId);
  }

  private issueTypesHaveMessage(voidPageItems: VoidPageCommonItem[]) {
    return !StaticService.isArchivedTicket(voidPageItems[0]?.detailViewModel?.request?.issueTypeId);
  }
}
