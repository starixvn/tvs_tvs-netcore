import { TooltipComponent } from '../../../utility/components/tooltip/tooltip.component';
import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { IssueTypesModel } from '../../../utility/models/issue-type.model';
import { MessageAreaComponent } from '../message-area/message-area.component';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { TicketsService } from '../services/tickets.service';
import { VoidPageCommonService } from '../services/void-page-common.service';
import { VoidNotParticipateModel } from './models/void-page-not-participate.model';
import { VoidPageService } from './services/void-page.service';
import { CommonModule } from '@angular/common';
import { LicenseeAffectedListComponent } from '../../../utility/components/licensee-affected-list/licensee-affected-list.component';
import { TicketsListComponent } from '../tickets-list/tickets-list.component';
import { PasswordAreaComponent } from '../password-area/password-area.component';
import { LogInfoTicketCountComponent } from '../../../utility/components/log-info-detail/log-info-ticket-count/log-info-ticket-count.component';
import { TemplateMessageService } from './services/template-message.service';

@Component({
  standalone: true,
  selector: 'void-not-participate',
  templateUrl: './void-not-participate.component.html',
  styleUrls: ['./void-not-participate.component.scss'],
  imports: [CommonModule, LicenseeAffectedListComponent, TicketsListComponent, MessageAreaComponent,
    PasswordAreaComponent, TooltipComponent, LogInfoTicketCountComponent],
  providers: [VoidPageService, TemplateMessageService]
})
export class VoidNotParticipateComponent implements OnInit {
  @Input('requestDetail') requestDetail: RequestDetailViewModel;
  @ViewChild("messageArea") messageAreaComponent: MessageAreaComponent;
  element = inject(ElementRef);
  ticketsService = inject(TicketsService);
  voidPageService = inject(VoidPageService);
  voidPageCommonService = inject(VoidPageCommonService);

  public primitiveProperty = new CommonPrimitiveProperty();
  public voidPageItem: VoidNotParticipateModel;
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
    this.voidPageItem = await this.voidPageService.getBasicVoidPageItemsData(this.issueTypes, this.requestDetail, this.primitiveProperty);
    this.primitiveProperty.isLoadedBasicData = true;
    this.primitiveProperty.isBlockUI = false;

    await this.voidPageService.loadUnderneathVoidPageItemsData(this.voidPageItem, this.requestDetail);
    this.primitiveProperty.isLoadedUnderneathData = true;
  }

  async onClickShowVoidTickets(voidPageItem: VoidNotParticipateModel): Promise<void> {
    this.voidPageCommonService.onClickShowVoidTickets(voidPageItem, this.requestDetail, this.primitiveProperty);
  }

  async onPagingTicketsChange(voidPageItem: VoidNotParticipateModel): Promise<void> {
    await this.ticketsService.loadVoidTicketsFullOnPagingChange(voidPageItem, this.requestDetail);
  }

  async exportTickets(voidPageItem: VoidNotParticipateModel) {
    this.voidPageCommonService.exportTickets(voidPageItem, this.requestDetail);
  }

  async onClickShowTemplateMessage(voidPageItem: VoidNotParticipateModel): Promise<void> {
    this.voidPageCommonService.onClickShowTemplateMessage(voidPageItem, this.primitiveProperty, this.requestDetail, this.afterLoadUnderneathDataSubscription);
  }

  onClickCopyLicenseesToClipboard(text: string): void {
    this.voidPageCommonService.onClickCopyLicenseesToClipboard(text);
  }

  onClickVoidAllMatches(): void {
    this.voidPageCommonService.onClickVoidAllMatches([this.voidPageItem], [this.messageAreaComponent], this.afterLoadUnderneathDataSubscription, this.primitiveProperty, this.tooltip);
  }
}
