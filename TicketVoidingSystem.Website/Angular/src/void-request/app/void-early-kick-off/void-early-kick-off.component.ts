import { Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { TemplateMessageComponent } from '../../../utility/components/template-message/template-message/template-message.component';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { IssueTypesModel } from '../../../utility/models/issue-type.model';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { TicketsService } from '../services/tickets.service';
import { VoidPageCommonService } from '../services/void-page-common.service';
import { VoidPageService } from '../void-early-kick-off/services/void-page.service';
import { VoidPageEarlyKickOffModel } from './models/void-page-early-kick-off.model';

@Component({
  selector: 'void-early-kick-off',
  templateUrl: './void-early-kick-off.component.html',
  styleUrls: ['./void-early-kick-off.component.scss']
})
export class VoidEarlyKickOffComponent implements OnInit {
  @Input('requestDetail') requestDetail: RequestDetailViewModel;
  @ViewChildren("templateMessage") templateMessageViewChildren: QueryList<TemplateMessageComponent>;

  public primitiveProperty = new CommonPrimitiveProperty();
  public voidPageItems: VoidPageEarlyKickOffModel[] = [];
  public issueTypes: IssueTypesModel;
  public tooltip = new Tooltip();
  private readonly afterLoadUnderneathDataSubscription: Subscription;

  constructor(
    private readonly voidPageService: VoidPageService,
    private readonly ticketsService: TicketsService,
    private readonly voidPageCommonService: VoidPageCommonService,
    private readonly element: ElementRef) {
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
    const templateMessageComponents = this.templateMessageViewChildren.toArray();
    this.voidPageCommonService.onClickVoidAllMatches(this.voidPageItems, templateMessageComponents, this.afterLoadUnderneathDataSubscription, this.primitiveProperty, this.tooltip);
  }

  updateDetailViewModel(): void {
    this.voidPageItems[0].detailViewModel = this.requestDetail;
  }

  getKickOffDate(matchId: number): string {
    return this.requestDetail.earlyKickOffModels.find(x => x.matchId === matchId).kickOffTime;
  }
}
