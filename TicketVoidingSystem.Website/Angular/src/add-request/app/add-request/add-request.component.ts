import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { LogAnalysisService } from 'src/utility/services/log-analysis.service';
import { AbnormalFilterBy, TVSRequestActionType } from '../../../utility/constants/config';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { MatchModel } from '../../../utility/models/match.model';
import { StaticService } from '../../../utility/services/static.service';
import { AbnormalAccountsComponent } from './abnormal-accounts/abnormal-accounts.component';
import { AddRequestStore } from './add-request.store';
import { EventAbnormalBetComponent } from './event-abnormal-bet/event-abnormal-bet.component';
import { EventDangerAcceptedComponent } from './event-danger-accepted/event-danger-accepted.component';
import { EventDuplicateTicketsComponent } from './event-duplicate-tickets/event-duplicate-tickets.component';
import { EventEarlyKickOffComponent } from './event-early-kick-off/event-early-kick-off.component';
import { EventNotParticipateComponent } from './event-not-participate/event-not-participate.component';
import { EventRecoverTicketComponent } from './event-recover-ticket/event-recover-ticket.component';
import { EventRedCardComponent } from './event-red-card/event-red-card.component';
import { EventReducedOverComponent } from './event-reduced-over/event-reduced-over.component';
import { EventTicket14Component } from './event-ticket14/event-ticket14.component';
import { EventWrongHdpComponent } from './event-wrong-hdp/event-wrong-hdp.component';
import { EventWrongMarketOfferedComponent } from './event-wrong-market-offered/event-wrong-market-offered.component';
import { EventWrongOddsComponent } from './event-wrong-odds/event-wrong-odds.component';
import { EventWrongOuComponent } from './event-wrong-ou/event-wrong-ou.component';
import { EventWrongScoreComponent } from './event-wrong-score/event-wrong-score.component';
import { FilterComponent } from './filter/filter.component';
import { FilterModel } from './filter/filter.model';
import { IssueTypes } from './filter/issue-types.model';
import { RequestModel } from './models/request.model';
import { CopyRequestInfoService } from './services/copy-request-info.service';

