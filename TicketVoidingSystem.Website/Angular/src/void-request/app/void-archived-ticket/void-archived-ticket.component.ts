import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
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
import { VoidArchivedTicketModel } from './models/void-archived-ticket.model';
import { VoidPageService } from './services/void-page.service';

@Component({
  selector: 'void-archived-ticket',
  standalone: true,
  templateUrl: './void-archived-ticket.component.html',
  styleUrl: './void-archived-ticket.component.scss',
  imports: [CommonModule, LicenseeAffectedListComponent, TicketsListComponent, MessageAreaComponent,
    PasswordAreaComponent, TooltipComponent],
  providers: [VoidPageService]
})
export class VoidArchivedTicketComponent implements OnInit {
  @Input('requestDetail') requestDetail: RequestDetailViewModel;
  @ViewChild("messageArea") messageAreaComponent: MessageAreaComponent;
  element = inject(ElementRef);
  ticketsService = inject(TicketsService);
  voidPageService = inject(VoidPageService);
  voidPageCommonService = inject(VoidPageCommonService);

  public primitiveProperty = new CommonPrimitiveProperty();
  public voidPageItem: VoidArchivedTicketModel;
  public issueTypes: IssueTypesModel;
  private readonly afterLoadUnderneathDataSubscription: Subscription;
  public tooltip = new Tooltip();

  constructor() {
    this.tooltip.element = this.element;
  }

  async ngOnInit(): Promise<void> {
    this.primitiveProperty.isBlockUI = true;
    this.primitiveProperty.userName = document.body.getAttribute('user-name');
    this.issueTypes = await this.voidPageService.getIssueTypes();
    this.voidPageItem = await this.voidPageService.getBasicVoidPageItemsData(this.issueTypes, this.requestDetail);
    this.primitiveProperty.isLoadedBasicData = true;
    this.primitiveProperty.isBlockUI = false;

    await this.voidPageService.loadUnderneathVoidPageItemsData(this.voidPageItem, this.requestDetail);
    this.primitiveProperty.isLoadedUnderneathData = true;
  }

  async onClickShowVoidTickets(voidPageItem: VoidArchivedTicketModel): Promise<void> {
    this.voidPageCommonService.onClickShowVoidTickets(voidPageItem, this.requestDetail, this.primitiveProperty);
  }

  async onPagingTicketsChange(voidPageItem: VoidArchivedTicketModel): Promise<void> {
    await this.ticketsService.loadVoidTicketsFullOnPagingChange(voidPageItem, this.requestDetail);
  }

  async exportTickets(voidPageItem: VoidArchivedTicketModel) {
    this.voidPageCommonService.exportTickets(voidPageItem, this.requestDetail);
  }

  async onClickShowTemplateMessage(voidPageItem: VoidArchivedTicketModel): Promise<void> {
    this.voidPageCommonService.onClickShowTemplateMessage(voidPageItem, this.primitiveProperty, this.requestDetail, this.afterLoadUnderneathDataSubscription);
  }

  onClickVoidAllMatches(): void {
    this.voidPageCommonService.onClickVoidAllMatches([this.voidPageItem], [this.messageAreaComponent], this.afterLoadUnderneathDataSubscription, this.primitiveProperty, this.tooltip);
  }

  isAbnormalAccount(): boolean {
    return StaticService.isAbnormalAccount(this.requestDetail.request.issueTypeId.toString());
  }

  getProducts(productIds: string): string {
    return productIds
      .replace('1', 'Sportsbook')
      .replace('2', 'Parlay')
      .replace('3', 'Bet Builder')
      .replace('4', 'Outright')
      .replace('5', 'Saba')
      .replace('6', 'Non-Sports')
      .replace(/,/g, ', ');
  }

  getStatus(statusIds: string): string {
    return statusIds
      .replace('0,1', 'Running')
      .replace('112', 'Won')
      .replace('113', 'Lose')
      .replace('111', 'Draw')
      .replace(/,/g, ', ');
  }
}
