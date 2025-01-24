import { TicketsListComponent } from './../tickets-list/tickets-list.component';
import { Component, ElementRef, inject, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { IssueTypesModel } from '../../../utility/models/issue-type.model';
import { MessageAreaComponent } from '../message-area/message-area.component';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { TicketsService } from '../services/tickets.service';
import { VoidPageCommonService } from '../services/void-page-common.service';
import { VoidWrongMarketOfferedModel } from './models/void-wrong-market-offered.model';
import { VoidPageService } from './services/void-page.service';
import { UtilityModule } from '../../../utility/utility.module';
import { CommonModule } from '@angular/common';
import { PasswordAreaComponent } from '../password-area/password-area.component';
import { LogInfoTicketCountComponent } from '../../../utility/components/log-info-detail/log-info-ticket-count/log-info-ticket-count.component';
import { LicenseeAffectedListComponent } from '../../../utility/components/licensee-affected-list/licensee-affected-list.component';
import { TooltipComponent } from '../../../utility/components/tooltip/tooltip.component';
import { TemplateMessageService } from './services/template-message.service';

@Component({
  standalone: true,
  selector: 'void-wrong-market-offered',
  templateUrl: './void-wrong-market-offered.component.html',
  styleUrls: ['./void-wrong-market-offered.component.scss'],
  imports: [UtilityModule, CommonModule, PasswordAreaComponent, MessageAreaComponent, TooltipComponent, TicketsListComponent,
    LogInfoTicketCountComponent, LicenseeAffectedListComponent],
    providers: [TicketsService, VoidPageService, VoidPageCommonService, TemplateMessageService]
})
export class VoidWrongMarketOfferedComponent implements OnInit {
  @Input('requestDetail') requestDetail: RequestDetailViewModel;
  @ViewChildren("messageArea") messageAreaComponents: QueryList<MessageAreaComponent>;

  public primitiveProperty = new CommonPrimitiveProperty();
  public voidPageItems: VoidWrongMarketOfferedModel[] = [];
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

  async onClickShowVoidTickets(voidPageItem: VoidWrongMarketOfferedModel): Promise<void> {
    this.voidPageCommonService.onClickShowVoidTickets(voidPageItem, this.requestDetail, this.primitiveProperty, this.voidPageItems);
  }

  async onPagingTicketsChange(voidPageItem: VoidWrongMarketOfferedModel): Promise<void> {
    await this.ticketsService.loadVoidTicketsFullOnPagingChange(voidPageItem, this.requestDetail);
  }

  async exportTickets(voidPageItem: VoidWrongMarketOfferedModel) {
    this.voidPageCommonService.exportTickets(voidPageItem, this.requestDetail);
  }

  async onClickShowTemplateMessage(voidPageItem: VoidWrongMarketOfferedModel): Promise<void> {
    this.voidPageCommonService.onClickShowTemplateMessage(voidPageItem, this.primitiveProperty, this.requestDetail, this.afterLoadUnderneathDataSubscription, this.voidPageItems);
  }

  onClickCopyLicenseesToClipboard(text: string): void {
    this.voidPageCommonService.onClickCopyLicenseesToClipboard(text);
  }

  onClickVoidAllMatches(): void {
    this.voidPageCommonService.onClickVoidAllMatches(this.voidPageItems, this.messageAreaComponents.toArray(), this.afterLoadUnderneathDataSubscription, this.primitiveProperty, this.tooltip);
  }
}
