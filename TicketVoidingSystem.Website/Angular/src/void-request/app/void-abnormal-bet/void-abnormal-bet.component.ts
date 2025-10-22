import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { RequestDetailViewModel } from '../../../add-request-new/models/request-detail.model';
import { LicenseeAffectedListComponent } from '../../../utility/components/licensee-affected-list/licensee-affected-list.component';
import { TooltipComponent } from '../../../utility/components/tooltip/tooltip.component';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { IssueTypesModel } from '../../../utility/models/issue-type.model';
import { MessageAreaComponent } from '../message-area/message-area.component';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { PasswordAreaComponent } from '../password-area/password-area.component';
import { TicketsService } from '../services/tickets.service';
import { VoidPageCommonService } from '../services/void-page-common.service';
import { TicketsListComponent } from '../tickets-list/tickets-list.component';
import { VoidAbnormalBetModel } from './models/void-abnormal-bet.model';
import { VoidPageService } from './services/void-page.service';

@Component({
  standalone: true,
  selector: 'void-abnormal-bet',
  templateUrl: './void-abnormal-bet.component.html',
  styleUrls: ['./void-abnormal-bet.component.scss'],
  imports: [CommonModule, LicenseeAffectedListComponent, MessageAreaComponent, PasswordAreaComponent, TicketsListComponent, TooltipComponent],
  providers: [VoidPageService]
})
export class VoidAbnormalBetComponent implements OnInit {
  @Input('requestDetail') requestDetail: RequestDetailViewModel;
  @ViewChildren("messageArea") messageAreaComponents: QueryList<MessageAreaComponent>;

  public primitiveProperty = new CommonPrimitiveProperty();
  public voidPageItems: VoidAbnormalBetModel[] = [];
  public issueTypes: IssueTypesModel;
  public tooltip = new Tooltip();
  private readonly afterLoadUnderneathDataSubscription: Subscription;
  ticketsService = inject(TicketsService);
  voidPageService = inject(VoidPageService);
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

  async onClickShowVoidTickets(voidPageItem: VoidAbnormalBetModel): Promise<void> {
    this.voidPageCommonService.onClickShowVoidTickets(voidPageItem, this.requestDetail, this.primitiveProperty, this.voidPageItems);
  }

  async onPagingTicketsChange(voidPageItem: VoidAbnormalBetModel): Promise<void> {
    await this.ticketsService.loadVoidTicketsFullOnPagingChange(voidPageItem, this.requestDetail);
  }

  async exportTickets(voidPageItem: VoidAbnormalBetModel) {
    this.voidPageCommonService.exportTickets(voidPageItem, this.requestDetail);
  }

  async onClickShowTemplateMessage(voidPageItem: VoidAbnormalBetModel): Promise<void> {
    this.voidPageCommonService.onClickShowTemplateMessage(voidPageItem, this.primitiveProperty, this.requestDetail, this.afterLoadUnderneathDataSubscription, this.voidPageItems);
  }

  onClickCopyLicenseesToClipboard(text: string): void {
    this.voidPageCommonService.onClickCopyLicenseesToClipboard(text);
  }

  onClickVoidAllMatches(): void {
    this.voidPageCommonService.onClickVoidAllMatches(this.voidPageItems, this.messageAreaComponents?.toArray(), this.afterLoadUnderneathDataSubscription, this.primitiveProperty, this.tooltip);
  }
}
