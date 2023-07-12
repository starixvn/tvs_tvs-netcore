import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Guid } from 'guid-typescript';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { ModalType } from '../../../utility/components/modal/modal.model';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { AbnormalFilterBy, TVSRequestActionType } from '../../../utility/constants/config';
import { LABELS } from '../../../utility/constants/labels';
import { MatchInfo } from '../../../utility/models/event.model';
import { Result } from '../../../utility/models/result';
import { CommonService } from '../../../utility/services/common.service';
import { StaticService } from '../../../utility/services/static.service';
import { AbnormalAccountsComponent } from './abnormal-accounts/abnormal-accounts.component';
import { AddRequestApiService } from './add-request-api.service';
import { EarlyKickOffService } from './add-request.service';
import { AddRequestStore } from './add-request.store';
import { EventAbnormalBetComponent } from './event-abnormal-bet/event-abnormal-bet.component';
import { EventDangerAcceptedComponent } from './event-danger-accepted/event-danger-accepted.component';
import { EventEarlyKickOffComponent } from './event-early-kick-off/event-early-kick-off.component';
import { EventRedCardComponent } from './event-red-card/event-red-card.component';
import { EventReducedOverComponent } from './event-reduced-over/event-reduced-over.component';
import { EventTicket14Component } from './event-ticket14/event-ticket14.component';
import { EventWrongHdpComponent } from './event-wrong-hdp/event-wrong-hdp.component';
import { EventWrongOddsComponent } from './event-wrong-odds/event-wrong-odds.component';
import { EventWrongOuComponent } from './event-wrong-ou/event-wrong-ou.component';
import { EventWrongScoreComponent } from './event-wrong-score/event-wrong-score.component';
import { FilterComponent } from './filter/filter.component';
import { FilterModel } from './filter/filter.model';
import { IssueTypes } from './filter/issue-types.model';
import { AddRequestQuery } from './models/add-request.query';
import { AddRequestResultModel, RequestModel } from './models/request.model';
import { TransInfoAddRequestModel } from './models/trans-info-add-request.model';

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

  isCollapse: boolean;
  isBlock: boolean;
  issueTypes = new IssueTypes();
  isSaveRequestHasWarning: false;
  isDisabledSaveButton = false;
  checkValidSubIssueTypeInFilterSubscription: Subscription;

  savingRequestSubscription: Subscription;
  blockingUiSubscription: Subscription;
  abnormalFilterBySubscription = new Subscription();
  abnormalFilterBy: number;
  parentMatchId: number = null;

  constructor(
    private readonly addRequestApiService: AddRequestApiService,
    private readonly modalService: ModalService,
    private readonly commonService: CommonService,
    private readonly addRequestStore: AddRequestStore
  ) { }

  ngOnInit(): void {
    this.savingRequestSubscription = this.addRequestStore.savingRequestStatus.subscribe(status => {
      this.isDisabledSaveButton = status;
    });

    this.blockingUiSubscription = this.addRequestStore.blockingUiStatus.subscribe(status => {
      this.isBlock = status;
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

    if (this.isExternalUrl && this.isLikelyAbnormalBetIssueType()) {
      await new Promise(resolve => setTimeout(resolve));
      await this.eventAbnormalBetComponent.afterFocusOutBetIds();
    }
  }

  updateMatchId(matchId: number): void {
    this.matchId = matchId;
  }

  updateMatchInfo(match: MatchInfo): void {
    this.matchId = match?.matchId;
    this.parentMatchId = match?.parentId;
  }

  private showErrorModal(messageContent: string): void {
    this.modalService.open(
      {
        title: LABELS.ADD_REQUEST_RESULT_TITLE,
        message: `Error: ${messageContent}`,
        type: ModalType.Error
      },
      () => {
        this.isDisabledSaveButton = false;
      }
    );
  }

  //#region EKO
  async saveRequestEarlyOrWrongKO(isSaveAndVoidButton: boolean): Promise<void> {
    const isDataValid = this.model.filter.isVoided ? true : await this.eventEarlyKickOffComponent.isValid();
    if (isDataValid) {
      if (this.isEditingByAnotherUser() || this.eventEarlyKickOffComponent.warningMessageList.length > 0) {
        this.modalService.confirm(
          {
            title: 'Confirm',
            message: this.getMessageConfirmationEKO(),
            type: ModalType.Confirm
          },
          async () => this.executeSaveRequestEarlyKO(isSaveAndVoidButton, this.eventEarlyKickOffComponent.transInfoAddRequestModel),
          () => this.isDisabledSaveButton = false
        );
      } else {
        await this.executeSaveRequestEarlyKO(isSaveAndVoidButton, this.eventEarlyKickOffComponent.transInfoAddRequestModel);
      }
    } else {
      this.isDisabledSaveButton = false;
    }
  }
  
  private getMessageConfirmationEKO(): string {
    let message = '';
    
    if (this.eventEarlyKickOffComponent.warningMessageList.length > 0) {
      message = 'There are some warnings in this request.';
    }
    if (this.isEditingByAnotherUser()) {
      message = `${message}<div style="color:red">Please remind this request ${this.requestId} is confirmed by ${this.requestedBy}.</div>`;
    }

    return `${message}<div class='mg-top-10'><i class="fa fa-question-circle text-confirm"></i> ARE YOU SURE YOU WANT TO PROCESS WITH ABOVE INFO?</div>`;
  }

  async executeSaveRequestEarlyKO(isSaveAndVoidButton: boolean, transInfoAddRequestModel: TransInfoAddRequestModel): Promise<void> {
    const query = EarlyKickOffService.initAddRequestQuery(this.model, transInfoAddRequestModel);

    if (this.isEdit) {
      await this.editSingleRequest(query, isSaveAndVoidButton);
    } else {
      await this.addSingleRequest(query, isSaveAndVoidButton);
    }
  }
  //#endregion EKO

  async saveRequest(isSaveAndVoidButton: boolean): Promise<void> { // NOSONAR
    if (!this.isEdit) {
      const PREVIOUS_SELECTED_ISSUETYPE = 'PreviousSelectedIssueType';
      localStorage.setItem(PREVIOUS_SELECTED_ISSUETYPE + document.getElementById('body').getAttribute('user-id'),
        this.model.filter.issueTypeId);
    }
    this.isDisabledSaveButton = true;

    if (this.isLikelyAbnormalBetIssueType()) {
      await this.eventAbnormalBetComponent.saveRequest();
    }

    if (this.isEarlyOrWrongKO()) {
      await this.saveRequestEarlyOrWrongKO(isSaveAndVoidButton);
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

    if (this.isReducedOver()) {
      await this.eventReducedOverComponent.saveRequest();
    }
  }

  async addSingleRequest(query: AddRequestQuery, isSaveAndVoid: boolean) {
    this.isBlock = true;
    query.guid = `AddRequest-${Guid.create().toString()}`;
    const result = await this.addRequestApiService.addRequest(query);
    if (result) {
      this.handleAfterAddRequest(result, isSaveAndVoid);
    } else {
      this.getAddResultCache(query.guid, isSaveAndVoid);
    }
  }

  private handleAfterAddRequest(addResult: Result<AddRequestResultModel>, isSaveAndVoid: boolean) {
    if (addResult.isSuccessful) {
      let matchIds = '';
      if (this.isEarlyOrWrongKO()) {
        matchIds = `<div class="ml-2 mt-1">- Match(es): <strong>${addResult.data.matchId}</strong></div>`;
      }
      if (isSaveAndVoid) {
        this.goToVoidPage(Number(addResult.data.requestId));
      } else {
        this.isBlock = false;
        this.modalService.open(
          {
            title: LABELS.ADD_REQUEST_RESULT_TITLE,
            message: `<div>Request No.<strong>${addResult.data.requestId}</strong> added successfully!</div>${matchIds}`,
            type: ModalType.Alert
          },
          () => this.reloadPageOrBackToManagePage()
        );
      }
    } else {
      this.openModelErrorMessageRequest(addResult, LABELS.ADD_REQUEST_RESULT_TITLE);
    }
  }

  private getAddResultCache(guid: string, isSaveAndVoid: boolean) {
    let isChecking = false;
    const interval = setInterval(async () => {
      if (!isChecking) {
        isChecking = true;
        const result = await this.commonService.getResultCache<AddRequestResultModel>(guid);
        if (result) {
          this.handleAfterAddRequest(result, isSaveAndVoid);
          clearInterval(interval);
        }
        isChecking = false;
      }
    }, 2000);
  }

  async editSingleRequest(query: AddRequestQuery, isSaveAndVoid: boolean) {
    this.isBlock = true;
    query.requestId = this.requestId;
    const result = await this.addRequestApiService.editRequest(query);

    if (result.isSuccessful) {
      if (isSaveAndVoid) {
        this.goToVoidPage(this.requestId);
      } else {
        this.isBlock = false;
        this.modalService.open(
          {
            title: LABELS.EDIT_REQUEST_RESULT_TITLE,
            message: `Request No.<strong>${this.requestId}</strong> edited successfully!`,
            type: ModalType.Alert
          },
          () => this.reloadPageOrBackToManagePage()
        );
      }
    } else {
      this.openModelErrorMessageRequest(result, LABELS.EDIT_REQUEST_RESULT_TITLE);
    }
  }

  async editSingleRequestHaveConfirm(query: AddRequestQuery, isSaveAndVoid: boolean, isConfirmThreeButton: boolean) {
    if (isConfirmThreeButton) {
      this.modalService.confirmWithThreeButton(
        {
          title: 'Confirm',
          message: LABELS.CONFIRM_TVS_UNMARK_TICKET_AND_AUTO_CAL,
          type: ModalType.ConfirmThreeButton
        },
        async () => {
          query.isConfirmCalculator = true;
          await this.editSingleRequest(query, false);
        },
        async () => {
          query.isConfirmCalculator = false;
          await this.editSingleRequest(query, false);
        },
        () => {
          this.isDisabledSaveButton = false;
        }
      );
    } else {
      this.modalService.confirm(
        {
          title: 'Confirm',
          message: LABELS.CONFIRM_TVS_UNMARK_TICKET,
          type: ModalType.Confirm
        },
        async () => {
          query.isConfirmCalculator = false;
          await this.editSingleRequest(query, false);
        },
        () => {
          this.isDisabledSaveButton = false;
        }
      );
    }
  }

  openModelErrorMessageRequest(result: Result<AddRequestResultModel>, titleMessage: string) {
    this.isBlock = false;

    this.modalService.open(
      {
        title: titleMessage,
        message: `Error: ${result.errorMsg}`,
        type: ModalType.Error
      },
      () => this.isDisabledSaveButton = false,
    );
  }

  reloadPageOrBackToManagePage() {
    this.isLikelyAbnormalBetIssueType() ? window.location.reload() : window.location.assign(`TicketVoidingSystem/ManageRequest/Index`);
  }

  goToVoidPage(requestId: number): void {
    window.location.assign(`TicketVoidingSystem/VoidRequest/Index/${requestId}`);
  }

  backToManagePage() {
    window.location.assign(`TicketVoidingSystem/ManageRequest/Index`);
  }

  updateModel(filterModel: FilterModel): void {
    this.model.filter = _.clone(filterModel);
    if (!this.isEdit && this.isLikelyAbnormalBetIssueType()) {
      this.model.others.decidedBy = document.getElementById('body').getAttribute('user-name');
    }
  }

  public getEventLabel(): string {
    if (this.isAbnormalAccount()) {
      return 'Username';
    } else if (this.isArchivedTicketIssueType()) {
      return 'Ticket Info';
    } else {
      return 'Event';
    }
  }

  private isEditingByAnotherUser(): boolean {
    const editingBy = Number(document.getElementById('body').getAttribute('user-id'));

    return this.isEdit && editingBy !== this.userId;
  }
  
  isShowOthersSimpleFields(): boolean {
    return this.isWrongHDP() || this.isWrong1stHDP() || this.isWrongOU() || this.isWrong1stOU() || this.isWrongOdds() || this.isReducedOver();
  }

  isShowOthersFullFields(): boolean {
    return !this.isAbnormalBetMixParlay() && !this.isAbnormalAccount() && !this.isArchivedTicketIssueType()
      && !this.isWrongHDP() && !this.isWrong1stHDP() && !this.isWrongOU() && !this.isWrong1stOU() && !this.isWrongOdds() && !this.isReducedOver();
  }

  isShowSaveAndVoidButton(): boolean {
    return (this.model.filter.action === TVSRequestActionType.MANUAL_VOID_ID.toString())
      && this.isEarlyOrWrongKO();
  }

  isLikelyAbnormalBetIssueType(): boolean {
    return this.isAbnormalBetIssueType() || this.isAbnormalBetRealMemberIssueType();
  }

  private isAbnormalBetIssueType(): boolean {
    return StaticService.isAbnormalBet(this.model.filter.issueTypeId);
  }

  private isAbnormalBetRealMemberIssueType(): boolean {
    return StaticService.isAbnormalBetRealMember(this.model.filter.issueTypeId);
  }

  isAbnormalBetMixParlay(): boolean {
    return this.isAbnormalBetIssueType() && this.abnormalFilterBy === AbnormalFilterBy.MIX_PARLAY;
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

  isReducedOver(): boolean {
    return StaticService.isReducedOver(this.model.filter.issueTypeId);
  }
}
