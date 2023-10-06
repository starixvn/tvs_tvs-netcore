import { Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { Subscription, timer } from 'rxjs';
import { RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { TemplateMessageComponent } from '../../../utility/components/template-message/template-message/template-message.component';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { LABELS } from '../../../utility/constants/labels';
import { IssueTypesModel } from '../../../utility/models/issue-type.model';
import { CommonService } from '../../../utility/services/common.service';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { CheckRequestService } from '../services/check-request.service';
import { PopupService } from '../services/popup.service';
import { VoidPageService } from '../void-early-kick-off/services/void-page.service';
import { TicketsService } from '../services/tickets.service';
import { VoidPageEarlyKickOffModel } from './models/void-page-early-kick-off.model';
import { SubmitVoidService } from './services/submit-void.service';

@Component({
  selector: 'void-early-kick-off',
  templateUrl: './void-early-kick-off.component.html',
  styleUrls: ['./void-early-kick-off.component.scss']
})
export class VoidEarlyKickOffComponent implements OnInit {
  @Input('requestDetail') requestDetail: RequestDetailViewModel;
  @ViewChildren("templateMessage") templateMessageViewChildren: QueryList<TemplateMessageComponent>;

  public primitiveProperty = new PrimitiveProperty();
  public voidMatches: VoidPageEarlyKickOffModel[] = [];
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
    private readonly commonService: CommonService,
    private readonly element: ElementRef) {
    this.tooltip.element = this.element;
  }

  async ngOnInit(): Promise<void> {
    this.primitiveProperty.isBlockUI = true;
    this.primitiveProperty.userName = document.body.getAttribute('user-name');
    this.issueTypes = await this.commonService.getIssueTypes();
    this.voidMatches = await this.voidPageService.getBasicVoidMatchesData(this.issueTypes, this.requestDetail);
    this.isLoadedBasicData = true;
    this.primitiveProperty.isBlockUI = false;

    await this.voidPageService.loadUnderneathVoidMatchesData(this.voidMatches, this.requestDetail);
    this.isLoadedUnderneathData = true;
  }

  async onClickShowVoidTickets(voidMatch: VoidPageEarlyKickOffModel): Promise<void> {
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
      await this.ticketsService.loadVoidTicketsFullOnFirstTime(voidMatch, this.requestDetail, voidMatch.matchModel);
    }
  }

  async onPagingTicketsChange(voidMatch: VoidPageEarlyKickOffModel): Promise<void> {
    await this.ticketsService.loadVoidTicketsFullOnPagingChange(voidMatch, this.requestDetail);
  }

  async exportTickets(voidMatch: VoidPageEarlyKickOffModel) {
    const maxPagingItems = 100000;
    if (voidMatch.pagingVoidTickets.total > maxPagingItems) {
      this.popupService.showWarningExportExcel();
    } else {
      await this.ticketsService.exportTicketsAsExcelFile(voidMatch, this.requestDetail, voidMatch.matchModel);
    }
  }

  async onClickShowTemplateMessage(voidMatch: VoidPageEarlyKickOffModel): Promise<void> {
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

  isShowAffectedLicenseeArea(voidMatch: VoidPageEarlyKickOffModel): boolean {
    return voidMatch.affectedLicensee.show && voidMatch.affectedLicensee.licenseesName.length > 0
      || voidMatch.chinaViewLicensee.show && voidMatch.chinaViewLicensee.licenseesName.length > 0
      || voidMatch.jollyViewLicensee.show && voidMatch.jollyViewLicensee.licenseesName.length > 0
      || voidMatch.affectedInstantLicensee.show && voidMatch.affectedInstantLicensee.licenseesName.length > 0
      || voidMatch.cashOutLicensee.show && voidMatch.cashOutLicensee.licenseesName.length > 0
      || voidMatch.cancelCashOutLicensee.show && voidMatch.cancelCashOutLicensee.licenseesName.length > 0;
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

  async checkLoadedFullDataBeforeShowMessageTemplate(voidMatch: VoidPageEarlyKickOffModel): Promise<void> {
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
    const templateMessageComponents = this.templateMessageViewChildren.toArray();
    if (this.isLoadedUnderneathData && templateMessageComponents.every(x => x.initialize)) {
      await this.submitVoidService.voidAllMatches(templateMessageComponents, this.voidMatches, this.requestDetail, this.primitiveProperty);
      this.afterLoadUnderneathDataSubscription.unsubscribe();
    }

    this.isRunningSubscriptionCallback = false;
  }
}
