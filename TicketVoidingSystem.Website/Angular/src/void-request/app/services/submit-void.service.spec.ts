import { TestBed } from '@angular/core/testing';
import { RequestDetailModel, RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { TemplateMessageComponent } from '../../../utility/components/template-message/template-message/template-message.component';
import { TemplateValue } from '../../../utility/components/template-message/template-message/template.model';
import { LABELS } from '../../../utility/constants/labels';
import { MatchModel } from '../../../utility/models/match.model';
import { VoidedReason } from '../../../utility/models/reason.model';
import { Result } from '../../../utility/models/result';
import { MessageAreaComponent } from '../message-area/message-area.component';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { VoidPageCommonItem } from '../models/void-page-common-item.model';
import { CheckRequestService } from '../services/check-request.service';
import { PopupService } from '../services/popup.service';
import { TicketsModel } from '../tickets-list/tickets.model';
import { CheckVoidPermissionService } from './check-void-permission.service';
import { InsertQueueService } from './insert-queue.service';
import { LogChangeContentService } from './log-change-content.service';
import { SubmitVoidService } from './submit-void.service';

describe('SubmitVoidService', () => {
  let popupService: jest.Mocked<PopupService>;
  let insertQueueService: jest.Mocked<InsertQueueService>;
  let checkRequestService: jest.Mocked<CheckRequestService>;
  let checkVoidPermissionService: jest.Mocked<CheckVoidPermissionService>;
  let logChangeContentService: jest.Mocked<LogChangeContentService>;
  let submitVoidService: SubmitVoidService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SubmitVoidService,
        {
          provide: PopupService, useValue: {
            showVoidBetConfirm: jest.fn(), showWarningVoidBetPermission: jest.fn(),
            showSubmitVoidRequestSuccess: jest.fn(), showSubmitVoidRequestError: jest.fn()
          }
        },
        { provide: InsertQueueService, useValue: { insertQueue: jest.fn() } },
        { provide: CheckRequestService, useValue: { isRequestModified: jest.fn() } },
        { provide: CheckVoidPermissionService, useValue: { checkVoidBetPermission: jest.fn() } },
        { provide: LogChangeContentService, useValue: { writeLog: jest.fn() } }
      ]
    });
    popupService = TestBed.inject(PopupService) as jest.Mocked<PopupService>;
    insertQueueService = TestBed.inject(InsertQueueService) as jest.Mocked<InsertQueueService>;
    checkRequestService = TestBed.inject(CheckRequestService) as jest.Mocked<CheckRequestService>;
    checkVoidPermissionService = TestBed.inject(CheckVoidPermissionService) as jest.Mocked<CheckVoidPermissionService>;
    logChangeContentService = TestBed.inject(LogChangeContentService) as jest.Mocked<LogChangeContentService>;
    submitVoidService = TestBed.inject(SubmitVoidService);
  });

  it('#submitVoid should call #validationService.checkValidationBeforeVoid & return with succesful', async () => {
    const spyShowConfirm = jest.spyOn(popupService, 'showVoidBetConfirm').mockImplementation(() => { });
    const confirmMessage = `<div>${LABELS.CONFIRM_VOID_ALL_TICKETS}</div>`;
    const validation = new Result<null>();
    validation.isSuccessful = true;
    submitVoidService['checkValidationBeforeVoid'] = jest.fn().mockReturnValue(validation);
    submitVoidService['checkRequestModified'] = jest.fn();

    await submitVoidService.submitVoid([], [], new CommonPrimitiveProperty());

    expect(submitVoidService['checkValidationBeforeVoid']).toHaveBeenCalledTimes(1);

    expect(spyShowConfirm).toHaveBeenCalledTimes(1);
    expect(spyShowConfirm.mock.calls[0][0]).toStrictEqual(confirmMessage);
    expect(spyShowConfirm.mock.calls[0][1]).toBeInstanceOf(Function);
    spyShowConfirm.mock.calls[0][1]();
    expect(submitVoidService['checkRequestModified']).toHaveBeenCalledTimes(1);
  });

  it('#submitVoid should call #validationService.checkValidationBeforeVoid & return with error', async () => {
    const validation = new Result<null>();
    validation.isSuccessful = false;
    submitVoidService['checkValidationBeforeVoid'] = jest.fn().mockReturnValue(validation);
    submitVoidService['checkRequestModified'] = jest.fn();
    await submitVoidService.submitVoid(null, null, new CommonPrimitiveProperty());

    expect(submitVoidService['checkValidationBeforeVoid']).toHaveBeenCalledTimes(1);
  });

  it('#checkRequestModified should call #reCheckVoidBetPermission', async () => {
    const voidPageItem = new VoidPageCommonItem();
    voidPageItem.detailViewModel = new RequestDetailViewModel();
    checkRequestService.isRequestModified = jest.fn().mockReturnValue(false);
    logChangeContentService.writeLog = jest.fn();
    submitVoidService['reCheckVoidBetPermission'] = jest.fn();

    await submitVoidService['checkRequestModified']([voidPageItem], new CommonPrimitiveProperty(), []);

    expect(checkRequestService.isRequestModified).toHaveBeenCalledTimes(1);
    expect(submitVoidService['reCheckVoidBetPermission']).toHaveBeenCalledTimes(1);
  });

  it('#checkRequestModified should not call #reCheckVoidBetPermission', async () => {
    const voidPageItem = new VoidPageCommonItem();
    voidPageItem.detailViewModel = new RequestDetailViewModel();
    checkRequestService.isRequestModified = jest.fn().mockReturnValue(true);
    submitVoidService['reCheckVoidBetPermission'] = jest.fn();

    await submitVoidService['checkRequestModified']([voidPageItem], new CommonPrimitiveProperty(), null);

    expect(checkRequestService.isRequestModified).toHaveBeenCalledTimes(1);
    expect(submitVoidService['reCheckVoidBetPermission']).toHaveBeenCalledTimes(0);
  });

  it('#reCheckVoidBetPermission should call #validationService.processVoid', async () => {
    const validation = new Result<null>();
    validation.isSuccessful = true;
    const voidPageItem = new VoidPageCommonItem();
    voidPageItem.detailViewModel = new RequestDetailViewModel();
    voidPageItem.detailViewModel.request = new RequestDetailModel();
    checkVoidPermissionService.checkVoidBetPermission = jest.fn().mockReturnValue(validation);
    submitVoidService['processVoid'] = jest.fn();

    await submitVoidService['reCheckVoidBetPermission']([voidPageItem], new CommonPrimitiveProperty(), []);

    expect(submitVoidService['processVoid']).toHaveBeenCalledTimes(1);
    expect(checkVoidPermissionService.checkVoidBetPermission).toHaveBeenCalledTimes(1);
  });

  it('#reCheckVoidBetPermission should call #showWarningVoidBetPermission', async () => {
    const validation = new Result<null>();
    validation.isSuccessful = false;
    popupService.showWarningVoidBetPermission = jest.fn();
    checkVoidPermissionService.checkVoidBetPermission = jest.fn().mockReturnValue(validation);
    submitVoidService['processVoid'] = jest.fn();

    await submitVoidService['reCheckVoidBetPermission']([], new CommonPrimitiveProperty(), []);

    expect(submitVoidService['processVoid']).toHaveBeenCalledTimes(0);
    expect(popupService.showWarningVoidBetPermission).toHaveBeenCalledTimes(1);
    expect(checkVoidPermissionService.checkVoidBetPermission).toHaveBeenCalledTimes(1);
  });

  it('#processVoid should call #popupService.showSubmitVoidRequestSuccess', async () => {
    const result = new Result<null>();
    result.isSuccessful = true;
    popupService.showSubmitVoidRequestSuccess = jest.fn();
    insertQueueService.insertQueue = jest.fn().mockReturnValue(result);

    await submitVoidService['processVoid'](null, new CommonPrimitiveProperty());

    expect(popupService.showSubmitVoidRequestSuccess).toHaveBeenCalledTimes(1);
    expect(insertQueueService.insertQueue).toHaveBeenCalledTimes(1);
  });

  it('#processVoid should call #popupService.showSubmitVoidRequestError', async () => {
    const result = new Result<null>();
    result.isSuccessful = false;
    insertQueueService.insertQueue = jest.fn().mockReturnValue(result);
    popupService.showSubmitVoidRequestError = jest.fn();
    await submitVoidService['processVoid'](null, new CommonPrimitiveProperty());

    expect(popupService.showSubmitVoidRequestError).toHaveBeenCalledTimes(1);
    expect(insertQueueService.insertQueue).toHaveBeenCalledTimes(1);
  });

  it('#checkValidationBeforeVoid should return result fail when have not tickets', async () => {
    const voidPage = new VoidPageCommonItem();
    voidPage.voidTicketsMini = new TicketsModel();
    voidPage.voidTicketsMini.total = 0;

    const result = submitVoidService['checkValidationBeforeVoid']([voidPage], null);

    expect(result.errorCode).toBe(1);
    expect(result.errorMsg).toBe(LABELS.ALL_TICKETS_VOIDED);
  });

  it('#checkValidationBeforeVoid should return result fail when messageComponent.checkValidation false', async () => {
    const templateMessageComponent1 = new TemplateMessageComponent(null, null, null, null, null, null, null, null, null);
    templateMessageComponent1.value = new TemplateValue();
    templateMessageComponent1.value.matchId = 1;
    templateMessageComponent1.checkValidation = jest.fn().mockReturnValue(false);
    const messageAreaComponent1 = new MessageAreaComponent();
    messageAreaComponent1.templateMessageComponent = templateMessageComponent1;
    const templateMessageComponent2 = new TemplateMessageComponent(null, null, null, null, null, null, null, null, null);
    templateMessageComponent2.value = new TemplateValue();
    templateMessageComponent2.value.matchId = 2;
    templateMessageComponent2.checkValidation = jest.fn().mockReturnValue(false);
    const messageAreaComponent2 = new MessageAreaComponent();
    messageAreaComponent2.templateMessageComponent = templateMessageComponent2;
    const voidPage1 = new VoidPageCommonItem();
    voidPage1.voidTicketsMini = new TicketsModel();
    voidPage1.voidTicketsMini.total = 1;
    voidPage1.matchModel = new MatchModel();
    voidPage1.matchModel.matchId = 1;
    voidPage1.matchModel = null;
    const voidPage2 = new VoidPageCommonItem();
    voidPage2.voidTicketsMini = new TicketsModel();
    voidPage2.voidTicketsMini.total = 3;
    voidPage2.matchModel = new MatchModel();
    voidPage2.matchModel.matchId = 2;

    const result = submitVoidService['checkValidationBeforeVoid']([voidPage1, voidPage2], [messageAreaComponent1, messageAreaComponent2]);

    expect(result.errorCode).toBe(1);
    expect(result.errorMsg).toBe(`Invalid template message.`);
  });

  it('#checkValidationBeforeVoid should return result fail when voidReason?.reasonEnglish is empty', async () => {
    const templateMessageComponent = new TemplateMessageComponent(null, null, null, null, null, null, null, null, null);
    templateMessageComponent.value = new TemplateValue();
    templateMessageComponent.value.matchId = 1;
    templateMessageComponent.checkValidation = jest.fn().mockReturnValue(true);
    const messageAreaComponent = new MessageAreaComponent();
    messageAreaComponent.templateMessageComponent = templateMessageComponent;
    const voidPage = new VoidPageCommonItem();
    voidPage.voidTicketsMini = new TicketsModel();
    voidPage.voidTicketsMini.total = 1;
    voidPage.matchModel = null;
    voidPage.voidReason = new VoidedReason();
    voidPage.voidReason.reasonEnglish = '';

    const result = submitVoidService['checkValidationBeforeVoid']([voidPage], [messageAreaComponent]);

    expect(result.errorCode).toBe(1);
    expect(result.errorMsg).toBe(`Please input reason.`);
  });

  it('#checkValidationBeforeVoid should return result fail when voidReason.reasonChineseSimplified is empty', async () => {
    const templateMessageComponent = new TemplateMessageComponent(null, null, null, null, null, null, null, null, null);
    templateMessageComponent.value = new TemplateValue();
    templateMessageComponent.value.matchId = 1;
    templateMessageComponent.checkValidation = jest.fn().mockReturnValue(true)
    const messageAreaComponent = new MessageAreaComponent();
    messageAreaComponent.templateMessageComponent = templateMessageComponent;
    const voidPage = new VoidPageCommonItem();
    voidPage.voidTicketsMini = new TicketsModel();
    voidPage.voidTicketsMini.total = 1;
    voidPage.matchModel = null;
    voidPage.voidReason = new VoidedReason();
    voidPage.voidReason.reasonChineseSimplified = '';

    const result = submitVoidService['checkValidationBeforeVoid']([voidPage], [messageAreaComponent]);

    expect(result.errorCode).toBe(1);
    expect(result.errorMsg).toBe(`Please input reason.`);
  });

  it('#checkValidationBeforeVoid should return result successful when voidReason.reasonChineseSimplified is empty', async () => {
    const messageAreaComponent = new MessageAreaComponent();
    messageAreaComponent.templateMessageComponent = new TemplateMessageComponent(null, null, null, null, null, null, null, null, null);
    messageAreaComponent.templateMessageComponent.value = new TemplateValue();
    messageAreaComponent.templateMessageComponent.value.matchId = 1;
    messageAreaComponent.templateMessageComponent.checkValidation = jest.fn().mockReturnValue(true)
    const voidPage = new VoidPageCommonItem();
    voidPage.voidTicketsMini = new TicketsModel();
    voidPage.voidTicketsMini.total = 1;
    voidPage.matchModel = null;
    voidPage.voidReason = null;

    const result = submitVoidService['checkValidationBeforeVoid']([voidPage], [messageAreaComponent]);

    expect(result.errorCode).toBe(0);
    expect(result.errorMsg).toBe('');
  });
});