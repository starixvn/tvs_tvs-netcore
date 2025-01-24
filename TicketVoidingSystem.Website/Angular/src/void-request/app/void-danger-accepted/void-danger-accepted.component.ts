import { Component, ElementRef, Input, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { SubIssueTypeConstant } from '../../../utility/constants/sub-issue-type.constant';
import { IssueTypesModel } from '../../../utility/models/issue-type.model';
import { StaticService } from '../../../utility/services/static.service';
import { MessageAreaComponent } from '../message-area/message-area.component';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { VoidMatch } from '../models/void-match.model';
import { TicketsService } from '../services/tickets.service';
import { VoidPageCommonService } from '../services/void-page-common.service';
import { VoidPageService } from './services/void-page.service';
import { FormsModule } from '@angular/forms';
import { LogInfoNewComponent } from '../log-info-new/log-info-new.component';
import { CommonModule } from '@angular/common';
import { LicenseeAffectedListComponent } from '../../../utility/components/licensee-affected-list/licensee-affected-list.component';
import { PasswordAreaComponent } from '../password-area/password-area.component';
import { TicketsListComponent } from '../tickets-list/tickets-list.component';
import { TooltipComponent } from '../../../utility/components/tooltip/tooltip.component';
import { TemplateMessageService } from './services/template-message.service';

@Component({
  standalone: true,
  selector: 'void-danger-accepted',
  templateUrl: './void-danger-accepted.component.html',
  styleUrls: ['./void-danger-accepted.component.scss'],
  imports: [FormsModule, LogInfoNewComponent, CommonModule, LicenseeAffectedListComponent, TicketsListComponent, MessageAreaComponent,
    PasswordAreaComponent, TooltipComponent
  ],
  providers: [TicketsService, VoidPageService, VoidPageCommonService, TemplateMessageService]
})
export class VoidDangerAcceptedComponent implements OnInit {
  @Input('requestDetail') requestDetail: RequestDetailViewModel;
  @ViewChildren("messageArea") messageAreaComponents: QueryList<MessageAreaComponent>;
  voidPageService = inject(VoidPageService);
  ticketsService = inject(TicketsService);
  voidPageCommonService = inject(VoidPageCommonService);
  element = inject(ElementRef);

  public primitiveProperty = new CommonPrimitiveProperty();
  public voidMatches: VoidMatch[] = [];
  public issueTypes: IssueTypesModel;
  public tooltip = new Tooltip();
  private readonly afterLoadUnderneathDataSubscription: Subscription;

  constructor() {
    this.tooltip.element = this.element;
  }

  async ngOnInit(): Promise<void> {
    this.primitiveProperty.isBlockUI = true;
    this.primitiveProperty.userName = document.body.getAttribute('user-name');
    this.issueTypes = await this.voidPageService.getIssueTypes();
    this.voidMatches = await this.voidPageService.getBasicVoidMatchesData(this.issueTypes, this.requestDetail, this.primitiveProperty);
    this.primitiveProperty.isLoadedBasicData = true;
    this.primitiveProperty.isBlockUI = false;

    await this.voidPageService.loadUnderneathVoidMatchesData(this.voidMatches, this.requestDetail);
    this.primitiveProperty.isLoadedUnderneathData = true;
  }

  async onClickShowVoidTickets(voidMatch: VoidMatch): Promise<void> {
    this.voidPageCommonService.onClickShowVoidTickets(voidMatch, this.requestDetail, this.primitiveProperty, this.voidMatches);
  }

  async onPagingTicketsChange(voidMatch: VoidMatch): Promise<void> {
    await this.ticketsService.loadVoidTicketsFullOnPagingChange(voidMatch, this.requestDetail);
  }

  async exportTickets(voidMatch: VoidMatch) {
    this.voidPageCommonService.exportTickets(voidMatch, this.requestDetail);
  }

  async onClickShowTemplateMessage(voidMatch: VoidMatch): Promise<void> {
    this.voidPageCommonService.onClickShowTemplateMessage(voidMatch, this.primitiveProperty, this.requestDetail, this.afterLoadUnderneathDataSubscription, this.voidMatches);
  }

  onClickCopyLicenseesToClipboard(text: string): void {
    this.voidPageCommonService.onClickCopyLicenseesToClipboard(text);
  }

  onClickVoidAllMatches(): void {
    this.voidPageCommonService.onClickVoidAllMatches(this.voidMatches, this.messageAreaComponents?.toArray(), this.afterLoadUnderneathDataSubscription, this.primitiveProperty, this.tooltip);
  }

  public changeCheckBoxEarlyEvent(voidMatch: VoidMatch): void {
    voidMatch.templateValue.isCheckedEarlyEvent = voidMatch.isCheckedEarlyEvent;
    voidMatch.templateValue = _.clone(voidMatch.templateValue);
  }

  public isWrongHdp(): boolean {
    return StaticService.isWrongHDP(this.requestDetail.request?.issueTypeId.toString());
  }

  public isWrong1stHdp(): boolean {
    return StaticService.isWrong1stHDP(this.requestDetail.request?.issueTypeId.toString());
  }

  public isWrongOu(): boolean {
    return StaticService.isWrongOU(this.requestDetail.request?.issueTypeId.toString());
  }

  public isWrong1stOu(): boolean {
    return StaticService.isWrong1stOU(this.requestDetail.request?.issueTypeId.toString());
  }

  public isSubTypeWrongHdpOrWrong1stHdp(): boolean {
    return this.isSubTypeWrongHdp() || this.isSubTypeWrong1stHdp();
  }

  private isSubTypeWrongHdp(): boolean {
    return this.voidMatches[0].subIssueType.subIssueTypeId === SubIssueTypeConstant.WRONG_HDP;
  }

  private isSubTypeWrong1stHdp(): boolean {
    return this.voidMatches[0].subIssueType.subIssueTypeId === SubIssueTypeConstant.WRONG_1ST_HDP;
  }
}
