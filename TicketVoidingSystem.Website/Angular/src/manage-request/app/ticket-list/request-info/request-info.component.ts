import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
import { NgbAccordionConfig, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { RequestDetailViewModel, RequestEventModel } from '../../../../edit-request/app/request.model';
import { PagingModel } from '../../../../utility/components/paging/paging/paging.model';
import { AbnormalFilterBy } from '../../../../utility/constants/config';
import { IssueInfo } from '../../../../utility/models/issue-type.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { CommonService } from '../../../../utility/services/common.service';
import { StaticService } from '../../../../utility/services/static.service';
import { AppService } from '../../app.service';
import { BriefInfo } from '../../models/brief-info.model';
import { GetGeneralInfoQuery } from '../../models/get-general-info.query';
import { TabInfoRequest, TicketListModal } from '../ticket-list.modal';
import { TicketsModel } from '../tickets/tickets.model';
import { TicketsQuery } from '../tickets/tickets.query';
import { GeneralInfoViewModel } from './request-info.model';
import { BlockUiModule } from '../../../../utility/components/block-ui/block-ui.module';
import { MatchInfoComponent } from '../match-info/match-info.component';
import { IssueTypeModule } from '../../../../utility/components/issue-type/issue-type.module';
import { TicketsComponent } from '../tickets/tickets.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'request-info',
  templateUrl: './request-info.component.html',
  styleUrls: ['./request-info.component.scss'],
  imports: [BlockUiModule, MatchInfoComponent, IssueTypeModule, TicketsComponent, FormsModule, NgbNavModule, CommonModule ]
})
export class RequestInfoComponent implements OnInit, OnChanges {
  @Input() ticketListModal: TicketListModal;
  @Input() model = new RequestDetailViewModel();
  @Input() issue = new IssueInfo();
  @Input() isShowVar = false;
  @Input() tabInfoRequest: TabInfoRequest[] = [];
  @Output() changeTabEvent = new EventEmitter<string>();
  @Output() changeTabBriefInfoEvent = new EventEmitter();

  activeTab: number;
  issueTypeName: string;
  isExpandGeneralInfo = false;
  isAbnormalBet = false;
  briefInfoNote: string;
  paging = new PagingModel();
  isBlock = false;
  isShowBetList = true;
  query = new TicketsQuery();
  tickets = new TicketsModel();
  generalInfoViewModel = new GeneralInfoViewModel();
  briefInfoModels: BriefInfo[] = [];
  match = new MatchModel();
  
  constructor(
    config: NgbAccordionConfig) {
    config.closeOthers = true;
  }

