import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { Subscription, timer } from 'rxjs';
import { RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { TemplateMessageComponent } from '../../../utility/components/template-message/template-message/template-message.component';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { AbnormalFilterBy } from '../../../utility/constants/config';
import { LABELS } from '../../../utility/constants/labels';
import { IssueTypesModel } from '../../../utility/models/issue-type.model';
import { CommonService } from '../../../utility/services/common.service';
import { StaticService } from '../../../utility/services/static.service';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { CheckRequestService } from '../services/check-request.service';
import { PopupService } from '../services/popup.service';
import { TicketsService } from '../services/tickets.service';
import { VoidPageDuplicateTicketsModel } from './models/void-page-duplicate-tickets.model';
import { SubmitVoidService } from './services/submit-void.service';
import { VoidPageService } from './services/void-page.service';

@Component({
  selector: 'void-duplicate-tickets',
  templateUrl: './void-duplicate-tickets.component.html',
  styleUrls: ['./void-duplicate-tickets.component.scss']
})
export class VoidDuplicateTicketsComponent implements OnInit {
  @Input('requestDetail') requestDetail: RequestDetailViewModel;
  @ViewChild("templateMessage") templateMessageViewChild: TemplateMessageComponent;

  public primitiveProperty = new CommonPrimitiveProperty();
  public voidPageItem: VoidPageDuplicateTicketsModel;
  public issueTypes: IssueTypesModel;
  private afterLoadUnderneathDataSubscription: Subscription;
  private readonly observableTimer = timer(0, 100);
  public tooltip = new Tooltip();
  constructor(
    private readonly element: ElementRef,
    private readonly popupService: PopupService,
    private readonly commonService: CommonService,
    private readonly ticketsService: TicketsService,
    private readonly voidPageService: VoidPageService,
    private readonly clipboardService: ClipboardService,
    private readonly submitVoidService: SubmitVoidService,
    private readonly checkRequestService: CheckRequestService
  ) {
    this.tooltip.element = this.element;
   }

  async ngOnInit(): Promise<void> {
    this.primitiveProperty.isBlockUI = true;
    this.primitiveProperty.userName = document.body.getAttribute('user-name');
    this.issueTypes = await this.commonService.getIssueTypes();
    this.voidPageItem = await this.voidPageService.getBasicVoidPageItemsData(this.issueTypes, this.requestDetail);
    this.primitiveProperty.isLoadedBasicData = true;
    this.primitiveProperty.isBlockUI = false;

    await this.voidPageService.loadUnderneathVoidPageItemsData(this.voidPageItem, this.requestDetail);
    this.primitiveProperty.isLoadedUnderneathData = true;
  }

  async onClickShowVoidTickets(voidPageItem: VoidPageDuplicateTicketsModel): Promise<void> {
    if (!voidPageItem.isShowTicketFull) {
      this.primitiveProperty.isBlockUI = true;
      const isRequestModified = await this.checkRequestService.isRequestModified(this.requestDetail.requestId, this.requestDetail.lastModifiedDate);
      this.primitiveProperty.isBlockUI = false;
      if (isRequestModified) {
        return;
      }
    }

    this.voidPageService.toggleTicketsArea(voidPageItem);
    if (!voidPageItem.isLoadedTicketFull) {
      await this.ticketsService.loadVoidTicketsFullOnFirstTime(voidPageItem, this.requestDetail);
    }
  }

  async onPagingTicketsChange(voidPageItem: VoidPageDuplicateTicketsModel): Promise<void> {
    await this.ticketsService.loadVoidTicketsFullOnPagingChange(voidPageItem, this.requestDetail);
  }

  async exportTickets(voidPageItem: VoidPageDuplicateTicketsModel) {
    const maxPagingItems = 100000;
    if (voidPageItem.pagingVoidTickets.total > maxPagingItems) {
      this.popupService.showWarningExportExcel();
    } else {
      await this.ticketsService.exportTicketsAsExcelFile(voidPageItem, this.requestDetail, this.voidPageItem.matchModel);
    }
  }

  async onClickShowTemplateMessage(voidPageItem: VoidPageDuplicateTicketsModel): Promise<void> {
    if (!voidPageItem.isShowTemplateMessage) {
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
      await this.checkLoadedFullDataBeforeShowMessageTemplate(voidPageItem);
    });
  }

  isShowAffectedLicenseeArea(voidPageItem: VoidPageDuplicateTicketsModel): boolean {
    return voidPageItem.affectedLicensee.show && voidPageItem.affectedLicensee.licenseesName.length > 0
      || voidPageItem.chinaViewLicensee.show && voidPageItem.chinaViewLicensee.licenseesName.length > 0
      || voidPageItem.jollyViewLicensee.show && voidPageItem.jollyViewLicensee.licenseesName.length > 0
      || voidPageItem.affectedInstantLicensee.show && voidPageItem.affectedInstantLicensee.licenseesName.length > 0
      || voidPageItem.cashOutLicensee.show && voidPageItem.cashOutLicensee.licenseesName.length > 0;
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

  async checkLoadedFullDataBeforeShowMessageTemplate(voidPageItem: VoidPageDuplicateTicketsModel): Promise<void> {
    if (this.primitiveProperty.isRunningSubscriptionCallback) {
      return;
    }
    this.primitiveProperty.isRunningSubscriptionCallback = true;
    this.primitiveProperty.isBlockUI = true;

    if (this.primitiveProperty.isLoadedUnderneathData) {
      this.voidPageService.toggleTemplateMessageArea(voidPageItem);
      this.primitiveProperty.isBlockUI = false;
      this.afterLoadUnderneathDataSubscription.unsubscribe();
    }

    this.primitiveProperty.isRunningSubscriptionCallback = false;
  }

  async checkLoadedFullDataBeforeVoid(): Promise<void> {
    if (this.primitiveProperty.isRunningSubscriptionCallback) {
      return;
    }

    this.primitiveProperty.isRunningSubscriptionCallback = true;
    this.primitiveProperty.isBlockUI = true;
    if (this.primitiveProperty.isLoadedUnderneathData && this.isValidTemplcateMessage()) {
      await this.submitVoidService.voidDuplicateTickets(this.templateMessageViewChild, this.voidPageItem, this.primitiveProperty);
      this.afterLoadUnderneathDataSubscription.unsubscribe();
    }
    this.primitiveProperty.isBlockUI = false;
    this.primitiveProperty.isRunningSubscriptionCallback = false;
  }

  private isValidTemplcateMessage(): boolean {
    return this.voidPageItem.voidTicketsMini?.total > 0 ? this.templateMessageViewChild.initialize : true;
  }

  public isDuplicateTicketsMixParlay(): boolean {
    return StaticService.isDuplicateTickets(this.requestDetail.request.issueTypeId.toString()) && this.requestDetail.duplicateTicketsModel.filterBy === AbnormalFilterBy.MIX_PARLAY;
  }
}
