import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { CheckIssueTypeObjectType } from 'src/utility/models/check-issue-type.model';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { LocalStorageCacheConstant } from '../../../utility/constants/local-storage-cache.constant';
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
import { EventWrongOddsSportsBookComponent } from './event-wrong-odds-sports-book/event-wrong-odds-sports-book.component';
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
  @ViewChild('eventWrongOddsSportsBook') eventWrongOddsSportsBookComponent: EventWrongOddsSportsBookComponent;
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

  constructor(
    private readonly addRequestStore: AddRequestStore,
    private readonly copyRequestInfoService: CopyRequestInfoService
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

    if (this.isExternalUrl && StaticService.isAbnormalBet(this.model.filter.issueTypeId)) {
      await new Promise(resolve => setTimeout(resolve));
      await this.eventAbnormalBetComponent.afterFocusOutBetIds();
    }
  }

  public async onChangeIssueType(issueTypeId: string): Promise<void> {
    if (!this.isEdit && (StaticService.isAbnormalBet(issueTypeId)
      || StaticService.isAbnormalAccount(issueTypeId))) {
      this.model.others.decidedBy = document.getElementById('body').getAttribute('user-name');
    } else {
      this.model.others.decidedBy = '';
    }
  }

  public updateMatchId(matchId: number): void {
    this.matchId = matchId;
  }

  public updateMatchInfo(match: MatchModel): void {
    this.matchId = match?.matchId;
    this.parentMatchId = match?.parentId;
  }

  public async saveRequest(): Promise<void> { // NOSONAR
    this.cachingIssueType();
    this.isDisabledSaveButton = true;
    const issueTypeId = this.model.filter.issueTypeId;
    const saveTasks = [
      { condition: StaticService.isAbnormalBet(issueTypeId), component: this.eventAbnormalBetComponent },
      { condition: StaticService.isEarlyKickOff(issueTypeId) || StaticService.isWrongKickOff(issueTypeId), component: this.eventEarlyKickOffComponent },
      { condition: StaticService.isDangerAccepted(issueTypeId), component: this.eventDangerAcceptedComponent },
      { condition: StaticService.isRedCard(issueTypeId), component: this.eventRedCardComponent },
      { condition: StaticService.isAbnormalAccount(issueTypeId), component: this.abnormalAccountsComponent },
      { condition: StaticService.isWrongScore(issueTypeId), component: this.eventWrongScoreComponent },
      { condition: StaticService.isArchivedTicket(issueTypeId), component: this.eventTicket14Component },
      { condition: StaticService.isWrongHDP(issueTypeId) || StaticService.isWrong1stHDP(issueTypeId), component: this.eventWrongHdpComponent },
      { condition: StaticService.isWrongOU(issueTypeId) || StaticService.isWrong1stOU(issueTypeId), component: this.eventWrongOuComponent },
      { condition: StaticService.isWrongOdds(issueTypeId), component: this.eventWrongOddsComponent },
      { condition: StaticService.isWrongOddsSportsBook(issueTypeId), component: this.eventWrongOddsSportsBookComponent },
      { condition: StaticService.isReducedOver(issueTypeId) || StaticService.isAbandoned(issueTypeId), component: this.eventReducedOverComponent },
      { condition: StaticService.isDuplicateTickets(issueTypeId), component: this.eventDuplicateTicketsComponent },
      { condition: StaticService.isNotParticipate(issueTypeId), component: this.eventNotParticipateComponent },
      { condition: StaticService.isRecoverTicket(issueTypeId), component: this.eventRecoverTicketComponent },
      { condition: StaticService.isLikelyWrongMarketOffered(issueTypeId), component: this.eventWrongMarketOfferedComponent }
    ];

    for (const task of saveTasks) {
      if (task.condition) {
        await task.component.saveRequest();
      }
    }
  }

  private cachingIssueType(): void {
    if (!this.isEdit) {
      const userId = document.getElementById('body')?.getAttribute('user-id');
      if (userId) {
        localStorage.setItem(
          LocalStorageCacheConstant.PREVIOUS_SELECTED_ISSUETYPE_ADD_REQUEST + userId,
          this.model.filter.issueTypeId
        );
      }
    }
  }

  public backToManagePage(): void {
    window.location.assign(`TicketVoidingSystem/ManageRequest/Index`);
  }

  public updateModel(filterModel: FilterModel): void {
    this.model.filter = _.clone(filterModel);
  }

  public getEventLabel(): string {
    if (StaticService.isAbnormalAccount(this.model.filter.issueTypeId)) {
      return 'Username';
    }

    return StaticService.isArchivedTicket(this.model.filter.issueTypeId) || StaticService.isRecoverTicket(this.model.filter.issueTypeId)
      ? 'Ticket Info' : 'Event';
  }

  async copyEmailRequestInfo(): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    this.copyRequestInfoService.copyEmailRequestInfo(this.requestId, this.matchId, this.model.others.operatorsList);
    this.addRequestStore.changeBlockingUiStatus(false);
    alert(`Request No.${this.requestId} has been copied to clipboard.`);
  }

  public async copyLetsTalkRequestInfo(): Promise<void> {
    let logInfoDetail = [];
    if (StaticService.isRedCard(this.model.filter.issueTypeId)) {
      logInfoDetail = this.eventRedCardComponent.getLogInfoDetail();
    }

    if (StaticService.isDangerAccepted(this.model.filter.issueTypeId)) {
      logInfoDetail = this.eventDangerAcceptedComponent.getLogInfoDetail();
    }

    if (StaticService.isWrongScore(this.model.filter.issueTypeId)) {
      logInfoDetail = this.eventWrongScoreComponent.getLogInfoDetail();
    }

    this.addRequestStore.changeBlockingUiStatus(true);
    this.copyRequestInfoService.copyLetsTalkRequestInfo(this.requestId, this.matchId, logInfoDetail, this.model.others.operatorsList);
    this.addRequestStore.changeBlockingUiStatus(false);
    alert(`Request No.${this.requestId} has been copied to clipboard.`);
  }

  public isShowOthersFullFields(): boolean {
    return !this.isShowOthersLikeAbnormalAccount()
      && !this.isShowOthersLikeAbnormalBet()
      && !this.isShowOthersLikeWrongHDP();
  }

  public isShowOthersLikeAbnormalAccount(): boolean {
    return StaticService.isAbnormalAccount(this.model.filter.issueTypeId);
  }

  public isShowOthersLikeAbnormalBet(): boolean {
    const issueTypesShowOthersLikeAB = [
      IssueTypeConstant.ABNORMAL_BET,
      IssueTypeConstant.ARCHIVED_TICKET,
      IssueTypeConstant.DUPLICATE_TICKETS,
      IssueTypeConstant.RECOVER_TICKET
    ];

    return issueTypesShowOthersLikeAB.includes(this.model.filter.issueTypeId);
  }

  public isShowOthersLikeWrongHDP(): boolean {
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
      IssueTypeConstant.TECHNICAL_ERROR,
      IssueTypeConstant.WRONG_ODDS_SPORTS_BOOK
    ]

    return issueTypesHasSimpleFields.includes(this.model.filter.issueTypeId);
  }

  public isShowCopyInfoButton(): boolean {
    const issueTypesShowCopyInfo = [
      IssueTypeConstant.DANGER_ACCEPTED,
      IssueTypeConstant.RED_CARD,
      IssueTypeConstant.WRONG_SCORE
    ]

    return this.model.filter.isVoided && issueTypesShowCopyInfo.includes(this.model.filter.issueTypeId);
  }

  public checkAllIssueTypes(): CheckIssueTypeObjectType {
    return StaticService.checkAllIssueTypes(this.model.filter.issueTypeId);
  }
}
