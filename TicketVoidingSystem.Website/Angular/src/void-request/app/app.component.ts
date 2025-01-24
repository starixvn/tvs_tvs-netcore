import { Component, inject, OnInit } from '@angular/core';
import { RequestDetailViewModel } from '../../edit-request/app/request.model';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { StaticService } from '../../utility/services/static.service';
import { AppService } from './app.service';
import { VoidDangerAcceptedComponent } from './void-danger-accepted/void-danger-accepted.component';
import { VoidOtherIssueComponent } from './void-other-issue/void-other-issue.component';
import { VoidDuplicateTicketsComponent } from './void-duplicate-tickets/void-duplicate-tickets.component';
import { VoidNotParticipateComponent } from './void-not-participate/void-not-participate.component';
import { VoidEarlyKickOffComponent } from './void-early-kick-off/void-early-kick-off.component';
import { VoidAbnormalBetComponent } from './void-abnormal-bet/void-abnormal-bet.component';
import { VoidWrongMarketOfferedComponent } from './void-wrong-market-offered/void-wrong-market-offered.component';
import { MenuBarComponent } from '../../utility/components/menu-bar/menu-bar.component';
import { BlockUiModule } from '../../utility/components/block-ui/block-ui.module';
import { TemplateService } from '../../utility/components/template-message/template-message/services/template.service';
import { PopupService } from './services/popup.service';
import { CheckRequestService } from './services/check-request.service';
import { LoadDataService } from './services/load-data.service';
import { SubmitVoidService } from './services/submit-void.service';
import { InsertQueueService } from './services/insert-queue.service';
import { CheckVoidPermissionService } from './services/check-void-permission.service';
import { LogChangeContentService } from './services/log-change-content.service';
import { TicketsService } from './services/tickets.service';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [VoidDangerAcceptedComponent, VoidOtherIssueComponent, VoidDuplicateTicketsComponent,
    VoidNotParticipateComponent, VoidEarlyKickOffComponent, VoidAbnormalBetComponent,
    VoidWrongMarketOfferedComponent, MenuBarComponent, BlockUiModule],
  providers: [AppService, SignalRService, TemplateService, PopupService, CheckRequestService, LoadDataService,
    SubmitVoidService, InsertQueueService, CheckVoidPermissionService, LogChangeContentService, TicketsService]
})
export class AppComponent implements OnInit {
  requestId: number;
  requestDetail = new RequestDetailViewModel();
  isBlockUI: boolean;
  remark: string[];
  private isReadyRender = false;

  appService = inject(AppService);
  signalRService = inject(SignalRService);

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
      || StaticService.isTechnicalError(this.requestDetail.request?.issueTypeId)
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
    return StaticService.isWrongMarketOffered(this.requestDetail.request?.issueTypeId);
  }

  isShowVoidOtherIssue(): boolean {
    return !this.isShowVoidDuplicateTickets() && !this.isLikelyVoidDangerAccepted() && !this.isShowVoidWrongMarketOffered()
      && !this.isLikelyVoidNotParticipate() && !this.isLikelyVoidEarlyKickOff() && !this.isShowVoidAbnormalBet();
  }
}
