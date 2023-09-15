import { RequestDetailModel, RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { LABELS } from '../../../utility/constants/labels';
import { BetID } from '../../../utility/models/bet-id.model';
import { SubIssueType } from '../../../utility/models/issue-type.model';
import { MatchModel } from '../../../utility/models/match.model';
import { VoidedReason } from '../../../utility/models/reason.model';
import { Result } from '../../../utility/models/result';
import { PasswordService } from '../../../utility/services/password.service';
import { AppService } from '../app.service';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { VoidPageCommonItem } from '../models/void-page-common-item.model';
import { CheckRequestService } from '../services/check-request.service';
import { PopupService } from '../services/popup.service';
import { TicketsModel } from '../tickets-list/tickets.model';
import { SubmitVoidService } from './submit-void.service';

class Helper {
  static readonly fakeResultError: Result<null> = {
    isSuccessful: false,
    errorCode: 111111,
    errorMsg: '',
  };
}

describe('SubmitVoidService', () => {
  it('#voidDuplicateTickets should call #validationService.checkValidationBeforeVoid', async () => {
    const popupService = new PopupService(null);
    const spyShowConfirm = jest.spyOn(popupService, 'showVoidBetConfirm').mockImplementation(() => {});
    const confirmMessage = `<div>${LABELS.CONFIRM_VOID_ALL_TICKETS}</div>`;
    const validation = new Result<null>();
    validation.isSuccessful = true;
    const submitVoidService = new SubmitVoidService(null, popupService, null, null, null);
    submitVoidService.checkValidationBeforeVoid = jest.fn().mockReturnValue(validation);
    submitVoidService['checkRequestModified'] = jest.fn();

    await submitVoidService.submitVoid(null, null, new CommonPrimitiveProperty());

    expect(spyShowConfirm).toHaveBeenCalledTimes(1);
    expect(spyShowConfirm.mock.calls[0][0]).toStrictEqual(confirmMessage);
    expect(spyShowConfirm.mock.calls[0][1]).toBeInstanceOf(Function);
    spyShowConfirm.mock.calls[0][1]();
    expect(submitVoidService['checkRequestModified']).toHaveBeenCalledTimes(1);
  });

  it('#checkRequestModified should call #reCheckVoidBetPermission', async () => {
    const voidPageItem = new VoidPageCommonItem();
    voidPageItem.detailViewModel = new RequestDetailViewModel();
    const checkRequestService = new CheckRequestService(null, null);
    checkRequestService.isRequestModified = jest.fn().mockReturnValue(false);
    const submitVoidService = new SubmitVoidService(null, null, null, null, checkRequestService);
    submitVoidService['reCheckVoidBetPermission'] = jest.fn();

    await submitVoidService['checkRequestModified'](voidPageItem, new CommonPrimitiveProperty());

    expect(checkRequestService.isRequestModified).toHaveBeenCalledTimes(1);
    expect(submitVoidService['reCheckVoidBetPermission']).toHaveBeenCalledTimes(1);
  });

  it('#checkRequestModified should not call #reCheckVoidBetPermission', async () => {
    const voidPageItem = new VoidPageCommonItem();
    voidPageItem.detailViewModel = new RequestDetailViewModel();
    const checkRequestService = new CheckRequestService(null, null);
    checkRequestService.isRequestModified = jest.fn().mockReturnValue(true);
    const submitVoidService = new SubmitVoidService(null, null, null, null, checkRequestService);
    submitVoidService['reCheckVoidBetPermission'] = jest.fn();

    await submitVoidService['checkRequestModified'](voidPageItem, new CommonPrimitiveProperty());

    expect(checkRequestService.isRequestModified).toHaveBeenCalledTimes(1);
    expect(submitVoidService['reCheckVoidBetPermission']).toHaveBeenCalledTimes(0);
  });

  it('#reCheckVoidBetPermission should call #validationService.processVoid', async () => {
    const voidPageItem = new VoidPageCommonItem();
    voidPageItem.detailViewModel = new RequestDetailViewModel();
    const validation = new Result<null>();
    validation.isSuccessful = true;
    const submitVoidService = new SubmitVoidService(null, null, null, null, null);
    submitVoidService.checkVoidBetPermission = jest.fn().mockReturnValue(validation);
    submitVoidService['processVoid'] = jest.fn();

    await submitVoidService['reCheckVoidBetPermission'](voidPageItem, new CommonPrimitiveProperty());

    expect(submitVoidService['processVoid']).toHaveBeenCalledTimes(1);
  });

  it('#reCheckVoidBetPermission should call #popupService.showWarningVoidBetPermission', async () => {
    const voidPageItem = new VoidPageCommonItem();
    voidPageItem.detailViewModel = new RequestDetailViewModel();
    const validation = new Result<null>();
    validation.isSuccessful = false;
    const popupService = new PopupService(null);
    popupService.showWarningVoidBetPermission = jest.fn();
    const submitVoidService = new SubmitVoidService(null, popupService, null, null, null);
    submitVoidService.checkVoidBetPermission = jest.fn().mockReturnValue(validation);
    submitVoidService['processVoid'] = jest.fn();

    await submitVoidService['reCheckVoidBetPermission'](voidPageItem, new CommonPrimitiveProperty());

    expect(popupService.showWarningVoidBetPermission).toHaveBeenCalledTimes(1);
  });

  it('#processVoid should call #popupService.showSubmitVoidRequestSuccess', async () => {
    const result = new Result<null>();
    result.isSuccessful = true;
    const popupService = new PopupService(null);
    popupService.showSubmitVoidRequestSuccess = jest.fn();
    const submitVoidService = new SubmitVoidService(null, popupService, null, null, null);
    submitVoidService['insertQueue'] = jest.fn().mockReturnValue(result);
    await submitVoidService['processVoid'](null, new CommonPrimitiveProperty());

    expect(popupService.showSubmitVoidRequestSuccess).toHaveBeenCalledTimes(1);
    expect(submitVoidService['insertQueue']).toHaveBeenCalledTimes(1);
  });

  it('#processVoid should call #popupService.showSubmitVoidRequestError', async () => {
    const result = new Result<null>();
    result.isSuccessful = false;
    const popupService = new PopupService(null);
    popupService.showSubmitVoidRequestError = jest.fn();
    const submitVoidService = new SubmitVoidService(null, popupService, null, null, null);
    submitVoidService['insertQueue'] = jest.fn().mockReturnValue(result);
    await submitVoidService['processVoid'](null, new CommonPrimitiveProperty());

    expect(popupService.showSubmitVoidRequestError).toHaveBeenCalledTimes(1);
    expect(submitVoidService['insertQueue']).toHaveBeenCalledTimes(1);
  });

  it('#insertQueue should call return Result false', async () => {
    const betId = new BetID();
    betId.transId = '1';
    const expectedResult = new Result<null>();
    expectedResult.isSuccessful = false;
    const voidPageItem = new VoidPageCommonItem();
    voidPageItem.detailViewModel = new RequestDetailViewModel();
    voidPageItem.detailViewModel.request = new RequestDetailModel();
    voidPageItem.voidTicketsMini = new TicketsModel();
    voidPageItem.voidTicketsMini.singleTickets = [betId];
    voidPageItem.voidTicketsMini.parlayTickets = [betId];
    voidPageItem.voidTicketsMini.cancelCashOutTickets = [betId];
    voidPageItem.voidTicketsMini.cricketTickets = [betId];
    voidPageItem.voidTicketsMini.uncheckedTransIds = ['1', '2'];
    voidPageItem.voidReason = new VoidedReason();
    voidPageItem.matchModel = new MatchModel();
    voidPageItem.subIssueType = new SubIssueType();

    const appService = new AppService(null);
    const passwordService = new PasswordService();
    passwordService.hash = jest.fn().mockReturnValue('');
    const submitVoidService = new SubmitVoidService(appService, null, null, passwordService, null);
    appService.insertQueue = jest.fn().mockReturnValue(expectedResult);

    const result = await submitVoidService['insertQueue'](voidPageItem, '', '');

    expect(appService.insertQueue).toHaveBeenCalledTimes(1);
    expect(result.isSuccessful).toBeFalsy();
  });

  it('#insertQueue should call return Result true', async () => {
    const betId = new BetID();
    betId.transId = '1';
    const expectedResult = new Result<null>();
    expectedResult.isSuccessful = true;
    const voidPageItem = new VoidPageCommonItem();
    voidPageItem.detailViewModel = new RequestDetailViewModel();
    voidPageItem.detailViewModel.request = new RequestDetailModel();
    voidPageItem.voidTicketsMini = new TicketsModel();
    voidPageItem.voidTicketsMini.singleTickets = [betId];
    voidPageItem.voidTicketsMini.parlayTickets = [betId];
    voidPageItem.voidTicketsMini.cancelCashOutTickets = [betId];
    voidPageItem.voidTicketsMini.cricketTickets = [betId];
    voidPageItem.voidTicketsMini.uncheckedTransIds = ['1', '2'];
    voidPageItem.voidReason = null;
    voidPageItem.matchModel = null;
    voidPageItem.subIssueType = new SubIssueType();

    const appService = new AppService(null);
    const passwordService = new PasswordService();
    passwordService.hash = jest.fn().mockReturnValue('');
    const submitVoidService = new SubmitVoidService(appService, null, null, passwordService, null);
    appService.insertQueue = jest.fn().mockReturnValue(expectedResult);

    const result = await submitVoidService['insertQueue'](voidPageItem, '', '');

    expect(appService.insertQueue).toHaveBeenCalledTimes(1);
    expect(result.isSuccessful).toBeTruthy();
  });
});