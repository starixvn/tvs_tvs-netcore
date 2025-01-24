import { Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { AbnormalFilterBy } from '../../../utility/constants/config';
import { IssueTypesModel } from '../../../utility/models/issue-type.model';
import { StaticService } from '../../../utility/services/static.service';
import { MessageAreaComponent } from '../message-area/message-area.component';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { TicketsService } from '../services/tickets.service';
import { VoidPageCommonService } from '../services/void-page-common.service';
import { VoidPageDuplicateTicketsModel } from './models/void-page-duplicate-tickets.model';
import { VoidPageService } from './services/void-page.service';
import { CommonModule } from '@angular/common';
import { LicenseeAffectedListComponent } from '../../../utility/components/licensee-affected-list/licensee-affected-list.component';
import { PasswordAreaComponent } from '../password-area/password-area.component';
import { TicketsListComponent } from '../tickets-list/tickets-list.component';
import { TooltipComponent } from '../../../utility/components/tooltip/tooltip.component';

@Component({
  standalone: true,
  selector: 'void-duplicate-tickets',
  templateUrl: './void-duplicate-tickets.component.html',
  styleUrls: ['./void-duplicate-tickets.component.scss'],
  imports: [CommonModule, LicenseeAffectedListComponent, TicketsListComponent, MessageAreaComponent,
    PasswordAreaComponent, TooltipComponent],
    providers: [TicketsService, VoidPageService, VoidPageCommonService]
})
export class VoidDuplicateTicketsComponent implements OnInit {
  @Input('requestDetail') requestDetail: RequestDetailViewModel;
  @ViewChild("messageArea") messageAreaComponent: MessageAreaComponent;

  public primitiveProperty = new CommonPrimitiveProperty();
  public voidPageItem: VoidPageDuplicateTicketsModel;
  public issueTypes: IssueTypesModel;
  private readonly afterLoadUnderneathDataSubscription: Subscription;
  public tooltip = new Tooltip();

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
    this.voidPageItem = await this.voidPageService.getBasicVoidPageItemsData(this.issueTypes, this.requestDetail);
    this.primitiveProperty.isLoadedBasicData = true;
    this.primitiveProperty.isBlockUI = false;

    await this.voidPageService.loadUnderneathVoidPageItemsData(this.voidPageItem, this.requestDetail);
    this.primitiveProperty.isLoadedUnderneathData = true;
  }

  async onClickShowVoidTickets(voidPageItem: VoidPageDuplicateTicketsModel): Promise<void> {
    this.voidPageCommonService.onClickShowVoidTickets(voidPageItem, this.requestDetail, this.primitiveProperty);
  }

  async onPagingTicketsChange(voidPageItem: VoidPageDuplicateTicketsModel): Promise<void> {
    await this.ticketsService.loadVoidTicketsFullOnPagingChange(voidPageItem, this.requestDetail);
  }

  async exportTickets(voidPageItem: VoidPageDuplicateTicketsModel) {
    this.voidPageCommonService.exportTickets(voidPageItem, this.requestDetail);
  }

  async onClickShowTemplateMessage(voidPageItem: VoidPageDuplicateTicketsModel): Promise<void> {
    this.voidPageCommonService.onClickShowTemplateMessage(voidPageItem, this.primitiveProperty, this.requestDetail, this.afterLoadUnderneathDataSubscription);
  }

  onClickCopyLicenseesToClipboard(text: string): void {
    this.voidPageCommonService.onClickCopyLicenseesToClipboard(text);
  }

  onClickVoidAllMatches(): void {
    this.voidPageCommonService.onClickVoidAllMatches([this.voidPageItem], [this.messageAreaComponent], this.afterLoadUnderneathDataSubscription, this.primitiveProperty, this.tooltip);
  }

  public isDuplicateTicketsMixParlay(): boolean {
    return StaticService.isDuplicateTickets(this.requestDetail.request.issueTypeId.toString()) && this.requestDetail.duplicateTicketsModel.filterBy === AbnormalFilterBy.MIX_PARLAY;
  }
}
