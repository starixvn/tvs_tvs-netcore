
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { AdvancedModeAddRequestComponent } from '../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.component';
import { AdvancedModeAddRequestModel } from '../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.model';
import { GroupBetTypesAddRequestModel } from '../../../../utility/components/advanced-mode-add-request/group-bet-types/group-bet-types.model';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';
import { AddRequestApiService } from '../add-request-api.service';
import { AddRequestStore } from '../add-request.store';
import { InfoSiteDBDownComponent } from '../components/info-site-db-down/info-site-db-down.component';
import { ConfirmAddRequestComponent } from '../confirm-add-request/confirm-add-request.component';
import { ConfirmAddRequestModel } from '../confirm-add-request/confirm-add-request.model';
import { FilterModel } from '../filter/filter.model';
import { IssueTypes } from '../filter/issue-types.model';
import { OtherIssuesModel } from '../models/event-other-issues.model';
import { PermissionAddRequest } from '../models/permission-add-request.model';
import { OthersModel } from '../others/others.model';
import { CheckAddPermissionService } from '../services/check-permission.service';
import { FilterOtherIssuesComponent } from './filter-other-issues/filter-other-issues.component';
import { LogInfoOtherIssuesComponent } from './log-info-other-issues/log-info-other-issues.component';
import { LogInfoOtherIssues } from './models/log-info-other-issues.model';
import { PrimitiveProperty } from './models/primitive-property.model';
import { SaveRequestArg } from './models/save-request-arg.model';
import { EventOtherIssuesService } from './services/event-other-issues.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';
import { BetTypeService } from '../../../../utility/components/advanced-mode-add-request/group-bet-types/bet-type.service';

@Component({
  selector: 'event-other-issues',
  templateUrl: './event-other-issues.component.html',
  styleUrls: ['./event-other-issues.component.scss'],
  standalone: true,
  imports: [EventLeagueComponent, FilterOtherIssuesComponent, AdvancedModeAddRequestComponent,
    LogInfoOtherIssuesComponent, ConfirmAddRequestComponent, InfoSiteDBDownComponent],
  providers: [ValidationService, EventOtherIssuesService, LogInfoService, SaveRequestService,
    CheckAddPermissionService
  ]
})
export class EventOtherIssuesComponent implements OnInit, OnChanges {
  @Input() isEdit: boolean;
  @Input() userId: number;
  @Input() requestedBy: string;
  @Input() requestId: number;
  @Input() filter: FilterModel;
  @Input() issueTypeId: string;
  @Input() others = new OthersModel();
  @Input() issueTypes = new IssueTypes();
  @Input() actionIdOfFirstTimeAccess: string;
  @Input() otherIssuesModel: OtherIssuesModel;
  @Output() updateMatchId = new EventEmitter<number>();
  @ViewChild('eventLeague') eventLeagueComponent: EventLeagueComponent;
  @ViewChild('advancedMode') advancedMode: AdvancedModeAddRequestComponent;
  @ViewChild('filterOtherIssues') filterOtherIssuesComponent: FilterOtherIssuesComponent;

