import { Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { IssueTypesModel } from '../../../utility/models/issue-type.model';
import { MessageAreaComponent } from '../message-area/message-area.component';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { TicketsService } from '../services/tickets.service';
import { VoidPageCommonService } from '../services/void-page-common.service';
import { VoidAbnormalBetModel } from './models/void-abnormal-bet.model';
import { VoidPageService } from './services/void-page.service';

@Component({
  selector: 'void-abnormal-bet',
  templateUrl: './void-abnormal-bet.component.html',
  styleUrls: ['./void-abnormal-bet.component.scss']
})
export class VoidAbnormalBetComponent implements OnInit {
  @Input('requestDetail') requestDetail: RequestDetailViewModel;
  @ViewChildren("messageArea") messageAreaComponents: QueryList<MessageAreaComponent>;

  public primitiveProperty = new CommonPrimitiveProperty();
  public voidPageItems: VoidAbnormalBetModel[] = [];
  public issueTypes: IssueTypesModel;
  public tooltip = new Tooltip();
  private readonly afterLoadUnderneathDataSubscription: Subscription;
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
    this.voidPageCommonService.onClickVoidAllMatches(this.voidPageItems, this.messageAreaComponents.toArray(), this.afterLoadUnderneathDataSubscription, this.primitiveProperty, this.tooltip);
  }
}
