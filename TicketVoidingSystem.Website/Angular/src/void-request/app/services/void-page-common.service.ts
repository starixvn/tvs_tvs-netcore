import { Injectable } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { Subscription, timer } from 'rxjs';
import { RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { TemplateMessageComponent } from '../../../utility/components/template-message/template-message/template-message.component';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { LABELS } from '../../../utility/constants/labels';
import { IssueTypesModel, SubIssueType } from '../../../utility/models/issue-type.model';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { VoidPageCommonItem } from '../models/void-page-common-item.model';
import { CheckRequestService } from '../services/check-request.service';
import { PopupService } from '../services/popup.service';
import { LoadDataService } from './load-data.service';
import { TicketsService } from './tickets.service';

@Injectable({
  providedIn: 'root'
})
export class VoidPageCommonService {
  constructor(
    private readonly clipboardService: ClipboardService,
    private readonly popupService: PopupService,
    private readonly ticketsService: TicketsService,
    private readonly checkRequestService: CheckRequestService,
    private readonly loadDataService: LoadDataService
  ) { }
  private readonly observableTimer = timer(0, 100);

  public showWarningExportExcel() {
    this.popupService.showWarningExportExcel();
  }

  public async isRequestModified(requestId: number, currentModifiedDate: Date): Promise<boolean> {
    return this.checkRequestService.isRequestModified(requestId, currentModifiedDate);
  }

  async exportTickets(voidPageItem: VoidPageCommonItem, requestDetail: RequestDetailViewModel) {
    const maxPagingItems = 100000;
    if (voidPageItem.pagingVoidTickets.total > maxPagingItems) {
      this.showWarningExportExcel();
    } else {
      await this.ticketsService.exportTicketsAsExcelFile(voidPageItem, requestDetail, voidPageItem.matchModel);
    }
  }

  async onClickShowVoidTickets(voidPageItem: VoidPageCommonItem, requestDetail: RequestDetailViewModel, primitiveProperty: CommonPrimitiveProperty, allVoidPageItems?: VoidPageCommonItem[]): Promise<void> {
    this.loadDataService.onClickShowVoidTickets(voidPageItem, requestDetail, primitiveProperty, allVoidPageItems);
  }

  async checkLoadedFullDataBeforeVoid(voidPageItems: VoidPageCommonItem[], templateMessageViewChilds: TemplateMessageComponent[], primitiveProperty: CommonPrimitiveProperty,
    afterLoadUnderneathDataSubscription: Subscription): Promise<void> {
      this.loadDataService.checkLoadedFullDataBeforeVoid(voidPageItems, templateMessageViewChilds, primitiveProperty, afterLoadUnderneathDataSubscription);
  }

  async onClickShowTemplateMessage(voidPageItem: VoidPageCommonItem, primitiveProperty: CommonPrimitiveProperty, requestDetail: RequestDetailViewModel,
    afterLoadUnderneathDataSubscription: Subscription, allVoidPageItems?: VoidPageCommonItem[]): Promise<void> {
      this.loadDataService.onClickShowTemplateMessage(voidPageItem, primitiveProperty, requestDetail, afterLoadUnderneathDataSubscription, allVoidPageItems);
  }

  onClickCopyLicenseesToClipboard(text: string): void {
    this.clipboardService.copyFromContent(text);
    alert('The Licensee list has been copied to clipboard.');
  }

  onClickVoidAllMatches(voidPageItems: VoidPageCommonItem[], templateMessageViewChilds: TemplateMessageComponent[],
    afterLoadUnderneathDataSubscription: Subscription, primitiveProperty: CommonPrimitiveProperty, tooltip: Tooltip): void {
    if (!primitiveProperty.userPassword) {
      tooltip.display('password', LABELS.INPUT_PASSWORD);
      return;
    }

    if (afterLoadUnderneathDataSubscription) {
      afterLoadUnderneathDataSubscription.unsubscribe();
    }

    afterLoadUnderneathDataSubscription = this.observableTimer.subscribe(async () => {
      await this.checkLoadedFullDataBeforeVoid(voidPageItems, templateMessageViewChilds, primitiveProperty, afterLoadUnderneathDataSubscription);
    });
  }

  getDisplayIssueTypeName(issueTypeId: number, subIssueTypeModel: SubIssueType, issueTypes: IssueTypesModel): string {
    const currentIssueType = issueTypes.issueTypes.find(x => x.issueTypeId === issueTypeId);
    const displayName = currentIssueType.issueTypeName === subIssueTypeModel.subIssueTypeName ? currentIssueType.issueTypeName
      : `${currentIssueType.issueTypeName} - ${subIssueTypeModel.subIssueTypeName}`;

    return displayName;
  }
}
