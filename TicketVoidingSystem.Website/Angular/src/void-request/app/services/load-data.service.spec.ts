import { Subscription } from 'rxjs';
import { RequestDetailViewModel } from "../../../edit-request/app/request.model";
import { TemplateMessageComponent } from '../../../utility/components/template-message/template-message/template-message.component';
import { MessageAreaComponent } from '../message-area/message-area.component';
import { CommonPrimitiveProperty } from "../models/common-primitive-property.model";
import { VoidPageCommonItem } from "../models/void-page-common-item.model";
import { TicketsModel } from '../tickets-list/tickets.model';
import { CheckRequestService } from "./check-request.service";
import { LoadDataService } from "./load-data.service";
import { SubmitVoidService } from './submit-void.service';
import { TicketsService } from "./tickets.service";

describe('LoadDataService', () => {

  it('#onClickShowVoidTickets should return when isShowTicketFull & isRequestModified are incorrect', async () => {
    const voidPageCommonItem = new VoidPageCommonItem();
    voidPageCommonItem.isShowTicketFull = false;
    voidPageCommonItem.isLoadedTicketFull = true;
    const checkRequestService = new CheckRequestService(null, null);
    checkRequestService.isRequestModified = jest.fn().mockReturnValue(true);
    const service = new LoadDataService(null, null, checkRequestService);

    await service.onClickShowVoidTickets(voidPageCommonItem, new RequestDetailViewModel(), new CommonPrimitiveProperty());

    expect(checkRequestService.isRequestModified).toHaveBeenCalledTimes(1);
  });

  it('#onClickShowVoidTickets should return when isShowTicketFull is incorrect but isRequestModified is incorrect', async () => {
    const voidPageCommonItem = new VoidPageCommonItem();
    voidPageCommonItem.isShowTicketFull = false;
    voidPageCommonItem.isLoadedTicketFull = true;
    const checkRequestService = new CheckRequestService(null, null);
    checkRequestService.isRequestModified = jest.fn().mockReturnValue(false);
    const service = new LoadDataService(null, null, checkRequestService);

    await service.onClickShowVoidTickets(voidPageCommonItem, new RequestDetailViewModel(), new CommonPrimitiveProperty());

    expect(checkRequestService.isRequestModified).toHaveBeenCalledTimes(1);
  });

  it('#onClickShowVoidTickets should call #ticketsService.loadVoidTicketsFullOnFirstTime when isShowTicketFull is correct & isLoadedTicketFull is incorrect', async () => {
    const voidPageCommonItem = new VoidPageCommonItem();
    voidPageCommonItem.isShowTicketFull = true;
    voidPageCommonItem.isLoadedTicketFull = false;
    const checkRequestService = new CheckRequestService(null, null);
    checkRequestService.isRequestModified = jest.fn().mockReturnValue(true);
    const ticketsService = new TicketsService(null);
    ticketsService.loadVoidTicketsFullOnFirstTime = jest.fn();
    const service = new LoadDataService(null, ticketsService, checkRequestService);

    await service.onClickShowVoidTickets(voidPageCommonItem, new RequestDetailViewModel(), new CommonPrimitiveProperty());

    expect(ticketsService.loadVoidTicketsFullOnFirstTime).toHaveBeenCalledTimes(1);
  });

  it('#onClickShowVoidTickets should not call #ticketsService.loadVoidTicketsFullOnFirstTime when isShowTicketFull is correct & isLoadedTicketFull is incorrect', async () => {
    const voidPageCommonItem = new VoidPageCommonItem();
    voidPageCommonItem.isShowTicketFull = true;
    voidPageCommonItem.isLoadedTicketFull = true;
    const checkRequestService = new CheckRequestService(null, null);
    checkRequestService.isRequestModified = jest.fn().mockReturnValue(true);
    const ticketsService = new TicketsService(null);
    ticketsService.loadVoidTicketsFullOnFirstTime = jest.fn();
    const service = new LoadDataService(null, ticketsService, checkRequestService);

    await service.onClickShowVoidTickets(voidPageCommonItem, new RequestDetailViewModel(), new CommonPrimitiveProperty());

    expect(ticketsService.loadVoidTicketsFullOnFirstTime).toHaveBeenCalledTimes(0);
  });

  it('#checkLoadedFullDataBeforeShowMessageTemplate should return & not change isRunningSubscriptionCallback when #isRunningSubscriptionCallback is incorrect', async () => {
    const afterLoadUnderneathDataSubscription = new Subscription();
    const primitiveProperty = new CommonPrimitiveProperty();
    primitiveProperty.isRunningSubscriptionCallback = true;
    const voidPageCommonItem = new VoidPageCommonItem();
    voidPageCommonItem.isShowTemplateMessage = true;
    const service = new LoadDataService(null, null, null);

    await service.checkLoadedFullDataBeforeShowMessageTemplate(voidPageCommonItem, primitiveProperty, afterLoadUnderneathDataSubscription);

    expect(primitiveProperty.isRunningSubscriptionCallback).toBeTruthy();
  });

  it('#checkLoadedFullDataBeforeShowMessageTemplate should called afterLoadUnderneathDataSubscription.unsubscribe when isRunningSubscriptionCallback is false & isLoadedUnderneathData true', async () => {
    const afterLoadUnderneathDataSubscription = new Subscription();
    afterLoadUnderneathDataSubscription.unsubscribe = jest.fn();
    const primitiveProperty = new CommonPrimitiveProperty();
    primitiveProperty.isRunningSubscriptionCallback = false;
    primitiveProperty.isLoadedUnderneathData = true;
    const voidPageCommonItem = new VoidPageCommonItem();
    voidPageCommonItem.isShowTemplateMessage = true;
    const service = new LoadDataService(null, null, null);

    await service.checkLoadedFullDataBeforeShowMessageTemplate(voidPageCommonItem, primitiveProperty, afterLoadUnderneathDataSubscription);

    expect(afterLoadUnderneathDataSubscription.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('#checkLoadedFullDataBeforeShowMessageTemplate should called afterLoadUnderneathDataSubscription.unsubscribe when isRunningSubscriptionCallback & isLoadedUnderneathData are false', async () => {
    const afterLoadUnderneathDataSubscription = new Subscription();
    afterLoadUnderneathDataSubscription.unsubscribe = jest.fn();
    const primitiveProperty = new CommonPrimitiveProperty();
    primitiveProperty.isRunningSubscriptionCallback = false;
    primitiveProperty.isLoadedUnderneathData = false;
    const voidPageCommonItem = new VoidPageCommonItem();
    voidPageCommonItem.isShowTemplateMessage = true;
    const service = new LoadDataService(null, null, null);

    await service.checkLoadedFullDataBeforeShowMessageTemplate(voidPageCommonItem, primitiveProperty, afterLoadUnderneathDataSubscription);

    expect(afterLoadUnderneathDataSubscription.unsubscribe).toHaveBeenCalledTimes(0);
  });

  it('#checkLoadedFullDataBeforeVoid should return & not update isRunningSubscriptionCallback when isRunningSubscriptionCallback true', async () => {
    const primitiveProperty = new CommonPrimitiveProperty();
    primitiveProperty.isRunningSubscriptionCallback = true;
    const service = new LoadDataService(null, null, null);

    await service.checkLoadedFullDataBeforeVoid(null, null, primitiveProperty, null);

    expect(primitiveProperty.isRunningSubscriptionCallback).toBeTruthy();
  });

  it('#checkLoadedFullDataBeforeVoid should called #submitVoidService.submitVoid when isLoadedUnderneathData true and all message initialized', async () => {
    const messageAreaComponent = new MessageAreaComponent();
    messageAreaComponent.templateMessageComponent = new TemplateMessageComponent(null, null, null, null, null, null, null, null, null);
    messageAreaComponent.templateMessageComponent.initialize = true;
    const afterLoadUnderneathDataSubscription = new Subscription();
    afterLoadUnderneathDataSubscription.unsubscribe = jest.fn();
    const primitiveProperty = new CommonPrimitiveProperty();
    primitiveProperty.isRunningSubscriptionCallback = false;
    primitiveProperty.isLoadedUnderneathData = true;
    const submitVoidService = new SubmitVoidService(null, null, null, null, null);
    submitVoidService.submitVoid = jest.fn();
    const service = new LoadDataService(submitVoidService, null, null);
    const voidPageCommonItem = [new VoidPageCommonItem()];
    voidPageCommonItem[0].voidTicketsMini = new TicketsModel();
    voidPageCommonItem[0].voidTicketsMini.total = 1;

    await service.checkLoadedFullDataBeforeVoid(voidPageCommonItem, [messageAreaComponent], primitiveProperty, afterLoadUnderneathDataSubscription);

    expect(afterLoadUnderneathDataSubscription.unsubscribe).toHaveBeenCalledTimes(1);
    expect(submitVoidService.submitVoid).toHaveBeenCalledTimes(1);
  });

  it('#checkLoadedFullDataBeforeVoid should not called #submitVoidService.submitVoid when isLoadedUnderneathData false and all message initialized', async () => {
    const messageAreaComponent = new MessageAreaComponent();
    messageAreaComponent.templateMessageComponent = new TemplateMessageComponent(null, null, null, null, null, null, null, null, null);
    messageAreaComponent.templateMessageComponent.initialize = true;
    const afterLoadUnderneathDataSubscription = new Subscription();
    afterLoadUnderneathDataSubscription.unsubscribe = jest.fn();
    const primitiveProperty = new CommonPrimitiveProperty();
    primitiveProperty.isRunningSubscriptionCallback = false;
    primitiveProperty.isLoadedUnderneathData = false;
    const submitVoidService = new SubmitVoidService(null, null, null, null, null);
    submitVoidService.submitVoid = jest.fn();
    const service = new LoadDataService(submitVoidService, null, null);

    await service.checkLoadedFullDataBeforeVoid(null, [messageAreaComponent], primitiveProperty, afterLoadUnderneathDataSubscription);

    expect(afterLoadUnderneathDataSubscription.unsubscribe).toHaveBeenCalledTimes(0);
    expect(submitVoidService.submitVoid).toHaveBeenCalledTimes(0);
  });

  it('#onClickShowTemplateMessage should return when isShowTemplateMessage false & isRequestModified true', async () => {
    const voidPageCommonItem = new VoidPageCommonItem();
    voidPageCommonItem.isShowTemplateMessage = false;
    const primitiveProperty = new CommonPrimitiveProperty();
    const checkRequestService = new CheckRequestService(null, null);
    checkRequestService.isRequestModified = jest.fn().mockReturnValue(true);
    const service = new LoadDataService(null, null, checkRequestService);

    await service.onClickShowTemplateMessage(voidPageCommonItem, primitiveProperty, new RequestDetailViewModel(), null);

    expect(checkRequestService.isRequestModified).toHaveBeenCalledTimes(1);
  });

  it('#onClickShowTemplateMessage should called checkRequestService.isRequestModified when isShowTemplateMessage false itself return false', async () => {
    const voidPageCommonItem = new VoidPageCommonItem();
    voidPageCommonItem.isShowTemplateMessage = false;
    const primitiveProperty = new CommonPrimitiveProperty();
    const checkRequestService = new CheckRequestService(null, null);
    checkRequestService.isRequestModified = jest.fn().mockReturnValue(false);
    const service = new LoadDataService(null, null, checkRequestService);

    await service.onClickShowTemplateMessage(voidPageCommonItem, primitiveProperty, new RequestDetailViewModel(), null);

    expect(checkRequestService.isRequestModified).toHaveBeenCalledTimes(1);
  });

  it('#onClickShowTemplateMessage should called afterLoadUnderneathDataSubscription.unsubscribe when isShowTemplateMessage true & afterLoadUnderneathDataSubscription not null', async () => {
    const afterLoadUnderneathDataSubscription = new Subscription();
    afterLoadUnderneathDataSubscription.unsubscribe = jest.fn();
    const voidPageCommonItem = new VoidPageCommonItem();
    voidPageCommonItem.isShowTemplateMessage = true;
    const service = new LoadDataService(null, null, null);

    jest.useFakeTimers();
    await service.onClickShowTemplateMessage(voidPageCommonItem, null, null, afterLoadUnderneathDataSubscription);

    expect(afterLoadUnderneathDataSubscription.unsubscribe).toHaveBeenCalledTimes(1);
  });
});