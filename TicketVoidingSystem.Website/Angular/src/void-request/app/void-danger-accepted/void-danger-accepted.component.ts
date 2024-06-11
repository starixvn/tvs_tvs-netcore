import { Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import * as _ from 'lodash';
import { ClipboardService } from 'ngx-clipboard';
import { Subscription, timer } from 'rxjs';
import { RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { LABELS } from '../../../utility/constants/labels';
import { SubIssueTypeConstant } from '../../../utility/constants/sub-issue-type.constant';
import { IssueTypesModel } from '../../../utility/models/issue-type.model';
import { StaticService } from '../../../utility/services/static.service';
import { VoidMatch } from '../models/void-match.model';
import { CheckRequestService } from '../services/check-request.service';
import { PopupService } from './services/popup.service';
import { SubmitVoidService } from './services/submit-void.service';
import { TicketsService } from './services/tickets.service';
import { VoidPageService } from './services/void-page.service';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { MessageAreaComponent } from '../message-area/message-area.component';

@Component({
  selector: 'void-danger-accepted',
  templateUrl: './void-danger-accepted.component.html',
  styleUrls: ['./void-danger-accepted.component.scss']
})
export class VoidDangerAcceptedComponent implements OnInit {
  @Input('requestDetail') requestDetail: RequestDetailViewModel;
  @ViewChildren("messageArea") messageAreaViewChildren: QueryList<MessageAreaComponent>;

  public primitiveProperty = new CommonPrimitiveProperty();
  public voidMatches: VoidMatch[] = [];
  public isLoadedBasicData = false;
  public isLoadedUnderneathData = false;
  public issueTypes: IssueTypesModel;
  public tooltip = new Tooltip();
  private afterLoadUnderneathDataSubscription: Subscription;
  private readonly observableTimer = timer(0, 100);
  private isRunningSubscriptionCallback = false;
  constructor(
    private readonly voidPageService: VoidPageService,
    private readonly ticketsService: TicketsService,
    private readonly popupService: PopupService,
    private readonly submitVoidService: SubmitVoidService,
    private readonly checkRequestService: CheckRequestService,
    private readonly clipboardService: ClipboardService,
    private readonly element: ElementRef) {
    this.tooltip.element = this.element;
  }

  async ngOnInit(): Promise<void> {
    this.primitiveProperty.isBlockUI = true;
    this.primitiveProperty.userName = document.body.getAttribute('user-name');
    this.issueTypes = await this.voidPageService.getIssueTypes();
    this.voidMatches = await this.voidPageService.getBasicVoidMatchesData(this.issueTypes, this.requestDetail, this.primitiveProperty);
    this.isLoadedBasicData = true;
    this.primitiveProperty.isBlockUI = false;

    await this.voidPageService.loadUnderneathVoidMatchesData(this.voidMatches, this.requestDetail);
    this.isLoadedUnderneathData = true;
  }

  async onClickShowVoidTickets(voidMatch: VoidMatch): Promise<void> {
    if (!voidMatch.isShowTicketFull) {
      this.primitiveProperty.isBlockUI = true;
      const isRequestModified = await this.checkRequestService.isRequestModified(this.requestDetail.requestId, this.requestDetail.lastModifiedDate);
      this.primitiveProperty.isBlockUI = false;
      if (isRequestModified) {
        return;
      }
    }

    this.voidPageService.toggleTicketsArea(voidMatch, this.voidMatches);
    if (!voidMatch.isLoadedTicketFull) {
      await this.ticketsService.loadVoidTicketsFullOnFirstTime(voidMatch, this.requestDetail);
    }
  }

  async onPagingTicketsChange(voidMatch: VoidMatch): Promise<void> {
    await this.ticketsService.loadVoidTicketsFullOnPagingChange(voidMatch, this.requestDetail);
  }

  async exportTickets(voidMatch: VoidMatch) {
    const maxPagingItems = 100000;
    if (voidMatch.pagingVoidTickets.total > maxPagingItems) {
      this.popupService.showWarningExportExcel();
    } else {
      await this.ticketsService.exportTicketsAsExcelFile(voidMatch, this.requestDetail);
    }
  }

  async onClickShowTemplateMessage(voidMatch: VoidMatch): Promise<void> {
    if (!voidMatch.isShowTemplateMessage) {
      this.primitiveProperty.isBlockUI = true;
      const isRequestModified = await this.checkRequestService.isRequestModified(this.requestDetail.requestId, this.requestDetail.lastModifiedDate);
      this.primitiveProperty.isBlockUI = false;
      if (isRequestModified) {
        return;
      }
    }

    if (this.afterLoadUnderneathDataSubscription) {
      this.afterLoadUnderneathDataSubscription.unsubscribe();
    }

    this.afterLoadUnderneathDataSubscription = this.observableTimer.subscribe(async () => {
      await this.checkLoadedFullDataBeforeShowMessageTemplate(voidMatch);
    });
  }

  onClickCopyLicenseesToClipboard(text: string): void {
    this.clipboardService.copyFromContent(text);
    alert('The Licensee list has been copied to clipboard.');
  }

  onClickVoidAllMatches(): void {
    if (!this.primitiveProperty.userPassword) {
      this.tooltip.display('password', LABELS.INPUT_PASSWORD);
      return;
    }

    if (this.afterLoadUnderneathDataSubscription) {
      this.afterLoadUnderneathDataSubscription.unsubscribe();
    }

    this.afterLoadUnderneathDataSubscription = this.observableTimer.subscribe(async () => {
      await this.checkLoadedFullDataBeforeVoid();
    });
  }

  async checkLoadedFullDataBeforeShowMessageTemplate(voidMatch: VoidMatch): Promise<void> {
    if (this.isRunningSubscriptionCallback) {
      return;
    }
    this.isRunningSubscriptionCallback = true;
    this.primitiveProperty.isBlockUI = true;

    if (this.isLoadedUnderneathData) {
      this.voidPageService.toggleTemplateMessageArea(voidMatch, this.voidMatches);
      this.primitiveProperty.isBlockUI = false;
      this.afterLoadUnderneathDataSubscription.unsubscribe();
    }

    this.isRunningSubscriptionCallback = false;
  }

  async checkLoadedFullDataBeforeVoid(): Promise<void> {
    if (this.isRunningSubscriptionCallback) {
      return;
    }

    this.isRunningSubscriptionCallback = true;
    this.primitiveProperty.isBlockUI = true;
    const templateMessageComponents = this.messageAreaViewChildren.map(x => x.templateMessageViewChildren.toArray()).flat();
    if (this.isLoadedUnderneathData && templateMessageComponents.every(x => x.initialize)) {
      await this.submitVoidService.voidAllMatches(templateMessageComponents, this.voidMatches, this.requestDetail, this.primitiveProperty);
      this.afterLoadUnderneathDataSubscription.unsubscribe();
    }

    this.isRunningSubscriptionCallback = false;
  }

  public changeCheckBoxEarlyEvent(voidMatch: VoidMatch): void {
    voidMatch.templateValue.isCheckedEarlyEvent = voidMatch.isCheckedEarlyEvent;
    voidMatch.templateValue = _.clone(voidMatch.templateValue);
  }

  public isWrongHdp(): boolean {
    return StaticService.isWrongHDP(this.requestDetail.request?.issueTypeId.toString());
  }

  public isWrong1stHdp(): boolean {
    return StaticService.isWrong1stHDP(this.requestDetail.request?.issueTypeId.toString());
  }

  public isWrongOu(): boolean {
    return StaticService.isWrongOU(this.requestDetail.request?.issueTypeId.toString());
  }

  public isWrong1stOu(): boolean {
    return StaticService.isWrong1stOU(this.requestDetail.request?.issueTypeId.toString());
  }

  public isSubTypeWrongHdpOrWrong1stHdp(): boolean {
    return this.isSubTypeWrongHdp() || this.isSubTypeWrong1stHdp();
  }

  private isSubTypeWrongHdp(): boolean {
    return this.voidMatches[0].subIssueType.subIssueTypeId === SubIssueTypeConstant.WRONG_HDP;
  }

  private isSubTypeWrong1stHdp(): boolean {
    return this.voidMatches[0].subIssueType.subIssueTypeId === SubIssueTypeConstant.WRONG_1ST_HDP;
  }
}
