import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { RequestDetailViewModel } from '../../../add-request-new/models/request-detail.model';
import { LicenseeAffectedListComponent } from '../../../utility/components/licensee-affected-list/licensee-affected-list.component';
import { TooltipComponent } from '../../../utility/components/tooltip/tooltip.component';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { IssueTypesModel } from '../../../utility/models/issue-type.model';
import { StaticService } from '../../../utility/services/static.service';
import { MessageAreaComponent } from '../message-area/message-area.component';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { PasswordAreaComponent } from '../password-area/password-area.component';
import { TicketsService } from '../services/tickets.service';
import { VoidPageCommonService } from '../services/void-page-common.service';
import { TicketsListComponent } from '../tickets-list/tickets-list.component';
import { VoidPageService } from '../void-early-kick-off/services/void-page.service';
import { VoidPageEarlyKickOffModel } from './models/void-page-early-kick-off.model';
import { TemplateMessageService } from './services/template-message.service';

@Component({
  standalone: true,
  selector: 'void-early-kick-off',
  templateUrl: './void-early-kick-off.component.html',
  styleUrls: ['./void-early-kick-off.component.scss'],
  imports: [CommonModule, LicenseeAffectedListComponent, TicketsListComponent, MessageAreaComponent,
    PasswordAreaComponent, TooltipComponent],
  providers: [VoidPageService, TemplateMessageService]
})
export class VoidEarlyKickOffComponent implements OnInit {
  @Input('requestDetail') requestDetail: RequestDetailViewModel;
  @ViewChildren("messageArea") messageAreaComponents: QueryList<MessageAreaComponent>;

  public primitiveProperty = new CommonPrimitiveProperty();
  public voidPageItems: VoidPageEarlyKickOffModel[] = [];
  public issueTypes: IssueTypesModel;
  public tooltip = new Tooltip();
  private readonly afterLoadUnderneathDataSubscription: Subscription;

  voidPageService = inject(VoidPageService);
  ticketsService = inject(TicketsService);
  voidPageCommonService = inject(VoidPageCommonService);
  element = inject(ElementRef);

  constructor() {
    this.tooltip.element = this.element;
  }

  async ngOnInit(): Promise<void> {
    this.primitiveProperty.isBlockUI = true;
    this.primitiveProperty.userName = document.body.getAttribute('user-name');
    this.issueTypes = await this.voidPageService.getIssueTypes();
    this.voidPageItems = await this.voidPageService.getBasicVoidPageItemsData(this.issueTypes, this.requestDetail);
    this.primitiveProperty.isLoadedBasicData = true;
    this.primitiveProperty.isBlockUI = false;

    await this.voidPageService.loadUnderneathVoidPageItemsData(this.voidPageItems, this.requestDetail);
    this.primitiveProperty.isLoadedUnderneathData = true;
  }

  async onClickShowVoidTickets(voidPageItem: VoidPageEarlyKickOffModel): Promise<void> {
    this.voidPageCommonService.onClickShowVoidTickets(voidPageItem, this.requestDetail, this.primitiveProperty, this.voidPageItems);
  }

  async onPagingTicketsChange(voidPageItem: VoidPageEarlyKickOffModel): Promise<void> {
    await this.ticketsService.loadVoidTicketsFullOnPagingChange(voidPageItem, this.requestDetail);
  }

  async exportTickets(voidPageItem: VoidPageEarlyKickOffModel) {
    this.voidPageCommonService.exportTickets(voidPageItem, this.requestDetail);
  }

  async onClickShowTemplateMessage(voidPageItem: VoidPageEarlyKickOffModel): Promise<void> {
    this.voidPageCommonService.onClickShowTemplateMessage(voidPageItem, this.primitiveProperty, this.requestDetail, this.afterLoadUnderneathDataSubscription, this.voidPageItems);
  }

  onClickCopyLicenseesToClipboard(text: string): void {
    this.voidPageCommonService.onClickCopyLicenseesToClipboard(text);
  }

  onClickVoidAllMatches(): void {
    this.voidPageCommonService.onClickVoidAllMatches(this.voidPageItems, this.messageAreaComponents?.toArray(), this.afterLoadUnderneathDataSubscription, this.primitiveProperty, this.tooltip);
  }

  updateDetailViewModel(): void {
    this.voidPageItems[0].detailViewModel = this.requestDetail;
  }

  getKickOffDate(matchId: number): string {
    return this.requestDetail.earlyKickOffModels.find(x => x.matchId === matchId).kickOffTime;
  }

  public isShowLogInfo(): boolean {
    return StaticService.isEarlyKickOff(this.requestDetail.request.issueTypeId) || StaticService.isWrongKickOff(this.requestDetail.request.issueTypeId);
  }
}
