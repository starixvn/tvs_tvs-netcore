import { inject, Injectable } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { TemplateMessageComponent } from '../../../utility/components/template-message/template-message/template-message.component';
import { MessageAreaComponent } from '../message-area/message-area.component';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { VoidPageCommonItem } from '../models/void-page-common-item.model';
import { CheckRequestService } from '../services/check-request.service';
import { SubmitVoidService } from './submit-void.service';
import { TicketsService } from './tickets.service';

@Injectable(
  { providedIn: 'root' }
)
export class LoadDataService {
  submitVoidService = inject(SubmitVoidService);
  ticketsService = inject(TicketsService);
  checkRequestService = inject(CheckRequestService);

  private readonly observableTimer = timer(0, 100);

  async onClickShowVoidTickets(voidPageItem: VoidPageCommonItem, requestDetail: RequestDetailViewModel, primitiveProperty: CommonPrimitiveProperty, allVoidPageItems?: VoidPageCommonItem[]): Promise<void> {
    if (!voidPageItem.isShowTicketFull) {
      primitiveProperty.isBlockUI = true;
      const isRequestModified = await this.checkRequestService.isRequestModified(requestDetail.requestId, requestDetail.lastModifiedDate);
      primitiveProperty.isBlockUI = false;
      if (isRequestModified) {
        return;
      }
    }

    this.toggleTicketsArea(voidPageItem, allVoidPageItems);
    if (!voidPageItem.isLoadedTicketFull) {
      await this.ticketsService.loadVoidTicketsFullOnFirstTime(voidPageItem, requestDetail);
    }
  }

  async checkLoadedFullDataBeforeShowMessageTemplate(voidPageItem: VoidPageCommonItem, primitiveProperty: CommonPrimitiveProperty,
    afterLoadUnderneathDataSubscription: Subscription, allVoidPageItems?: VoidPageCommonItem[]): Promise<void> {
    if (primitiveProperty.isRunningSubscriptionCallback) {
      return;
    }
    primitiveProperty.isRunningSubscriptionCallback = true;
    primitiveProperty.isBlockUI = true;

    if (primitiveProperty.isLoadedUnderneathData) {
      this.toggleTemplateMessageArea(voidPageItem, allVoidPageItems);
      primitiveProperty.isBlockUI = false;
      afterLoadUnderneathDataSubscription.unsubscribe();
    }

    primitiveProperty.isRunningSubscriptionCallback = false;
  }

  async checkLoadedFullDataBeforeVoid(voidPageItems: VoidPageCommonItem[], messageAreaComponents: MessageAreaComponent[], primitiveProperty: CommonPrimitiveProperty,
    afterLoadUnderneathDataSubscription: Subscription): Promise<void> {
    if (primitiveProperty.isRunningSubscriptionCallback) {
      return;
    }

    primitiveProperty.isRunningSubscriptionCallback = true;
    primitiveProperty.isBlockUI = true;
    if (primitiveProperty.isLoadedUnderneathData && messageAreaComponents.every(x => this.isValidTemplcateMessage(x.templateMessageComponent))) {
      const voidPageItemsHaveTickets = voidPageItems.filter(item => item.voidTicketsMini.total > 0);
      const messageAreaHaveTickets = messageAreaComponents.filter(item => item.totalVoidTickets > 0);
      await this.submitVoidService.submitVoid(messageAreaHaveTickets, voidPageItemsHaveTickets, primitiveProperty);
      afterLoadUnderneathDataSubscription.unsubscribe();
    }
    primitiveProperty.isBlockUI = false;
    primitiveProperty.isRunningSubscriptionCallback = false;
  }

  async onClickShowTemplateMessage(voidPageItem: VoidPageCommonItem, primitiveProperty: CommonPrimitiveProperty, requestDetail: RequestDetailViewModel,
    afterLoadUnderneathDataSubscription: Subscription, allVoidPageItems?: VoidPageCommonItem[]): Promise<void> {
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
      await this.checkLoadedFullDataBeforeShowMessageTemplate(voidPageItem, primitiveProperty, afterLoadUnderneathDataSubscription, allVoidPageItems);
    });
  }

  private toggleTemplateMessageArea(voidPageItem: VoidPageCommonItem, allVoidPageItems?: VoidPageCommonItem[]): void {
    const currentIsShowTemplateMessage = voidPageItem.isShowTemplateMessage;
    const currentIsShowTicketFull = voidPageItem.isShowTicketFull;
    if (allVoidPageItems) {
      allVoidPageItems.forEach(x => {
        x.isShowTemplateMessage = false;
        x.isShowTicketFull = false;
      })
    }
    voidPageItem.isShowTicketFull = currentIsShowTicketFull;
    voidPageItem.isShowTemplateMessage = !currentIsShowTemplateMessage;
  }

  private toggleTicketsArea(voidPageItem: VoidPageCommonItem, allVoidPageItems?: VoidPageCommonItem[]): void {
    const currentIsShowTicketFull = voidPageItem.isShowTicketFull;
    const currentIsShowTemplateMessage = voidPageItem.isShowTemplateMessage;
    if (allVoidPageItems) {
      allVoidPageItems.forEach(x => {
        x.isShowTemplateMessage = false;
        x.isShowTicketFull = false;
      })
    }
    voidPageItem.isShowTicketFull = !currentIsShowTicketFull;
    voidPageItem.isShowTemplateMessage = currentIsShowTemplateMessage;
  }

  private isValidTemplcateMessage(templateMessageViewChilds: TemplateMessageComponent): boolean {
    return templateMessageViewChilds ? templateMessageViewChilds.initialize : true; // undefined when all tickets has been voided
  }
}
