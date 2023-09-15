import { Injectable } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { TemplateMessageComponent } from '../../../utility/components/template-message/template-message/template-message.component';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { VoidPageCommonItem } from '../models/void-page-common-item.model';
import { CheckRequestService } from '../services/check-request.service';
import { SubmitVoidService } from './submit-void.service';
import { TicketsService } from './tickets.service';

@Injectable({
  providedIn: 'root'
})
export class LoadDataService {
  constructor(
    private readonly submitVoidService: SubmitVoidService,
    private readonly ticketsService: TicketsService,
    private readonly checkRequestService: CheckRequestService
  ) { }
  private readonly observableTimer = timer(0, 100);

  async onClickShowVoidTickets(voidPageItem: VoidPageCommonItem, requestDetail: RequestDetailViewModel, primitiveProperty: CommonPrimitiveProperty): Promise<void> {
    if (!voidPageItem.isShowTicketFull) {
      primitiveProperty.isBlockUI = true;
      const isRequestModified = await this.checkRequestService.isRequestModified(requestDetail.requestId, requestDetail.lastModifiedDate);
      primitiveProperty.isBlockUI = false;
      if (isRequestModified) {
        return;
      }
    }

    this.toggleTicketsArea(voidPageItem);
    if (!voidPageItem.isLoadedTicketFull) {
      await this.ticketsService.loadVoidTicketsFullOnFirstTime(voidPageItem, requestDetail);
    }
  }

  async checkLoadedFullDataBeforeShowMessageTemplate(voidPageItem: VoidPageCommonItem, primitiveProperty: CommonPrimitiveProperty,
    afterLoadUnderneathDataSubscription: Subscription): Promise<void> {
    if (primitiveProperty.isRunningSubscriptionCallback) {
      return;
    }
    primitiveProperty.isRunningSubscriptionCallback = true;
    primitiveProperty.isBlockUI = true;

    if (primitiveProperty.isLoadedUnderneathData) {
      this.toggleTemplateMessageArea(voidPageItem);
      primitiveProperty.isBlockUI = false;
      afterLoadUnderneathDataSubscription.unsubscribe();
    }

    primitiveProperty.isRunningSubscriptionCallback = false;
  }

  async checkLoadedFullDataBeforeVoid(voidPageItems: VoidPageCommonItem[], templateMessageViewChilds: TemplateMessageComponent[], primitiveProperty: CommonPrimitiveProperty,
    afterLoadUnderneathDataSubscription: Subscription): Promise<void> {
    if (primitiveProperty.isRunningSubscriptionCallback) {
      return;
    }

    primitiveProperty.isRunningSubscriptionCallback = true;
    primitiveProperty.isBlockUI = true;
    if (primitiveProperty.isLoadedUnderneathData && templateMessageViewChilds.every(x => x.initialize)) {
      await this.submitVoidService.submitVoid(templateMessageViewChilds, voidPageItems, primitiveProperty);
      afterLoadUnderneathDataSubscription.unsubscribe();
    }
    primitiveProperty.isBlockUI = false;
    primitiveProperty.isRunningSubscriptionCallback = false;
  }

  async onClickShowTemplateMessage(voidPageItem: VoidPageCommonItem, primitiveProperty: CommonPrimitiveProperty, requestDetail: RequestDetailViewModel,
    afterLoadUnderneathDataSubscription: Subscription): Promise<void> {
    if (!voidPageItem.isShowTemplateMessage) {
      primitiveProperty.isBlockUI = true;
      const isRequestModified = await this.checkRequestService.isRequestModified(requestDetail.requestId, requestDetail.lastModifiedDate);
      primitiveProperty.isBlockUI = false;
      if (isRequestModified) {
        return;
      }
    }

    if (afterLoadUnderneathDataSubscription) {
      afterLoadUnderneathDataSubscription.unsubscribe();
    }

    afterLoadUnderneathDataSubscription = this.observableTimer.subscribe(async () => {
      await this.checkLoadedFullDataBeforeShowMessageTemplate(voidPageItem, primitiveProperty, afterLoadUnderneathDataSubscription);
    });
  }

  private toggleTemplateMessageArea(voidPageItem: VoidPageCommonItem): void {
    const currentIsShowTemplateMessage = voidPageItem.isShowTemplateMessage;
    const currentIsShowTicketFull = voidPageItem.isShowTicketFull;
    voidPageItem.isShowTicketFull = currentIsShowTicketFull;
    voidPageItem.isShowTemplateMessage = !currentIsShowTemplateMessage;
  }

  private toggleTicketsArea(voidPageItem: VoidPageCommonItem): void {
    const currentIsShowTicketFull = voidPageItem.isShowTicketFull;
    const currentIsShowTemplateMessage = voidPageItem.isShowTemplateMessage;
    voidPageItem.isShowTicketFull = !currentIsShowTicketFull;
    voidPageItem.isShowTemplateMessage = currentIsShowTemplateMessage;
  }
}
