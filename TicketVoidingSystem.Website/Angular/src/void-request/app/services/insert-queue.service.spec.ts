import { RequestDetailModel, RequestDetailViewModel } from "../../../edit-request/app/request.model";
import { BetID } from "../../../utility/models/bet-id.model";
import { SubIssueType } from "../../../utility/models/issue-type.model";
import { MatchModel } from "../../../utility/models/match.model";
import { VoidedReason } from "../../../utility/models/reason.model";
import { Result } from "../../../utility/models/result";
import { PasswordService } from "../../../utility/services/password.service";
import { AppService } from "../app.service";
import { VoidPageCommonItem } from "../models/void-page-common-item.model";
import { TicketsModel } from "../tickets-list/tickets.model";
import { InsertQueueService } from "./insert-queue.service";

describe('InsertQueueService', () => {

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
    const submitVoidService = new InsertQueueService(appService, passwordService);
    appService.insertQueue = jest.fn().mockReturnValue(expectedResult);

    const result = await submitVoidService['insertQueue']([voidPageItem], '', '');

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
    const submitVoidService = new InsertQueueService(appService, passwordService);
    appService.insertQueue = jest.fn().mockReturnValue(expectedResult);

    const result = await submitVoidService['insertQueue']([voidPageItem], '', '');

    expect(appService.insertQueue).toHaveBeenCalledTimes(1);
    expect(result.isSuccessful).toBeTruthy();
  });
});