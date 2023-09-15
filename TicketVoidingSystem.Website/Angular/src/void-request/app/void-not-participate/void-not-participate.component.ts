import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { TemplateMessageComponent } from '../../../utility/components/template-message/template-message/template-message.component';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { IssueTypesModel } from '../../../utility/models/issue-type.model';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { TicketsService } from '../services/tickets.service';
import { VoidPageCommonService } from '../services/void-page-common.service';
import { VoidNotParticipateModel } from './models/void-page-not-participate.model';
import { VoidPageService } from './services/void-page.service';

@Component({
  selector: 'void-not-participate',
  templateUrl: './void-not-participate.component.html',
  styleUrls: ['./void-not-participate.component.scss']
})
export class VoidNotParticipateComponent implements OnInit {
  @Input('requestDetail') requestDetail: RequestDetailViewModel;
  @ViewChild("templateMessage") templateMessageViewChild: TemplateMessageComponent;

  public primitiveProperty = new CommonPrimitiveProperty();
  public voidPageItem: VoidNotParticipateModel;
  public issueTypes: IssueTypesModel;
  private readonly afterLoadUnderneathDataSubscription: Subscription;
  private readonly observableTimer = timer(0, 100);
  public tooltip = new Tooltip();
  constructor(
    private readonly element: ElementRef,
    private readonly ticketsService: TicketsService,
    private readonly voidPageService: VoidPageService,
    private readonly voidPageCommonService: VoidPageCommonService
  ) {
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

  isShowAffectedLicenseeArea(voidPageItem: VoidNotParticipateModel): boolean {
    return this.voidPageCommonService.isShowAffectedLicenseeArea(voidPageItem);
  }

  onClickCopyLicenseesToClipboard(text: string): void {
    this.voidPageCommonService.onClickCopyLicenseesToClipboard(text);
  }

  onClickVoidAllMatches(): void {
    this.voidPageCommonService.onClickVoidAllMatches([this.voidPageItem], [this.templateMessageViewChild], this.afterLoadUnderneathDataSubscription, this.primitiveProperty, this.tooltip);
  }
}
