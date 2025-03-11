import { Component, inject, OnInit } from '@angular/core';
import { RequestDetailViewModel } from '../../edit-request/app/request.model';
import { BlockUiModule } from '../../utility/components/block-ui/block-ui.module';
import { MenuBarComponent } from '../../utility/components/menu-bar/menu-bar.component';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { StaticService } from '../../utility/services/static.service';
import { AppService } from './app.service';
import { VoidAbnormalBetComponent } from './void-abnormal-bet/void-abnormal-bet.component';
import { VoidArchivedTicketComponent } from "./void-archived-ticket/void-archived-ticket.component";
import { VoidDangerAcceptedComponent } from './void-danger-accepted/void-danger-accepted.component';
import { VoidDuplicateTicketsComponent } from './void-duplicate-tickets/void-duplicate-tickets.component';
import { VoidEarlyKickOffComponent } from './void-early-kick-off/void-early-kick-off.component';
import { VoidNotParticipateComponent } from './void-not-participate/void-not-participate.component';
import { VoidOtherIssueComponent } from './void-other-issue/void-other-issue.component';
import { VoidWrongMarketOfferedComponent } from './void-wrong-market-offered/void-wrong-market-offered.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [VoidDangerAcceptedComponent, VoidOtherIssueComponent, VoidDuplicateTicketsComponent,
    VoidNotParticipateComponent, VoidEarlyKickOffComponent, VoidAbnormalBetComponent,
    VoidWrongMarketOfferedComponent, MenuBarComponent, BlockUiModule, VoidArchivedTicketComponent]
})
export class AppComponent implements OnInit {
  requestId: number;
  requestDetail = new RequestDetailViewModel();
  isBlockUI: boolean;
  remark: string[];
  private isReadyRender = false;
  issueTypeId: number;
  appService = inject(AppService);
  signalRService = inject(SignalRService);

  async ngOnInit(): Promise<void> {
    this.isBlockUI = true;
    this.remark = await this.appService.getRemark();
    const url = window.location.href;
    const params = url.split('/');
    this.requestId = parseInt(params[params.length - 1], 10);
    this.requestDetail = await this.appService.getRequestById(this.requestId);
    this.requestDetail.requestId = this.requestId;
    this.requestDetail.lastModifiedDate = (await this.appService.getLastModifiedDate(this.requestId)).lastModifiedDate;
    this.issueTypeId = this.requestDetail.request?.issueTypeId;
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
    return StaticService.isDangerAccepted(this.issueTypeId)
      || StaticService.isWrongOU(this.issueTypeId)
      || StaticService.isWrong1stOU(this.issueTypeId)
      || StaticService.isWrongHDP(this.issueTypeId)
      || StaticService.isRedCard(this.issueTypeId)
      || StaticService.isWrong1stHDP(this.issueTypeId)
      || StaticService.isWrongOdds(this.issueTypeId);
  }

  isShowVoidDuplicateTickets(): boolean {
    return StaticService.isDuplicateTickets(this.issueTypeId);
  }

  isLikelyVoidNotParticipate(): boolean {
    return StaticService.isNotParticipate(this.issueTypeId)
      || StaticService.isWrongOddsSportsBook(this.issueTypeId)
      || StaticService.isTechnicalError(this.issueTypeId)
      || StaticService.isReducedOver(this.issueTypeId)
      || StaticService.isAbandoned(this.issueTypeId)
      || StaticService.isOtherIssues(this.issueTypeId);
  }

  isLikelyVoidEarlyKickOff(): boolean {
    return StaticService.isEarlyKickOff(this.issueTypeId)
      || StaticService.isWrongKickOff(this.issueTypeId)
      || StaticService.isWrongOfferedName(this.issueTypeId);
  }

  isShowVoidAbnormalBet(): boolean {
    return StaticService.isAbnormalBet(this.issueTypeId);
  }

  isShowVoidWrongMarketOffered(): boolean {
    return StaticService.isWrongMarketOffered(this.issueTypeId);
  }

  isShowVoidArchivedTicket(): boolean {
    return StaticService.isArchivedTicket(this.issueTypeId)
      || StaticService.isAbnormalAccount(this.issueTypeId);
  }

  isShowVoidOtherIssue(): boolean {
    return !this.isShowVoidDuplicateTickets() && !this.isLikelyVoidDangerAccepted() && !this.isShowVoidWrongMarketOffered()
      && !this.isLikelyVoidNotParticipate() && !this.isLikelyVoidEarlyKickOff() && !this.isShowVoidAbnormalBet()
      && !this.isShowVoidArchivedTicket();
  }
}