@Component({
  selector: 'add-request',
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.scss'],
  providers: [AddRequestStore]
})
export class AddRequestComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() isEdit = false;
  @Input() isExternalUrl = false;
  @Input() requestId: number;
  @Input() matchId: number;
  @Input() userId: number;
  @Input() requestedBy: string;
  @Input() model = new RequestModel();
  @Input() actionIdOfFirstTimeAccess: string;

  @ViewChild('filter') filterComponent: FilterComponent;
  @ViewChild('eventEarlyKickOff') eventEarlyKickOffComponent: EventEarlyKickOffComponent;
  @ViewChild('eventAbnormalBet') eventAbnormalBetComponent: EventAbnormalBetComponent;
  @ViewChild('eventDangerAccepted') eventDangerAcceptedComponent: EventDangerAcceptedComponent;
  @ViewChild('eventRedCard') eventRedCardComponent: EventRedCardComponent;
  @ViewChild('abnormalAccount') abnormalAccountsComponent: AbnormalAccountsComponent;
  @ViewChild('wrongScore') eventWrongScoreComponent: EventWrongScoreComponent;
  @ViewChild('eventTicket14') eventTicket14Component: EventTicket14Component;
  @ViewChild('eventWrongHDP') eventWrongHdpComponent: EventWrongHdpComponent;
  @ViewChild('eventWrongOU') eventWrongOuComponent: EventWrongOuComponent;
  @ViewChild('eventWrongOdds') eventWrongOddsComponent: EventWrongOddsComponent;
  @ViewChild('eventReducedOver') eventReducedOverComponent: EventReducedOverComponent;
  @ViewChild('eventDuplicateTickets') eventDuplicateTicketsComponent: EventDuplicateTicketsComponent;
  @ViewChild('eventNotParticipate') eventNotParticipateComponent: EventNotParticipateComponent;
  @ViewChild('eventRecoverTicket') eventRecoverTicketComponent: EventRecoverTicketComponent;
  @ViewChild('eventWrongMarketOffered') eventWrongMarketOfferedComponent: EventWrongMarketOfferedComponent;

  isCollapse: boolean;
  isBlock: boolean;
  issueTypes = new IssueTypes();
  isDisabledSaveButton = false;
  checkValidSubIssueTypeInFilterSubscription: Subscription;
  savingRequestSubscription: Subscription;
  blockingUiSubscription: Subscription;
  abnormalFilterBySubscription = new Subscription();
  abnormalFilterBy: number;
  parentMatchId: number = null;
  accessIssueTypeCount = new Map<string,number>();

  constructor(
    private readonly addRequestStore: AddRequestStore,
    private readonly copyRequestInfoService: CopyRequestInfoService,
    private readonly logAnalysisService:LogAnalysisService
  ) { }

  ngOnInit(): void {
    this.savingRequestSubscription = this.addRequestStore.savingRequestStatus.subscribe(status => {
      this.isDisabledSaveButton = status;
    });

    this.blockingUiSubscription = this.addRequestStore.blockingUiStatus.subscribe(status => {
      this.isBlock = status.length > 0;
    });

    this.abnormalFilterBySubscription = this.addRequestStore.getAbnormalFilterBySubject.subscribe(type => {
      this.abnormalFilterBy = type;
    });
  }

  ngOnDestroy(): void {
    this.savingRequestSubscription?.unsubscribe();
    this.checkValidSubIssueTypeInFilterSubscription?.unsubscribe();
    this.blockingUiSubscription?.unsubscribe();
    this.abnormalFilterBySubscription?.unsubscribe();
  }

  async ngAfterViewInit() {
    this.checkValidSubIssueTypeInFilterSubscription = this.addRequestStore.getCheckValidSubIssueTypeInFilterSubject.subscribe(() => {
      this.filterComponent.checkValidSubIssueType();
    });

    if (this.isExternalUrl && this.isAbnormalBet()) {
      await new Promise(resolve => setTimeout(resolve));
      await this.eventAbnormalBetComponent.afterFocusOutBetIds();
    }
  }

  async onChangeIssueType(issueTypeId: string): Promise<void> {
    if (!this.isEdit && (StaticService.isAbnormalBet(issueTypeId)
        || StaticService.isAbnormalAccount(issueTypeId))) {
      this.model.others.decidedBy = document.getElementById('body').getAttribute('user-name');
    } else {
      this.model.others.decidedBy = '';
    }

    await this.logAnalysisService.writeLogAccessFunction(this.isEdit, issueTypeId, this.accessIssueTypeCount);
  }

  updateMatchId(matchId: number): void {
    this.matchId = matchId;
  }

  updateMatchInfo(match: MatchModel): void {
    this.matchId = match?.matchId;
    this.parentMatchId = match?.parentId;
  }
  async saveRequest(isSaveAndVoid: boolean): Promise<void> { // NOSONAR
    if (!this.isEdit) {
      const PREVIOUS_SELECTED_ISSUETYPE = 'PreviousSelectedIssueType';
      localStorage.setItem(PREVIOUS_SELECTED_ISSUETYPE + document.getElementById('body').getAttribute('user-id'),
        this.model.filter.issueTypeId);
    }
    this.isDisabledSaveButton = true;

    if (this.isAbnormalBet()) {
      await this.eventAbnormalBetComponent.saveRequest();
    }

    if (this.isEarlyOrWrongKO()) {
      await this.eventEarlyKickOffComponent.saveRequest(isSaveAndVoid);
    }

    if (this.isDangerAccepted()) {
      await this.eventDangerAcceptedComponent.saveRequest();
    }

    if (this.isRedCard()) {
      await this.eventRedCardComponent.saveRequest();
    }

    if (this.isAbnormalAccount()) {
      await this.abnormalAccountsComponent.saveRequest();
    }

    if (this.isWrongScoreIssueType()) {
      await this.eventWrongScoreComponent.saveRequest();
    }

    if (this.isArchivedTicketIssueType()) {
      await this.eventTicket14Component.saveRequest();
    }

    if (this.isWrongHDP() || this.isWrong1stHDP()) {
      await this.eventWrongHdpComponent.saveRequest();
    }

    if (this.isWrongOU() || this.isWrong1stOU()) {
      await this.eventWrongOuComponent.saveRequest();
    }

    if (this.isWrongOdds()) {
      await this.eventWrongOddsComponent.saveRequest();
    }

    if (this.isReducedOver() || this.isAbandoned()) {
      await this.eventReducedOverComponent.saveRequest();
    }

    if (this.isDuplicateTickets()) {
      await this.eventDuplicateTicketsComponent.saveRequest();
    }

    if (this.isNotParticipate()) {
      await this.eventNotParticipateComponent.saveRequest();
    }

    if (this.isRecoverTicket()) {
      await this.eventRecoverTicketComponent.saveRequest();
    }

    if (this.isLikelyWrongMarketOffered()) {
      await this.eventWrongMarketOfferedComponent.saveRequest();
    }
  }

  backToManagePage() {
    window.location.assign(`TicketVoidingSystem/ManageRequest/Index`);
  }

  updateModel(filterModel: FilterModel): void {
    this.model.filter = _.clone(filterModel);
  }

  public getEventLabel(): string {
    if (this.isAbnormalAccount()) {
      return 'Username';
    } else if (this.isArchivedTicketIssueType() || this.isRecoverTicket()) {
      return 'Ticket Info';
    } else {
      return 'Event';
    }
  }

  async copyEmailRequestInfo() {
    this.addRequestStore.changeBlockingUiStatus(true);
    this.copyRequestInfoService.copyEmailRequestInfo(this.requestId, this.matchId, this.model.others.operatorsList);
    this.addRequestStore.changeBlockingUiStatus(false);
    alert(`Request No.${this.requestId} has been copied to clipboard.`);
  }

  async copyLetstalkRequestInfo() {
    let logInfoDetail = [];
    if (this.isRedCard()) {
      logInfoDetail = this.eventRedCardComponent.getLogInfoDetail();
    }

    if (this.isDangerAccepted()) {
      logInfoDetail = this.eventDangerAcceptedComponent.getLogInfoDetail();
    }

    if (this.isWrongScoreIssueType()) {
      logInfoDetail = this.eventWrongScoreComponent.getLogInfoDetail();
    }

    this.addRequestStore.changeBlockingUiStatus(true);
    this.copyRequestInfoService.copyLetstalkRequestInfo(this.requestId, this.matchId, logInfoDetail, this.model.others.operatorsList);
    this.addRequestStore.changeBlockingUiStatus(false);
    alert(`Request No.${this.requestId} has been copied to clipboard.`);
  }

  isShowOthersSimpleFields(): boolean {
    const issueTypesHasSimpleFields = [
      IssueTypeConstant.WRONG_HDP,
      IssueTypeConstant.WRONG_1ST_HDP,
      IssueTypeConstant.WRONG_OU,
      IssueTypeConstant.WRONG_1ST_OU,
      IssueTypeConstant.WRONG_ODDS,
      IssueTypeConstant.REDUCED_OVER,
      IssueTypeConstant.ABANDONED,
      IssueTypeConstant.NOT_PARTICIPATE,
      IssueTypeConstant.WRONG_MARKET_OFFERED,
      IssueTypeConstant.TECHNICAL_ERROR
    ]

    return issueTypesHasSimpleFields.includes(this.model.filter.issueTypeId);
  }

  isShowOthersFullFields(): boolean {
    return !this.isAbnormalBet() && !this.isAbnormalAccount() && !this.isArchivedTicketIssueType() && !this.isDuplicateTickets()
      && !this.isRecoverTicket() && !this.isShowOthersSimpleFields();
  }

  isShowSaveAndVoidButton(): boolean {
    return (this.model.filter.action === TVSRequestActionType.MANUAL_VOID_ID.toString())
      && this.isEarlyOrWrongKO();
  }

  isShowCopyInfoButton(): boolean {
    return this.model.filter.isVoided && (this.isDangerAccepted() || this.isRedCard() || this.isWrongScoreIssueType());
  }

  public isAbnormalBet(): boolean {
    return StaticService.isAbnormalBet(this.model.filter.issueTypeId);
  }

  isAbnormalBetMixOrSystemParlay(): boolean {
    return this.isAbnormalBet() && StaticService.isFilterByMixOrSystemParlay(this.abnormalFilterBy);
  }

  isAbnormalAccount(): boolean {
    return StaticService.isAbnormalAccount(this.model.filter.issueTypeId);
  }

  isEarlyOrWrongKO(): boolean {
    return StaticService.isEarlyKickOff(this.model.filter.issueTypeId)
      || StaticService.isWrongKickOff(this.model.filter.issueTypeId);
  }

  isDangerAccepted(): boolean {
    return StaticService.isDangerAccepted(this.model.filter.issueTypeId);
  }

  isRedCard(): boolean {
    return StaticService.isRedCard(this.model.filter.issueTypeId);
  }

  isWrongHDP(): boolean {
    return StaticService.isWrongHDP(this.model.filter.issueTypeId);
  }

  isWrong1stHDP(): boolean {
    return StaticService.isWrong1stHDP(this.model.filter.issueTypeId);
  }

  isWrongOU(): boolean {
    return StaticService.isWrongOU(this.model.filter.issueTypeId);
  }

  isWrong1stOU(): boolean {
    return StaticService.isWrong1stOU(this.model.filter.issueTypeId);
  }

  isWrongScoreIssueType(): boolean {
    return StaticService.isWrongScore(this.model.filter.issueTypeId);
  }

  isArchivedTicketIssueType(): boolean {
    return StaticService.isArchivedTicket(this.model.filter.issueTypeId);
  }

  isWrongOdds(): boolean {
    return StaticService.isWrongOdds(this.model.filter.issueTypeId);
  }

  isEventReducedOver(): boolean {
    return StaticService.isReducedOver(this.model.filter.issueTypeId) || StaticService.isAbandoned(this.model.filter.issueTypeId);
  }

  isReducedOver(): boolean {
    return StaticService.isReducedOver(this.model.filter.issueTypeId);
  }

  isAbandoned(): boolean {
    return StaticService.isAbandoned(this.model.filter.issueTypeId);
  }

  isDuplicateTickets(): boolean {
    return StaticService.isDuplicateTickets(this.model.filter.issueTypeId);
  }

  isDuplicateTicketsMixParlay(): boolean {
    return StaticService.isDuplicateTickets(this.model.filter.issueTypeId) && this.abnormalFilterBy === AbnormalFilterBy.MIX_PARLAY;
  }

  isNotParticipate(): boolean {
    return StaticService.isNotParticipate(this.model.filter.issueTypeId);
  }

  isRecoverTicket(): boolean {
    return StaticService.isRecoverTicket(this.model.filter.issueTypeId);
  }

  isLikelyWrongMarketOffered(): boolean {
    return StaticService.isLikelyWrongMarketOffered(this.model.filter.issueTypeId);
  }
}
