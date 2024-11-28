import { Component, OnInit } from '@angular/core';
import { RequestDetailViewModel } from '../../edit-request/app/request.model';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { StaticService } from '../../utility/services/static.service';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  requestId: number;
  requestDetail = new RequestDetailViewModel();
  isBlockUI: boolean;
  remark: string[];

  private isReadyRender = false;

  constructor(
    private readonly appService: AppService,
    private readonly signalRService: SignalRService
  ) { }

  async ngOnInit() {
    this.isBlockUI = true;
    this.remark = await this.appService.getRemark();
    const url = window.location.href;
    const params = url.split('/');
    this.requestId = parseInt(params[params.length - 1], 10);
    this.requestDetail = await this.appService.getRequestById(this.requestId);
    this.requestDetail.requestId = this.requestId;
    this.requestDetail.lastModifiedDate = (await this.appService.getLastModifiedDate(this.requestId)).lastModifiedDate;
    this.isReadyRender = true;
    this.isBlockUI = false;
    await this.signalRService.initializeConnection();
  }

  updateBlockUI(isBlock: boolean): void {
    this.isBlockUI = isBlock;
  }

  isValidRequest(): boolean {
    return this.isReadyRender && StaticService.isVoidAction(this.requestDetail.request.actionId);
  }

  isLikelyVoidDangerAccepted(): boolean {
    return StaticService.isDangerAccepted(this.requestDetail.request?.issueTypeId)
      || StaticService.isWrongOU(this.requestDetail.request?.issueTypeId)
      || StaticService.isWrong1stOU(this.requestDetail.request?.issueTypeId)
      || StaticService.isWrongHDP(this.requestDetail.request?.issueTypeId)
      || StaticService.isRedCard(this.requestDetail.request?.issueTypeId)
      || StaticService.isWrong1stHDP(this.requestDetail.request?.issueTypeId);
  }

  isShowVoidDuplicateTickets(): boolean {
    return StaticService.isDuplicateTickets(this.requestDetail.request?.issueTypeId);
  }

  isLikelyVoidNotParticipate(): boolean {
    return StaticService.isNotParticipate(this.requestDetail.request?.issueTypeId)
      || StaticService.isWrongOddsSportsBook(this.requestDetail.request?.issueTypeId)
      || StaticService.isOtherIssues(this.requestDetail.request?.issueTypeId);
  }

  isLikelyVoidEarlyKickOff(): boolean {
    return StaticService.isEarlyKickOff(this.requestDetail.request?.issueTypeId) || StaticService.isWrongKickOff(this.requestDetail.request?.issueTypeId)
      || StaticService.isWrongOfferedName(this.requestDetail.request?.issueTypeId);
  }

  isShowVoidAbnormalBet(): boolean {
    return StaticService.isAbnormalBet(this.requestDetail.request?.issueTypeId);
  }

  isShowVoidWrongMarketOffered(): boolean {
    return StaticService.isLikelyWrongMarketOffered(this.requestDetail.request?.issueTypeId);
  }

  isShowVoidOtherIssue(): boolean {
    return !this.isShowVoidDuplicateTickets() && !this.isLikelyVoidDangerAccepted() && !this.isShowVoidWrongMarketOffered()
      && !this.isLikelyVoidNotParticipate() && !this.isLikelyVoidEarlyKickOff() && !this.isShowVoidAbnormalBet();
  }
}