  appService = inject(AppService);
  commonService = inject(CommonService);
  
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes['issue']) {
      this.updateIssue();
    }
  }

  async ngOnInit() {
    this.paging = new PagingModel();
    this.paging.pageSize = 500;
    this.activeTab = this.tabInfoRequest.find(x => x.isActive).id;
    await this.getDataCurrentTab(this.tabInfoRequest.find(x => x.isActive));
  }

  async getTickets(matchId: number) {
    this.query = {
      requestId: this.ticketListModal.requestId,
      matchId: matchId,
      voidingHistoryIds: this.generalInfoViewModel.generalInfoModel.voidingHistoryIds,
      issueTypeId: this.model.request.issueTypeId,
      pageIndex: this.paging.page - 1,
      pageSize: this.paging.pageSize,
      singleTransIds: this.generalInfoViewModel.generalInfoModel.singleTransIds,
      recoverTime: this.generalInfoViewModel.generalInfoModel.recoveredTimeString
    };
    this.tickets = await this.appService.getVoidedTickets(this.query);
    this.paging.total = this.tickets.totalTicketsProcessed;
  }

  async pagingEvent() {
    this.isBlock = true;
    await this.getTickets(this.ticketListModal.matchId);
    this.isBlock = false;
  }

  public async changeTab(tabInfoRequest: TabInfoRequest) {
    this.isShowBetList = true;
    await this.getDataCurrentTab(tabInfoRequest);
  }

  async getDataCurrentTab(tabInfoRequest: TabInfoRequest) {
    this.isBlock = true;
    await this.getGeneralInfo(tabInfoRequest);
    await this.getTickets(tabInfoRequest.matchId);
    await this.getMatch(tabInfoRequest.matchId);
    this.updateGeneralInfoByTickets();
    this.isBlock = false;
  }

  public async onClickTabBriefInfo() {
    this.isShowBetList = false;
    this.isBlock = true;
    const distinctMatchIds = [...new Set(this.ticketListModal.tabInfoRequest.map(x => x.matchId))];
    const generalInfoQuery: GetGeneralInfoQuery = { // same properties with GetGeneralInfoQuery
      requestId: this.ticketListModal.requestId,
      matchIds: distinctMatchIds.join(','),
    } as GetGeneralInfoQuery;
    this.briefInfoModels = await this.appService.GetBriefInfo(generalInfoQuery);
    this.isBlock = false;
  }

  async exportExcel() {
    this.isBlock = true;
    await this.appService.exportTickets(this.query);
    this.isBlock = false;
  }

  private async getGeneralInfo(tabInfoRequest: TabInfoRequest): Promise<void> {
    const generalInfoQuery: GetGeneralInfoQuery = {
      requestId: this.ticketListModal.requestId,
      matchIds: tabInfoRequest.matchId?.toString(),
      requestDetailId: tabInfoRequest.requestDetailId
    };
    this.generalInfoViewModel = await this.appService.getGeneralInfo(generalInfoQuery);
  }

  private getScoreResult(model: RequestEventModel): string {
    if (model) {
      const htScore = (!_.isNil(model.htHomeScore) && !_.isNil(model.htAwayScore)) ? `${model.htHomeScore} - ${model.htAwayScore}` : 'N/A';
      const ftScore = (!_.isNil(model.finalHomeScore) && !_.isNil(model.finalAwayScore)) ?
        `${model.finalHomeScore} - ${model.finalAwayScore}` : 'N/A';
      return `HT ${htScore}, FT ${ftScore}`;
    }

    return '';
  }

  private updateGeneralInfoByTickets(): void {
    if (this.generalInfoViewModel.generalInfoModel && this.tickets) {
      this.generalInfoViewModel.generalInfoModel.licenseeNames = this.tickets.licenseeNames;
      this.generalInfoViewModel.generalInfoModel.cancelCashOutLicenseesName = this.tickets.cancelCashOutLicenseesName;
      this.generalInfoViewModel.generalInfoModel.totalTicketsProcessed = this.tickets.totalTicketsProcessed;
      this.generalInfoViewModel.generalInfoModel.totalCancelCashOutProcessed = this.tickets.totalCancelCashOutProcessed;
      this.generalInfoViewModel.generalInfoModel.reason = this.issue.subIssueTypeName;
      this.generalInfoViewModel.generalInfoModel.scoreResult = this.getScoreResult(this.model.event);
      this.generalInfoViewModel.generalInfoModel.generalBetTypeCombinations = this.tickets.generalBetTypeCombinations;
    }
  }

  private async getMatch(matchId: number) {
    if (this.isShowMatchInfo() && this.isValidMatchId(matchId)) {
      this.match = await this.commonService.getMatch(matchId);
    }
  }

  private isValidMatchId(matchId: number): boolean {
    return matchId !== null && matchId !== 0 && matchId !== 29;
  }

  public async saveBriefInfoNote() {
    await this.appService.SaveBriefInfoNote(this.model.request.requestId, this.model.request.briefInfoNote);
  }

  private updateIssue() {
    if (!_.isUndefined(this.issue.issueTypeId)) {
      this.issueTypeName = this.issue.name === this.issue.subIssueTypeName ? this.issue.name : `${this.issue.name} - ${this.issue.subIssueTypeName}`;

      if (this.isAbnormalBetIssueType()) {
        this.isAbnormalBet = true;
      }
    }
  }

  public isShowMatchInfo(): boolean {
    return !this.isAbnormalAccountIssueType()
      && !this.isAbnormalBetMixOrSystemParlay()
      && !this.isArchivedTicket()
      && !this.isDuplicateTicketsMixParlay()
      && !this.isRecoverTicket();
  }

  public isRecoverTicket(): boolean {
    return StaticService.isRecoverTicket(this.issue.issueTypeId?.toString());
  }

  public isAbnormalBetMixOrSystemParlay(): boolean {
    return this.isAbnormalBetIssueType() && StaticService.isFilterByMixOrSystemParlay(this.model.abnormalBetModel?.filterBy);
  }

  public isDuplicateTicketsMixParlay(): boolean {
    return StaticService.isDuplicateTickets(this.issue.issueTypeId?.toString()) && this.model.duplicateTicketsModel.filterBy === AbnormalFilterBy.MIX_PARLAY;
  }

  public isArchivedTicket(): boolean {
    return StaticService.isArchivedTicket(this.issue.issueTypeId?.toString());
  }

  isEarlyKickOffIssueType(): boolean {
    return StaticService.isEarlyKickOff(this.issue.issueTypeId?.toString());
  }

  isAbnormalAccountIssueType(): boolean {
    return StaticService.isAbnormalAccount(this.issue.issueTypeId?.toString());
  }

  isAbnormalBetIssueType(): boolean {
    return StaticService.isAbnormalBet(this.issue.issueTypeId?.toString());
  }

  isShowVoidMessages(): boolean {
    return !this.isRecoverTicket() && this.generalInfoViewModel.userVoidMessages?.length > 0;
  }
}
