import { Component, Input, OnChanges, OnInit, SimpleChange } from '@angular/core';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { TimeModel } from '../../../utility/components/date-time/date-time/time.model';
import { AbnormalFilterBy } from '../../../utility/constants/config';
import { IssueInfo } from '../../../utility/models/issue-type.model';
import { StaticService } from '../../../utility/services/static.service';
import { GeneralInfoViewModel } from './request-info.model';


@Component({
  selector: 'request-info',
  templateUrl: './request-info.component.html',
  styleUrls: ['./request-info.component.scss']
})
export class RequestInfoComponent implements OnInit, OnChanges {
  @Input() model = new RequestDetailViewModel();
  @Input() issue = new IssueInfo();
  @Input() generalInfoViewModel = new GeneralInfoViewModel();
  @Input() isShowGeneralInfo = false;
  @Input() isShowAbnormalAccountInfo = false;
  @Input() isShowVar = false;

  kickOffTime = new TimeModel(new Date());
  issueTypeName: string;
  isExpandGeneralInfo = false;
  isEarlyKOIssueType = false;
  isAbnormalAccount = false;
  isAbnormalBet = false;
  product = '';
  status = '';

  constructor(config: NgbAccordionConfig) {
    config.closeOthers = true;
  }

  ngOnInit() {
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes['issue']) {
      this.updateIssue();
    }
    if (this.isShowAbnormalAccountInfo && changes['model']) {
      this.getProducts();
      this.getStatus();
    }
  }

  private updateIssue() {
    if (!_.isUndefined(this.issue.issueTypeId)) {
      this.issueTypeName = this.issue.name === this.issue.subIssueTypeName ? this.issue.name : `${this.issue.name} - ${this.issue.subIssueTypeName}`;

      this.updateDefaultIssueType(false, false);
      if (this.isEarlyKickOffIssueType()) {
        this.isEarlyKOIssueType = true;
        if (!_.isUndefined(this.model.event)) {
          this.kickOffTime = new TimeModel(new Date(this.model.event.kickOffTime));
        }
      }

      if (this.isAbnormalAccountIssueType()) {
        this.isAbnormalAccount = true;
      }

      if (this.isLikelyAbnormalBetIssueType()) {
        this.isAbnormalBet = true;
      }
    }
  }

  private updateDefaultIssueType(eko: boolean, abnormalAccount: boolean): void {
    this.isEarlyKOIssueType = eko;
    this.isAbnormalAccount = abnormalAccount;
  }

  getProducts(): void {
    this.product = this.model.event.productIds
      .replace('1', 'Sportsbook')
      .replace('2', 'Parlay')
      .replace('3', 'Bet Builder')
      .replace('4', 'Outright')
      .replace('5', 'Saba')
      .replace('6', 'Non-Sports');
  }

  getStatus(): void {
    this.status = this.model.event.statusIds
      .replace('0,1', 'Running')
      .replace('112', 'Won')
      .replace('113', 'Lose')
      .replace('111', 'Draw');
  }

  public isShowMatchInfo(): boolean {
    return !this.isAbnormalAccountIssueType() && !this.isAbnormalBetMixParlay() && !this.isArchivedTicket() && !this.isDuplicateTicketsMixParlay();
  }

  public isAbnormalBetMixParlay(): boolean {
    return this.isAbnormalBetIssueType() && this.model.event?.filterBy === AbnormalFilterBy.MIX_PARLAY;
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

  isLikelyAbnormalBetIssueType(): boolean {
    return this.isAbnormalBetIssueType() || this.isAbnormalBetRealMemberIssueType();
  }

  private isAbnormalBetIssueType(): boolean {
    return StaticService.isAbnormalBet(this.issue.issueTypeId?.toString());
  }

  private isAbnormalBetRealMemberIssueType(): boolean {
    return StaticService.isAbnormalBetRealMember(this.issue.issueTypeId?.toString());
  }
}
