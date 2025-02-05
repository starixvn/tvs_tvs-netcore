import { Injectable, inject } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { Subscription, timer } from 'rxjs';
import { RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { LABELS } from '../../../utility/constants/labels';
import { IssueTypesModel, SubIssueType } from '../../../utility/models/issue-type.model';
import { MessageAreaComponent } from '../message-area/message-area.component';
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
  clipboardService = inject(ClipboardService);
  popupService = inject(PopupService);
  ticketsService = inject(TicketsService);
  checkRequestService = inject(CheckRequestService);
  loadDataService = inject(LoadDataService);
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
      await this.ticketsService.exportTicketsAsExcelFile(voidPageItem, requestDetail);
    }
  }

  async onClickShowVoidTickets(voidPageItem: VoidPageCommonItem, requestDetail: RequestDetailViewModel, primitiveProperty: CommonPrimitiveProperty, allVoidPageItems?: VoidPageCommonItem[]): Promise<void> {
    this.loadDataService.onClickShowVoidTickets(voidPageItem, requestDetail, primitiveProperty, allVoidPageItems);
  }

  async checkLoadedFullDataBeforeVoid(voidPageItems: VoidPageCommonItem[], messageAreaComponents: MessageAreaComponent[], primitiveProperty: CommonPrimitiveProperty,
    afterLoadUnderneathDataSubscription: Subscription): Promise<void> {
      this.loadDataService.checkLoadedFullDataBeforeVoid(voidPageItems, messageAreaComponents, primitiveProperty, afterLoadUnderneathDataSubscription);
  }

  async onClickShowTemplateMessage(voidPageItem: VoidPageCommonItem, primitiveProperty: CommonPrimitiveProperty, requestDetail: RequestDetailViewModel,
    afterLoadUnderneathDataSubscription: Subscription, allVoidPageItems?: VoidPageCommonItem[]): Promise<void> {
      this.loadDataService.onClickShowTemplateMessage(voidPageItem, primitiveProperty, requestDetail, afterLoadUnderneathDataSubscription, allVoidPageItems);
  }

  onClickCopyLicenseesToClipboard(text: string): void {
    this.clipboardService.copyFromContent(text);
    alert('The Licensee list has been copied to clipboard.');
  }

  onClickVoidAllMatches(voidPageItems: VoidPageCommonItem[], messageAreaComponents: MessageAreaComponent[],
    afterLoadUnderneathDataSubscription: Subscription, primitiveProperty: CommonPrimitiveProperty, tooltip: Tooltip): void {
    if (!primitiveProperty.userPassword) {
      tooltip.display('password', LABELS.INPUT_PASSWORD);
      return;
    }

    if (afterLoadUnderneathDataSubscription) {
      afterLoadUnderneathDataSubscription.unsubscribe();
    }

    afterLoadUnderneathDataSubscription = this.observableTimer.subscribe(async () => {
      await this.checkLoadedFullDataBeforeVoid(voidPageItems, messageAreaComponents, primitiveProperty, afterLoadUnderneathDataSubscription);
    });
  }

  getDisplayIssueTypeName(issueTypeId: number, subIssueTypeModel: SubIssueType, issueTypes: IssueTypesModel): string {
    const currentIssueType = issueTypes.issueTypes.find(x => x.issueTypeId === issueTypeId);
    const displayName = currentIssueType.issueTypeName === subIssueTypeModel.subIssueTypeName ? currentIssueType.issueTypeName
      : `${currentIssueType.issueTypeName} - ${subIssueTypeModel.subIssueTypeName}`;

    return displayName;
  }
}
