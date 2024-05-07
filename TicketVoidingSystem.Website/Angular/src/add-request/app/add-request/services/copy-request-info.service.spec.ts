import { NgModule } from "@angular/core";
import { AcceptType } from "../../../../utility/constants/config";
import { CopyRequestInfoResponse, RequestInfoForCopy } from '../../../../utility/models/copy-request-info.query';
import { LogInfoDetail } from "../../../../utility/models/log-info-detail.model";
import { CommonService } from "../../../../utility/services/common.service";
import { OperatorInfo, OperatorType } from "../others/others.model";
import { CopyRequestInfoService } from "./copy-request-info.service";


class Helper {
  static readonly url = 'http://localhost:60196/';
  static readonly fakeOperatorInfo: OperatorInfo[] = [
    {
      matchId: 1,
      groupName: 'name',
      operatorId: 1,
      operatorType: OperatorType.SUSPENDER,
      userName: ''
    },
    {
      matchId: 2,
      groupName: 'name',
      operatorId: 2,
      operatorType: OperatorType.TRADER,
      userName: ''
    }
  ];
  static readonly fakeLogInfoDetail: LogInfoDetail[] = [
    {
      highlightAcceptType: AcceptType.AUTO_ACCEPT,
      highlightMinTime: new Date('2020-11-06 00:00:00.000')
    } as LogInfoDetail,
    {
      highlightAcceptType: AcceptType.SECOND_ACCEPT,
      highlightMinTime: new Date('2020-11-07 00:00:00.000')
    } as LogInfoDetail,
    {
      highlightAcceptType: AcceptType.PENDING_ACCEPT,
      highlightMinTime: new Date('2020-11-08 00:00:00.000')
    } as LogInfoDetail,
    {
      highlightAcceptType: 100,
      highlightMinTime: new Date('2020-11-09 00:00:00.000')
    } as LogInfoDetail,
    {
      highlightAcceptType: null,
      highlightMinTime: new Date('2020-11-09 00:00:00.000')
    } as LogInfoDetail
  ]
}

describe('CopyRequestInfoService', () => {
  @NgModule({
    providers: [
      CommonService
    ]
  })
  class AppModuleTest { }

  let copyRequestInfoService: CopyRequestInfoService;

  beforeEach(() => {
    copyRequestInfoService = new CopyRequestInfoService(null);
  });

  it('#copyLetsTalkRequestInfo should call #commonService.copyRequestInfo', async () => {
    let requestInfo : RequestInfoForCopy = {
      requestId: 0,
      matchId: 0,
      globalShowTime: undefined,
      filterBy: 0,
      issueTypeName: "",
      subIssueTypeName: "",
      isCheckedVar: false,
      provider: "",
      requestedBy: "",
      isHasSettledTicket: false,
      remark: "",
      matchEvent: "",
      leagueName: "",
      operators: [],
      issueTypeId: 0,
      voidFromTime: undefined,
      voidToTime: undefined,
      liveStatus: "",
      totalSingleCount: 0,
      totalParlayCount: 0
    }; 
    const copyRequestInfoResponse : CopyRequestInfoResponse = {
      requestInfo: requestInfo,
      betTypeTickets: []
    } ;
    const mockClipboard = jest.fn();
    const mockWriteText = jest.fn();
    Object.defineProperty(navigator, 'clipboard', {value: mockClipboard});
    Object.defineProperty(navigator.clipboard, 'writeText', {value: mockWriteText});
    [true, false].forEach(async x => {
      copyRequestInfoResponse.requestInfo.isHasSettledTicket = x;
      const commonService = new CommonService(null);
      commonService.copyRequestInfo = jest.fn().mockReturnValue(copyRequestInfoResponse);
      copyRequestInfoService = new CopyRequestInfoService(commonService);
      await copyRequestInfoService.copyLetstalkRequestInfo(1, 1, Helper.fakeLogInfoDetail, Helper.fakeOperatorInfo);

      expect(commonService.copyRequestInfo).toHaveBeenCalledTimes(1);
    })
  });
});