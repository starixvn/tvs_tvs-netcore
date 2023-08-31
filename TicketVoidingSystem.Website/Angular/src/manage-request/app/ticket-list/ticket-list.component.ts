import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
import * as _ from 'lodash';
import { RequestDetailViewModel, RequestEventModel } from '../../../edit-request/app/request.model';
import { PagingModel } from '../../../utility/components/paging/paging/paging.model';
import { GeneralInfoViewModel } from '../../../utility/components/request-info/request-info.model';
import { AbnormalFilterBy } from '../../../utility/constants/config';
import { IssueInfo } from '../../../utility/models/issue-type.model';
import { MatchModel } from '../../../utility/models/match.model';
import { CommonService } from '../../../utility/services/common.service';
import { StaticService } from '../../../utility/services/static.service';
import { AppService } from '../app.service';
import { GetGeneralInfoQuery } from '../models/get-general-info.query';
import { TicketListModal } from './ticket-list.modal';
import { TicketsModel } from './tickets/tickets.model';
import { TicketsQuery } from './tickets/tickets.query';

@Component({
  selector: 'ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit, OnChanges {
  @Input() modal: TicketListModal;
  @Output() modalChange = new EventEmitter<TicketListModal>();

  paging = new PagingModel();
  match = new MatchModel();
  requestDetail = new RequestDetailViewModel();
  issue = new IssueInfo();
  query = new TicketsQuery();
  tickets = new TicketsModel();
  generalInfoViewModel = new GeneralInfoViewModel();

  isBlock: boolean;
  blockBetList: boolean;

  constructor(
    private readonly commonService: CommonService,
    private readonly appService: AppService
  ) { }

  ngOnInit() {
    this.match = new MatchModel();
  }

  async ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.modal.open) {
      this.isBlock = true;
      this.requestDetail = await this.commonService.getRequestById(this.modal.requestId);
      if (this.isShowMatchInfo(this.requestDetail)) {
        this.match = await this.commonService.getMatch(this.modal.matchId);
      }
      this.isBlock = false;
      this.issue = await this.commonService.getIssueInfo(StaticService.getSubIssueTypeId(this.requestDetail));
      this.paging = new PagingModel();
      this.paging.pageSize = 500;
      await this.getGeneralInfo();
      await this.getTickets();
      this.updateGeneralInfoByTickets();
    }
  }

  async getTickets() {
    this.query = {
      requestId: this.modal.requestId,
      matchId: this.modal.matchId,
      voidingHistoryIds: this.generalInfoViewModel.generalInfoModel.voidingHistoryIds,
      issueTypeId: this.requestDetail.request.issueTypeId,
      pageIndex: this.paging.page - 1,
      pageSize: this.paging.pageSize
    };
    this.blockBetList = true;
    this.tickets = await this.appService.getVoidedTickets(this.query);
    this.blockBetList = false;
    this.paging.total = this.tickets.totalVoidedTickets;
  }

  pagingEvent() {
    this.getTickets();
  }

  async exportExcel() {
    this.isBlock = true;
    await this.appService.exportTickets(this.query);
    this.isBlock = false;
  }

  private async getGeneralInfo(): Promise<void> {
    const generalInfoQuery: GetGeneralInfoQuery = {
      requestId: this.modal.requestId,
      matchId: this.modal.matchId
    };
    this.generalInfoViewModel = await this.appService.getGeneralInfo(generalInfoQuery);
  }

  private updateGeneralInfoByTickets(): void {
    if (this.generalInfoViewModel.generalInfoModel && this.tickets) {
      this.generalInfoViewModel.generalInfoModel.licenseeNames = this.tickets.licenseeNames;
      this.generalInfoViewModel.generalInfoModel.totalVoidedTickets = this.tickets.totalVoidedTickets;
      this.generalInfoViewModel.generalInfoModel.totalCancelCashOut = this.tickets.totalCancelCashOut;
      this.generalInfoViewModel.generalInfoModel.reason = this.issue.subIssueTypeName;
      this.generalInfoViewModel.generalInfoModel.scoreResult = this.getScoreResult(this.requestDetail.event);
      this.generalInfoViewModel.generalInfoModel.generalBetTypeCombinations = this.tickets.generalBetTypeCombinations;
    }
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

  isShowMatchInfo(requestDetail: RequestDetailViewModel) {
    return !this.isAbnormalAccountIssueType(requestDetail)
      && !(this.isAbnormalBetIssueType(requestDetail) && requestDetail.event.filterBy === AbnormalFilterBy.MIX_PARLAY)
      && !(this.isDuplicateTickets(requestDetail) && requestDetail.duplicateTicketsModel.filterBy === AbnormalFilterBy.MIX_PARLAY)
      && !this.isArchivedTicketIssueType();
  }

  isAbnormalAccountIssueType(requestDetail: RequestDetailViewModel): boolean {
    if (requestDetail.request?.issueTypeId) {
      return StaticService.isAbnormalAccount(requestDetail.request.issueTypeId.toString());
    }

    return false;
  }

  isLikelyAbnormalBetIssueType(requestDetail: RequestDetailViewModel): boolean {
    return this.isAbnormalBetIssueType(requestDetail) || this.isAbnormalBetRealMemberIssueType(requestDetail);
  }

  isDuplicateTickets(requestDetail: RequestDetailViewModel): boolean {
    return StaticService.isDuplicateTickets(requestDetail.request?.issueTypeId.toString());
  }

  isAbnormalBetIssueType(requestDetail: RequestDetailViewModel): boolean {
    if (requestDetail.request?.issueTypeId) {
      return StaticService.isAbnormalBet(requestDetail.request.issueTypeId.toString());
    }

    return false;
  }

  private isAbnormalBetRealMemberIssueType(requestDetail: RequestDetailViewModel): boolean {
    if (requestDetail.request?.issueTypeId) {
      return StaticService.isAbnormalBetRealMember(requestDetail.request.issueTypeId.toString());
    }

    return false;
  }

  private isArchivedTicketIssueType(): boolean {
    if (this.requestDetail.request?.issueTypeId) {
      return StaticService.isArchivedTicket(this.requestDetail.request.issueTypeId.toString());
    }

    return false;
  }
}
