import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { AdvancedModeAddRequestComponent } from '../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.component';
import { AdvancedModeAddRequestModel } from '../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.model';
import { GroupBetTypesAddRequestModel } from '../../../../utility/components/advanced-mode-add-request/group-bet-types/group-bet-types.model';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';
import { AddRequestApiService } from '../add-request-api.service';
import { AddRequestStore } from '../add-request.store';
import { ConfirmAddRequestModel } from '../confirm-add-request/confirm-add-request.model';
import { FilterModel } from '../filter/filter.model';
import { IssueTypes } from '../filter/issue-types.model';
import { OtherIssuesModel } from '../models/event-other-issues.model';
import { PermissionAddRequest } from '../models/permission-add-request.model';
import { OthersModel } from '../others/others.model';
import { FilterOtherIssuesComponent } from './filter-other-issues/filter-other-issues.component';
import { LogInfoOtherIssues } from './models/log-info-other-issues.model';
import { PrimitiveProperty } from './models/primitive-property.model';
import { SaveRequestArg } from './models/save-request-arg.model';
import { EventOtherIssuesService } from './services/event-other-issues.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';

@Component({
  selector: 'event-other-issues',
  templateUrl: './event-other-issues.component.html',
  styleUrls: ['./event-other-issues.component.scss']
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

  groupBetTypesModel = new GroupBetTypesAddRequestModel([], false, '', false);
  advancedModeAddRequestModel: AdvancedModeAddRequestModel;
  logInfoEvent = new LogInfoOtherIssues();
  confirmAddRequest = new ConfirmAddRequestModel();
  primitiveProps = new PrimitiveProperty();
  permission = new PermissionAddRequest();
  constructor(
    private readonly validationService: ValidationService,
    private readonly eventOtherIssuesService: EventOtherIssuesService,
    private readonly logInfoService: LogInfoService,
    private readonly addRequestStore: AddRequestStore,
    private readonly saveRequestService: SaveRequestService,
    private readonly addRequestApiService: AddRequestApiService
  ) { }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['filter'] && this.filter.isChangeSubTypeManual &&
      !this.isSubTypeRestart() && !this.primitiveProps.isFetchedBetTypes) {
      await this.renderDataBetTypesAdvancedMode();
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
      this.resetLogInfo();
      await this.getGroupBetTypes();
      const allBetTypes = this.groupBetTypesModel.getAllBetTypes();
      this.advancedMode?.changeBetTypes(allBetTypes);
      this.primitiveProps.isFetchedBetTypes = true;
      this.primitiveProps.isShowErrorNoBetType = allBetTypes.length === 0;
    }
  }

  async handleSearchEvent(): Promise<void> {
    this.logInfoEvent.betTeamsResult = this.advancedMode.getCheckedBetTypes();
    this.primitiveProps.isShowValidation = false;
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);
    if (!this.validationService.validateCommonData(this.eventLeagueComponent, this.filterOtherIssuesComponent, this.advancedMode)) {
      return;
    }

    this.addRequestStore.changeBlockingUiStatus(true);
    await this.logInfoService.getLogInfo(this.logInfoEvent, this.isEdit, this.requestId, this.filter, this.primitiveProps);

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
    this.addRequestStore.changeBlockingUiStatus(true);
    this.groupBetTypesModel = await this.eventOtherIssuesService.getGroupBetTypes(
      this.eventLeagueComponent?.selectedMatch.matchId, this.otherIssuesModel,
      this.groupBetTypesModel.groupBetTypes.flatMap(x => x.betTypes).filter(x => x.isChecked));
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  async saveRequest(): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    await this.saveRequestService.saveRequest(this.initSaveRequestInput());
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  async changeMatchEvent(): Promise<void> {
    this.primitiveProps.isShowValidation = false;
    this.updateMatchId.emit(this.logInfoEvent.matchId);
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);
    if (this.eventLeagueComponent?.selectedMatch.matchId) {
      this.logInfoEvent.matchId = this.eventLeagueComponent.selectedMatch.matchId;
      this.addRequestStore.changeSavingRequestStatus(true);
      this.resetBetTypeAndAdvancedMode();
      if (!this.isSubTypeRestart()) {
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
    this.groupBetTypesModel = new GroupBetTypesAddRequestModel(_.assignIn([], groupBetTypes), true, '', this.filter.isVoided);
    const betTeamsResult = this.otherIssuesModel.betTeamsResult;
    betTeamsResult.forEach(x => x.isDisabled = this.filter.isVoided);
    this.advancedModeAddRequestModel = {
      betTeamsResult: betTeamsResult,
      checkedBetTypes: checkedBetTypes
    };
    this.primitiveProps.isShowValidation = true;
  }

  isSubTypeRestart() {
    return this.validationService.isSubTypeRestart(this.filter.subIssueTypeId);
  }

  resetLogInfo(): void {
    this.primitiveProps.isShowErrorNoBetType = false;
    this.primitiveProps.isShowValidation = false;
  }

  checkExistBetTypeEvent(isHaveBetType: boolean) {
    this.primitiveProps.isShowErrorNoBetType = !isHaveBetType;
  }

  onClickCancelSaveRequest() {
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  resetLogInfoOfEvent(): void {
    this.primitiveProps.isShowValidation = false;
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);
  }

  private resetBetTypeAndAdvancedMode() {
    this.advancedMode?.clearBetTeam();
    this.groupBetTypesModel = new GroupBetTypesAddRequestModel([], true, '', false);
  }

  private initSaveRequestInput() {
    const arg = new SaveRequestArg();
    if (!this.filter.isVoided) {
      this.logInfoEvent.betTeamsResult = this.advancedMode.getCheckedBetTypes();
    }
    arg.requestId = this.requestId;
    arg.requestedBy = this.requestedBy;
    arg.isEdit = this.isEdit;
    arg.userId = this.userId;
    arg.actionIdOfFirstTimeAccess = this.actionIdOfFirstTimeAccess;
    arg.others = this.others;
    arg.filter = this.filter;
    arg.primitiveProps = this.primitiveProps;
    arg.issueTypes = this.issueTypes;
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