  groupBetTypesModel = new GroupBetTypesAddRequestModel();
  advancedModeAddRequestModel: AdvancedModeAddRequestModel;
  logInfoEvent = new LogInfoOtherIssues();
  confirmAddRequest = new ConfirmAddRequestModel();
  primitiveProps = new PrimitiveProperty();
  permission = new PermissionAddRequest();
  private readonly validationService = inject(ValidationService);
  private readonly eventOtherIssuesService = inject(EventOtherIssuesService);
  private readonly logInfoService = inject(LogInfoService);
  private readonly addRequestStore = inject(AddRequestStore);
  private readonly saveRequestService = inject(SaveRequestService);
  private readonly addRequestApiService = inject(AddRequestApiService);
  private readonly betTypeService = inject(BetTypeService);

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['filter'] && this.filter.isChangeSubTypeManual) {
      this.primitiveProps.isShowValidation = false;
      this.primitiveProps.infoSiteDBDownModel = null;
      if (this.isShowFilterTime()) {
        this.addRequestStore.changeSavingRequestStatus(true);
        this.resetCheckedBetTypes();
        this.resetBetTypeAndAdvancedMode();
        this.logInfoEvent.filterOtherIssues = this.eventOtherIssuesService.initDefaultFilter();
      } else {
        await this.renderDataBetTypesAdvancedMode();
      }
    }
  }

  async ngOnInit() {
    this.permission = await this.addRequestApiService.getPermissionAddRequest();
    if (this.isEdit) {
      this.updateDataWhenEditRequest();
    } else {
      this.logInfoEvent = this.eventOtherIssuesService.initDefaultLogInfoOtherIssues();
    }
  }

  async refreshEvent() {
    if (!this.validationService.validateCommonData(this.eventLeagueComponent, this.filterOtherIssuesComponent)) {
      return;
    }
    await this.renderDataBetTypesAdvancedMode();
  }

  async renderDataBetTypesAdvancedMode() {
    if (this.eventLeagueComponent?.selectedMatch.matchId) {
      this.resetBetTypeAndAdvancedMode();
      this.addRequestStore.changeBlockingUiStatus(true);
      this.primitiveProps.isShowAdvancedModeBetTypes = true;
      this.resetLogInfo();
      await this.getGroupBetTypes();
      const allBetTypes = this.betTypeService.getAllBetTypes(this.groupBetTypesModel.groupBetTypes);
      this.advancedMode?.changeBetTypes(allBetTypes);
      this.advancedMode?.resetAllBetTeams();
      this.primitiveProps.isShowErrorNoBetType = allBetTypes.length === 0;
      this.addRequestStore.changeBlockingUiStatus(false);
    }
  }

  async handleSearchEvent(): Promise<void> {
    this.logInfoEvent.betTeamsResult = this.advancedMode.getCheckedBetTypes();
    this.primitiveProps.isShowValidation = false;
    this.primitiveProps.infoSiteDBDownModel = null;
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);
    if (!this.validationService.validateCommonData(this.eventLeagueComponent, this.filterOtherIssuesComponent, this.advancedMode)) {
      return;
    }

    this.addRequestStore.changeBlockingUiStatus(true);
    await this.logInfoService.getLogInfo(this.logInfoEvent, this.requestId, this.filter, this.primitiveProps);

    if (!this.validationService.isAccountHasAddRequestPermission(this.filter.action, this.logInfoEvent.isHasInstantlySettledTicket,
      this.logInfoEvent.isHasSettledTicket, this.permission)) {
      this.addRequestStore.changeBlockingUiStatus(false);
      return;
    }

    this.primitiveProps.isShowValidation = true;
    this.addRequestStore.changeBlockingUiStatus(false);
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  async getGroupBetTypes() {
    this.groupBetTypesModel = await this.eventOtherIssuesService.getGroupBetTypes(
      this.eventLeagueComponent?.selectedMatch.matchId, this.logInfoEvent.filterOtherIssues, this.filter.subIssueTypeId, this.filter.issueTypeId);
  }

  async saveRequest(): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    await this.saveRequestService.saveRequest(this.initSaveRequestInput());
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  async changeMatchEvent(): Promise<void> {
    this.primitiveProps.isShowValidation = false;
    this.primitiveProps.infoSiteDBDownModel = null;
    this.updateMatchId.emit(this.logInfoEvent.matchId);
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);
    if (this.eventLeagueComponent?.selectedMatch.matchId) {
      this.logInfoEvent.matchId = this.eventLeagueComponent.selectedMatch.matchId;
      this.addRequestStore.changeSavingRequestStatus(true);
      this.resetBetTypeAndAdvancedMode();
      if (!this.isShowFilterTime()) {
        await this.renderDataBetTypesAdvancedMode();
      }
      this.primitiveProps.isShowErrorNoBetType = false;
    }
  }

  async onClickConfirmSaveRequest() {
    await this.saveRequestService.onClickConfirmSave(this.initSaveRequestInput());
  }

  updateDataWhenEditRequest(): void {
    const groupBetTypes = this.otherIssuesModel.groupBetTypes;
    groupBetTypes.forEach(x => x.betTypes.forEach(y => y.isChecked = true));
    const checkedBetTypes = groupBetTypes.flatMap(x => x.betTypes);
    this.logInfoEvent = this.eventOtherIssuesService.assignModelsToEvents(this.otherIssuesModel);
    this.groupBetTypesModel = this.betTypeService.initGroupBetTypesAddRequestModel(_.assignIn([], groupBetTypes), true, '', this.filter.isVoided);
    const betTeamsResult = this.otherIssuesModel.betTeamsResult;
    betTeamsResult.forEach(x => x.isDisabled = this.filter.isVoided);
    this.advancedModeAddRequestModel = {
      betTeamsResult: betTeamsResult,
      checkedBetTypes: checkedBetTypes,
      selectedAllBetTypes: this.otherIssuesModel.allBetTypesSelection
    };
    this.primitiveProps.isShowValidation = true;
    this.primitiveProps.isShowAdvancedModeBetTypes = true;
  }

  isShowFilterTime(){
    return this.validationService.isShowFilterTime(this.filter.issueTypeId, this.filter.subIssueTypeId);
  }
  
  resetLogInfo(): void {
    this.primitiveProps.infoSiteDBDownModel = null;
    this.primitiveProps.isShowErrorNoBetType = false;
    this.primitiveProps.isShowValidation = false;
  }

  checkExistBetTypeEvent(isHaveBetType: boolean) {
    this.primitiveProps.isShowErrorNoBetType = !isHaveBetType;
  }

  onClickCancelSaveRequest() {
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  clearInfoSiteDBDownModel(): void {
    this.primitiveProps.infoSiteDBDownModel = null;
  }

  resetLogInfoOfEvent(): void {
    this.primitiveProps.infoSiteDBDownModel = null;
    this.primitiveProps.isShowErrorNoBetType = false;
    this.primitiveProps.isShowValidation = false;
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);
  }

  checkingLoadDataAdvancedMode(isLoading: boolean): void {
    this.addRequestStore.changeBlockingUiStatus(isLoading);
  }

  private resetBetTypeAndAdvancedMode() {
    this.advancedMode?.clearBetTeam();
    this.groupBetTypesModel = this.betTypeService.initGroupBetTypesAddRequestModel([], true, '', false);
  }

  private resetCheckedBetTypes() {
    if (this.advancedModeAddRequestModel) {
      this.advancedModeAddRequestModel.checkedBetTypes = [];
    }
  }

  private initSaveRequestInput() {
    const arg = new SaveRequestArg();
    if (!this.filter.isVoided) {
      this.logInfoEvent.betTeamsResult = this.advancedMode?.getCheckedBetTypes();
      this.logInfoEvent.allBetTypesSelection = this.advancedMode?.advancedModeComponent.getAllBetTypesSelection();
    }
    arg.requestId = this.requestId;
    arg.requestedBy = this.requestedBy;
    arg.isEdit = this.isEdit;
    arg.userId = this.userId;
    arg.actionIdOfFirstTimeAccess = this.actionIdOfFirstTimeAccess;
    arg.others = this.others;
    arg.filter = this.filter;
    arg.primitiveProps = this.primitiveProps;
    arg.eventLeagueComponent = this.eventLeagueComponent;
    arg.advancedModeComponent = this.advancedMode;
    arg.filterOtherIssuesComponent = this.filterOtherIssuesComponent;
    arg.logInfoEvent = this.logInfoEvent;
    arg.confirmAddRequest = this.confirmAddRequest;
    arg.addRequestStore = this.addRequestStore;
    arg.permission = this.permission;

    return arg;
  }
}
