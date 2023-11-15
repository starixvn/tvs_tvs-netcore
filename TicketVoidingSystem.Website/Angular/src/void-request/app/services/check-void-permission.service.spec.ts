import { RequestDetailModel, RequestDetailViewModel } from "../../../edit-request/app/request.model";
import { MatchModel } from "../../../utility/models/match.model";
import { SqlResult } from "../../../utility/models/result";
import { CommonService } from "../../../utility/services/common.service";
import { VoidPageCommonItem } from "../models/void-page-common-item.model";
import { TicketsModel } from "../tickets-list/tickets.model";
import { CheckVoidPermissionService } from "./check-void-permission.service";

describe('CheckVoidPermissionService', () => {
  it('#checkVoidBetPermission should return true', async () => {
    const mockResult = new SqlResult();
    mockResult.errCode = 0;
    const voidPageItem = new VoidPageCommonItem();
    voidPageItem.voidTicketsMini = new TicketsModel();
    voidPageItem.detailViewModel = new RequestDetailViewModel();
    voidPageItem.detailViewModel.request = new RequestDetailModel();
    voidPageItem.detailViewModel.request.issueTypeId = 1;
    voidPageItem.matchModel = new MatchModel();
    const commonService = new CommonService(null);
    commonService.checkVoidBetPermission = jest.fn().mockReturnValue(mockResult);

    const mockValidationService = new CheckVoidPermissionService(commonService);
    const actual = await mockValidationService.checkVoidBetPermission([voidPageItem]);

    expect(actual.isSuccessful).toBeTruthy();
  });

  it('#checkVoidBetPermission should return false', async () => {
    const mockResult = new SqlResult();
    mockResult.errCode = 1;
    const voidPageItem = new VoidPageCommonItem();
    voidPageItem.voidTicketsMini = new TicketsModel();
    voidPageItem.detailViewModel = new RequestDetailViewModel();
    voidPageItem.detailViewModel.request = new RequestDetailModel();
    voidPageItem.detailViewModel.request.issueTypeId = 1;
    voidPageItem.matchModel = null;
    const commonService = new CommonService(null);
    commonService.checkVoidBetPermission = jest.fn().mockReturnValue(mockResult);

    const mockValidationService = new CheckVoidPermissionService(commonService);
    const actual = await mockValidationService.checkVoidBetPermission([voidPageItem]);

    expect(actual.isSuccessful).toBeFalsy();
    expect(commonService.checkVoidBetPermission).toHaveBeenCalled();
  });
});