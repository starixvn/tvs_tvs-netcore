import { Injectable } from '@angular/core';
import { TemplateMessageComponent } from '../../../utility/components/template-message/template-message/template-message.component';
import { LABELS } from '../../../utility/constants/labels';
import { Result } from '../../../utility/models/result';
import { ResultModelService } from '../../../utility/services/result-model.service';
import { MessageAreaComponent } from '../message-area/message-area.component';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { VoidPageCommonItem } from '../models/void-page-common-item.model';
import { CheckRequestService } from '../services/check-request.service';
import { PopupService } from '../services/popup.service';
import { CheckVoidPermissionService } from './check-void-permission.service';
import { InsertQueueService } from './insert-queue.service';
import { LogChangeContentService } from './log-change-content.service';

@Injectable({
  providedIn: 'root'
})
export class SubmitVoidService {
  constructor(
    private readonly popupService: PopupService,
    private readonly insertQueueService: InsertQueueService,
    private readonly checkRequestService: CheckRequestService,
    private readonly checkVoidPermissionService: CheckVoidPermissionService,
    private readonly logChangeContentService: LogChangeContentService
  ) { }

  public async submitVoid(messageAreaComponents: MessageAreaComponent[], voidPageItems: VoidPageCommonItem[],
    primitiveProperty: CommonPrimitiveProperty): Promise<void> {
    primitiveProperty.isBlockUI = true;
    const validation = this.checkValidationBeforeVoid(voidPageItems, messageAreaComponents);
    primitiveProperty.errorMessage = validation.errorMsg;
    if (validation.isSuccessful) {
      this.popupService.showVoidBetConfirm(
        `<div>${LABELS.CONFIRM_VOID_ALL_TICKETS}</div>`,
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

    for (const item of voidPageItems) {
      const messageComponent = item.matchModel
        ? messageAreaComponents.map(x => x.templateMessageComponent).find(x => x.value.matchId === item.matchModel.matchId)
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
}
