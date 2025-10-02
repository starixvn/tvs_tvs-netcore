import { TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { RequestDetailViewModel } from "../../../add-request-new/models/request-detail.model";
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
  let submitVoidService: jest.Mocked<SubmitVoidService>;
  let ticketsService: jest.Mocked<TicketsService>;
  let checkRequestService: jest.Mocked<CheckRequestService>;
  let service: LoadDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoadDataService,
        { provide: TicketsService, useValue: { insertQueue: jest.fn() } },
        { provide: SubmitVoidService, useValue: { insertQueue: jest.fn() } },
        { provide: CheckRequestService, useValue: { hash: jest.fn() } }
      ]
    });
    submitVoidService = TestBed.inject(SubmitVoidService) as jest.Mocked<SubmitVoidService>;
    ticketsService = TestBed.inject(TicketsService) as jest.Mocked<TicketsService>;
    checkRequestService = TestBed.inject(CheckRequestService) as jest.Mocked<CheckRequestService>;
    service = TestBed.inject(LoadDataService);
  });

  it('#onClickShowVoidTickets should return when isShowTicketFull & isRequestModified are incorrect', async () => {
    const voidPageCommonItem = new VoidPageCommonItem();
    voidPageCommonItem.isShowTicketFull = false;
    voidPageCommonItem.isLoadedTicketFull = true;
    checkRequestService.isRequestModified = jest.fn().mockReturnValue(true);

    await service.onClickShowVoidTickets(voidPageCommonItem, new RequestDetailViewModel(), new CommonPrimitiveProperty());

    expect(checkRequestService.isRequestModified).toHaveBeenCalledTimes(1);
  });

  it('#onClickShowVoidTickets should return when isShowTicketFull is incorrect but isRequestModified is incorrect', async () => {
    const voidPageCommonItem = new VoidPageCommonItem();
    voidPageCommonItem.isShowTicketFull = false;
    voidPageCommonItem.isLoadedTicketFull = true;
    checkRequestService.isRequestModified = jest.fn().mockReturnValue(false);

    await service.onClickShowVoidTickets(voidPageCommonItem, new RequestDetailViewModel(), new CommonPrimitiveProperty());

    expect(checkRequestService.isRequestModified).toHaveBeenCalledTimes(1);
  });

  it('#onClickShowVoidTickets should call #ticketsService.loadVoidTicketsFullOnFirstTime when isShowTicketFull is correct & isLoadedTicketFull is incorrect', async () => {
    const voidPageCommonItem = new VoidPageCommonItem();
    voidPageCommonItem.isShowTicketFull = true;
    voidPageCommonItem.isLoadedTicketFull = false;
    checkRequestService.isRequestModified = jest.fn().mockReturnValue(true);
    ticketsService.loadVoidTicketsFullOnFirstTime = jest.fn();

    await service.onClickShowVoidTickets(voidPageCommonItem, new RequestDetailViewModel(), new CommonPrimitiveProperty());

    expect(ticketsService.loadVoidTicketsFullOnFirstTime).toHaveBeenCalledTimes(1);
  });

  it('#onClickShowVoidTickets should not call #ticketsService.loadVoidTicketsFullOnFirstTime when isShowTicketFull is correct & isLoadedTicketFull is incorrect', async () => {
    const voidPageCommonItem = new VoidPageCommonItem();
    voidPageCommonItem.isShowTicketFull = true;
    voidPageCommonItem.isLoadedTicketFull = true;
    checkRequestService.isRequestModified = jest.fn().mockReturnValue(true);
    ticketsService.loadVoidTicketsFullOnFirstTime = jest.fn();

    await service.onClickShowVoidTickets(voidPageCommonItem, new RequestDetailViewModel(), new CommonPrimitiveProperty());

    expect(ticketsService.loadVoidTicketsFullOnFirstTime).toHaveBeenCalledTimes(0);
  });

  it('#checkLoadedFullDataBeforeShowMessageTemplate should return & not change isRunningSubscriptionCallback when #isRunningSubscriptionCallback is incorrect', async () => {
    const afterLoadUnderneathDataSubscription = new Subscription();
    const primitiveProperty = new CommonPrimitiveProperty();
    primitiveProperty.isRunningSubscriptionCallback = true;
    const voidPageCommonItem = new VoidPageCommonItem();
    voidPageCommonItem.isShowTemplateMessage = true;

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

    await service.checkLoadedFullDataBeforeShowMessageTemplate(voidPageCommonItem, primitiveProperty, afterLoadUnderneathDataSubscription);

    expect(afterLoadUnderneathDataSubscription.unsubscribe).toHaveBeenCalledTimes(0);
  });

  it('#checkLoadedFullDataBeforeVoid should return & not update isRunningSubscriptionCallback when isRunningSubscriptionCallback true', async () => {
    const primitiveProperty = new CommonPrimitiveProperty();
    primitiveProperty.isRunningSubscriptionCallback = true;

    await service.checkLoadedFullDataBeforeVoid(null, null, primitiveProperty, null);

    expect(primitiveProperty.isRunningSubscriptionCallback).toBeTruthy();
  });

  it('#checkLoadedFullDataBeforeVoid should called #submitVoidService.submitVoid when isLoadedUnderneathData true and all message initialized', async () => {
    const messageAreaComponent = new MessageAreaComponent();
    messageAreaComponent.templateMessageComponent = {} as TemplateMessageComponent;
    messageAreaComponent.templateMessageComponent.initialize = true;
    const afterLoadUnderneathDataSubscription = new Subscription();
    afterLoadUnderneathDataSubscription.unsubscribe = jest.fn();
    const primitiveProperty = new CommonPrimitiveProperty();
    primitiveProperty.isRunningSubscriptionCallback = false;
    primitiveProperty.isLoadedUnderneathData = true;
    submitVoidService.submitVoid = jest.fn();
    const voidPageCommonItem = [new VoidPageCommonItem()];
    voidPageCommonItem[0].voidTicketsMini = new TicketsModel();
    voidPageCommonItem[0].voidTicketsMini.total = 1;

    await service.checkLoadedFullDataBeforeVoid(voidPageCommonItem, [messageAreaComponent], primitiveProperty, afterLoadUnderneathDataSubscription);

    expect(afterLoadUnderneathDataSubscription.unsubscribe).toHaveBeenCalledTimes(1);
    expect(submitVoidService.submitVoid).toHaveBeenCalledTimes(1);
  });

  it('#checkLoadedFullDataBeforeVoid should not called #submitVoidService.submitVoid when isLoadedUnderneathData false and all message initialized', async () => {
    const messageAreaComponent = new MessageAreaComponent();
    messageAreaComponent.templateMessageComponent = {} as TemplateMessageComponent;
    messageAreaComponent.templateMessageComponent.initialize = true;
    const afterLoadUnderneathDataSubscription = new Subscription();
    afterLoadUnderneathDataSubscription.unsubscribe = jest.fn();
    const primitiveProperty = new CommonPrimitiveProperty();
    primitiveProperty.isRunningSubscriptionCallback = false;
    primitiveProperty.isLoadedUnderneathData = false;
    submitVoidService.submitVoid = jest.fn();

    await service.checkLoadedFullDataBeforeVoid(null, [messageAreaComponent], primitiveProperty, afterLoadUnderneathDataSubscription);

    expect(afterLoadUnderneathDataSubscription.unsubscribe).toHaveBeenCalledTimes(0);
    expect(submitVoidService.submitVoid).toHaveBeenCalledTimes(0);
  });

  it('#onClickShowTemplateMessage should return when isShowTemplateMessage false & isRequestModified true', async () => {
    const voidPageCommonItem = new VoidPageCommonItem();
    voidPageCommonItem.isShowTemplateMessage = false;
    const primitiveProperty = new CommonPrimitiveProperty();
    checkRequestService.isRequestModified = jest.fn().mockReturnValue(true);

    await service.onClickShowTemplateMessage(voidPageCommonItem, primitiveProperty, new RequestDetailViewModel(), null);

    expect(checkRequestService.isRequestModified).toHaveBeenCalledTimes(1);
  });

  it('#onClickShowTemplateMessage should called checkRequestService.isRequestModified when isShowTemplateMessage false itself return false', async () => {
    const voidPageCommonItem = new VoidPageCommonItem();
    voidPageCommonItem.isShowTemplateMessage = false;
    const primitiveProperty = new CommonPrimitiveProperty();
    checkRequestService.isRequestModified = jest.fn().mockReturnValue(false);

    await service.onClickShowTemplateMessage(voidPageCommonItem, primitiveProperty, new RequestDetailViewModel(), null);

    expect(checkRequestService.isRequestModified).toHaveBeenCalledTimes(1);
  });

  it('#onClickShowTemplateMessage should called afterLoadUnderneathDataSubscription.unsubscribe when isShowTemplateMessage true & afterLoadUnderneathDataSubscription not null', async () => {
    const afterLoadUnderneathDataSubscription = new Subscription();
    afterLoadUnderneathDataSubscription.unsubscribe = jest.fn();
    const voidPageCommonItem = new VoidPageCommonItem();
    voidPageCommonItem.isShowTemplateMessage = true;

    jest.useFakeTimers();
    await service.onClickShowTemplateMessage(voidPageCommonItem, null, null, afterLoadUnderneathDataSubscription);

    expect(afterLoadUnderneathDataSubscription.unsubscribe).toHaveBeenCalledTimes(1);
  });
});